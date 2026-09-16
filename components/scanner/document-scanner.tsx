'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Check, Lightbulb, RotateCcw, ScanLine, Sun, X, ZoomIn, ZoomOut } from 'lucide-react';
import { guidance, movement, scannerConfig, StabilityTracker, withinFrame, type Detection, type Quad } from '@/lib/scanner/geometry';
import { enhanceDocument, type DocumentFilter } from '@/lib/scanner/enhance';
// The bundler creates this default export; the linter cannot see through the
// "?worker" suffix, which worker-env.d.ts declares for TypeScript.
// eslint-disable-next-line import/default
import ScannerWorker from '@/lib/scanner/scanner.worker.ts?worker';
import styles from './document-scanner.module.css';

type Result = { original: Blob; corrected: Blob; url: string; cropped: boolean };
type Reply = { id: number; detection?: Detection | null; image?: ImageData; error?: string; ready?: boolean };
type PhotoCapture = { takePhoto(): Promise<Blob> };
type PhotoCaptureConstructor = new (track: MediaStreamTrack) => PhotoCapture;
const canvas = (width: number, height: number) => Object.assign(document.createElement('canvas'), { width, height });
/**
 * Longest edge of the picture handed to the straightening step. A full sensor
 * photo is 12 megapixels and, on phones that give takePhoto() the whole sensor,
 * up to 48 — 186 MB of pixels to copy into the wasm worker, warp, and copy back,
 * which is what makes a capture stall or give up. This is still more detail than
 * the OCR pass works at: a scanned PDF page reaches it at around 2100 x 2750.
 */
const CROP_MAX = 2600;
/** Automatic tries before the photo is worth more than the crop. */
const AUTO_TRIES = 3;
/** The same picture, no larger than maxSize on its long edge. */
function fit(surface: HTMLCanvasElement, maxSize: number) {
  const scale = Math.min(1, maxSize / Math.max(surface.width, surface.height));
  if (scale === 1) return surface;
  const out = canvas(Math.round(surface.width * scale), Math.round(surface.height * scale));
  out.getContext('2d')!.drawImage(surface, 0, 0, out.width, out.height);
  return out;
}
const blobFrom = (surface: HTMLCanvasElement) => new Promise<Blob>((resolve, reject) => surface.toBlob(b => b ? resolve(b) : reject(new Error('Could not save photo')), 'image/jpeg', 0.97));

/** The page with one filter applied: the blob that gets stored, and a URL to show. */
async function renderFiltered(pixels: ImageData, filter: DocumentFilter) {
  const page = enhanceDocument(pixels, filter);
  const surface = canvas(page.width, page.height);
  surface.getContext('2d')!.putImageData(new ImageData(page.data, page.width, page.height), 0, 0);
  const blob = await blobFrom(surface);
  return { blob, url: URL.createObjectURL(blob) };
}

/** Both images stay in this session; only the corrected File crosses the existing upload boundary. */
export default function DocumentScanner({ onClose, onUse }: { onClose: () => void; onUse: (file: File) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const polygon = useRef<SVGPolygonElement>(null);
  const outline = useRef<SVGSVGElement>(null);
  const shutter = useRef<(() => void) | null>(null);
  const [session, setSession] = useState(0);
  const [instruction, setInstruction] = useState('Find ticket');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [aspect, setAspect] = useState(3 / 4);
  // The captured page as pixels, so a filter can be tried without re-shooting.
  const captured = useRef<ImageData | null>(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    dialog.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  useEffect(() => {
    let disposed = false, generation = 0, stream: MediaStream | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let locked = false, reviewed = false, workerReady = false, sequence = 0, autoFailures = 0;
    let previous: Quad | null = null, smoothed: Quad | null = null;
    const stability = new StabilityTracker();
    const pending = new Map<number, { resolve(value: Reply): void; reject(error: Error): void; timeout: ReturnType<typeof setTimeout> }>();
    // The ?worker form is resolved by the bundler in development and in the
    // build; a plain new URL() only resolves at build time.
    let worker: Worker | null = null;
    const failWorker = () => {
      workerReady = false;
      pending.forEach(p => { clearTimeout(p.timeout); p.reject(new Error('Document processing unavailable')); });
      pending.clear();
      if (!disposed) setInstruction('Automatic scan unavailable · take a photo');
    };
    try {
      worker = new ScannerWorker();
    } catch {
      // Without the worker the camera still takes photos by hand.
      failWorker();
    }
    if (worker) worker.onerror = failWorker;
    if (worker) worker.onmessage = ({ data }: MessageEvent<Reply>) => {
      if (data.ready) { workerReady = true; return; }
      const request = pending.get(data.id);
      if (!request) { if (data.error) failWorker(); return; }
      clearTimeout(request.timeout); pending.delete(data.id);
      if (data.error) request.reject(new Error(data.error)); else request.resolve(data);
    };
    function process(image: ImageData, kind: 'detect' | 'crop', corners?: Quad): Promise<Reply> {
      return new Promise((resolve, reject) => {
        if (!worker) { reject(new Error('Document processing unavailable')); return; }
        const id = ++sequence;
        const timeout = setTimeout(() => { pending.delete(id); reject(new Error('Document processing timed out')); }, 20000);
        pending.set(id, { resolve, reject, timeout });
        worker.postMessage({ id, kind, image, corners }, [image.data.buffer]);
      });
    }
    function stopCamera() {
      generation++; clearTimeout(timer); stream?.getTracks().forEach(track => track.stop()); stream = null;
      if (video.current) video.current.srcObject = null;
      stability.reset(); previous = smoothed = null;
      polygon.current?.setAttribute('points', '');
      if (outline.current) outline.current.dataset.locked = 'false';
      if (!disposed) setReady(false);
    }
    function frame(maxSize: number) {
      const v = video.current;
      if (!v || v.readyState < 2 || !v.videoWidth) throw new Error('Camera is not ready');
      const scale = Math.min(1, maxSize / Math.max(v.videoWidth, v.videoHeight));
      const surface = canvas(Math.round(v.videoWidth * scale), Math.round(v.videoHeight * scale));
      surface.getContext('2d')!.drawImage(v, 0, 0, surface.width, surface.height);
      return surface;
    }
    async function capture(automatic: boolean, live: Detection | null = null) {
      if (locked || disposed || !stream || document.hidden) return;
      locked = true; setCapturing(true); clearTimeout(timer);
      const token = generation;
      try {
        // Full sensor photo where supported; otherwise the negotiated full-resolution video frame.
        let source = frame(Infinity);
        let original: Blob | null = null;
        const ImageCapture = (window as Window & { ImageCapture?: PhotoCaptureConstructor }).ImageCapture;
        if (ImageCapture && stream.getVideoTracks()[0]) {
          try {
            const photo = await new ImageCapture(stream.getVideoTracks()[0]).takePhoto();
            const bitmap = await createImageBitmap(photo);
            source = canvas(bitmap.width, bitmap.height);
            source.getContext('2d')!.drawImage(bitmap, 0, 0); bitmap.close(); original = photo;
          } catch { /* Safari and cameras without still-photo support use the full video frame. */ }
        }
        if (!original) original = await blobFrom(source);
        if (disposed || token !== generation) return;
        let cropped = false;
        // The straightened page, when there is one, as the pixels a filter is
        // applied to. Without a crop the photograph itself is the page.
        let page: HTMLCanvasElement | null = null;
        // Why the crop was turned away, in the words the next try needs. One
        // message for everything left people repositioning a ticket that was
        // already in the right place.
        let reason = 'Reposition the ticket and try again';
        if (workerReady) {
          try {
            // Re-detect on the actual still: still-photo FoV can differ from the preview.
            const scale = Math.min(1, 1440 / Math.max(source.width, source.height));
            const analysis = canvas(Math.round(source.width * scale), Math.round(source.height * scale));
            analysis.getContext('2d')!.drawImage(source, 0, 0, analysis.width, analysis.height);
            const detected = (await process(analysis.getContext('2d')!.getImageData(0, 0, analysis.width, analysis.height), 'detect')).detection;
            // The same rule the preview used: the bottom may run off frame.
            const inside = detected ? withinFrame(detected.corners) : false;
            const matches = !live || (detected && movement(live.corners, detected.corners) < 0.12);
            const advice = detected ? guidance(detected, source.width, source.height) : '';
            if (!detected || detected.confidence < scannerConfig.minConfidence) reason = 'Ticket edges not found in the photo';
            else if (!inside) reason = 'Fit the whole ticket in view';
            else if (!matches) reason = 'Ticket moved · hold steady';
            else if (automatic && advice !== 'Hold still...') reason = advice;
            else if (automatic && detected.sharpness < scannerConfig.minSharpness) reason = 'Photo came out blurred';
            else {
              const warp = fit(source, CROP_MAX);
              const output = (await process(warp.getContext('2d')!.getImageData(0, 0, warp.width, warp.height), 'crop', detected.corners)).image;
              if (!output) throw new Error('Could not straighten the photo');
              const correctedCanvas = canvas(output.width, output.height);
              correctedCanvas.getContext('2d')!.putImageData(output, 0, 0);
              cropped = true; page = correctedCanvas;
            }
          } catch (error) {
            reason = error instanceof Error && error.message === 'Could not straighten the photo'
              ? error.message
              : 'Straightening is not responding · photo kept';
          }
        }
        if (disposed || token !== generation) return;
        // A ticket the detector keeps re-finding but will not re-confirm used to
        // loop here for ever, throwing away a good photo each time. After a few
        // goes the photo is worth more than the crop: review shows it uncropped,
        // with Retake a tap away.
        if (automatic && !cropped && ++autoFailures < AUTO_TRIES) throw new Error(reason);
        if (cropped) autoFailures = 0;
        reviewed = true; stopCamera();
        navigator.vibrate?.(35);
        // Every capture is developed before it is shown: a photograph of paper
        // is not what the reader downstream is built for (see lib/scanner/
        // enhance.ts). The filter row on review can change it afterwards.
        //
        // Developing is a nicety and a photo is not. The camera has already been
        // stopped by this point, so anything that fails here must still end at
        // the review screen with the picture that was taken.
        let shown: { blob: Blob; url: string };
        try {
          const sheet = page ?? fit(source, CROP_MAX);
          const pixels = sheet.getContext('2d')!.getImageData(0, 0, sheet.width, sheet.height);
          captured.current = pixels;
          shown = await renderFiltered(pixels, 'auto');
        } catch {
          captured.current = null;
          shown = { blob: original, url: URL.createObjectURL(original) };
        }
        // Only disposal matters from here. stopCamera() moves the generation on
        // by design, so comparing the token against it after that point would
        // throw away every capture that was just taken.
        if (disposed) { URL.revokeObjectURL(shown.url); return; }
        setResult({ original, corrected: shown.blob, cropped, url: shown.url });
      } catch (e) {
        if (!disposed && token === generation) {
          setInstruction(e instanceof Error ? e.message : 'Please try again');
          stability.reset(); timer = setTimeout(() => void analyze(), 900);
        }
      } finally { locked = false; if (!disposed) setCapturing(false); }
    }
    async function analyze() {
      const token = generation;
      if (disposed || locked || reviewed || !stream || document.hidden) return;
      try {
        if (workerReady) {
          const surface = frame(scannerConfig.analysisSize);
          const detection = (await process(surface.getContext('2d')!.getImageData(0, 0, surface.width, surface.height), 'detect', previous ?? undefined)).detection ?? null;
          if (disposed || token !== generation || locked) return;
          const v = video.current!;
          setAspect(v.videoWidth / v.videoHeight);
          const message = guidance(detection, v.videoWidth, v.videoHeight);
          setInstruction(message);
          if (detection && detection.confidence >= scannerConfig.minConfidence) {
            const current = detection.corners;
            smoothed = smoothed && movement(smoothed, current) < 0.1 ? current.map((p, i) => ({ x: smoothed![i].x * 0.6 + p.x * 0.4, y: smoothed![i].y * 0.6 + p.y * 0.4 })) as Quad : current;
            polygon.current?.setAttribute('points', smoothed.map(p => `${p.x * 1000},${p.y * 1000}`).join(' '));
            previous = current;
          } else { previous = smoothed = null; polygon.current?.setAttribute('points', ''); }
          const acceptable = !!detection && message === 'Hold still...' && detection.sharpness >= scannerConfig.minSharpness;
          if (outline.current) outline.current.dataset.locked = acceptable ? 'true' : 'false';
          if (stability.update(detection?.corners ?? null, acceptable, performance.now())) { await capture(true, detection); return; }
        }
      } catch { stability.reset(); if (!disposed) setInstruction('Automatic scan unavailable · take a photo'); }
      if (!disposed && token === generation && !locked && !reviewed) timer = setTimeout(() => void analyze(), scannerConfig.intervalMs);
    }
    async function startCamera() {
      if (disposed || reviewed || document.hidden) return;
      stopCamera(); const token = generation;
      setError(''); setInstruction('Find ticket'); autoFailures = 0;
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera requires a secure connection and a supported browser.');
        const next = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 4096 }, height: { ideal: 3072 } } });
        if (disposed || token !== generation || document.hidden) { next.getTracks().forEach(track => track.stop()); return; }
        stream = next;
        const v = video.current!; v.srcObject = next; await v.play();
        if (disposed || token !== generation) return;
        next.getVideoTracks()[0].addEventListener('ended', () => {
          if (!disposed && !reviewed && token === generation) { stopCamera(); setError('Camera interrupted. Tap Retry camera.'); }
        }, { once: true });
        setAspect(v.videoWidth / v.videoHeight); setReady(true); void analyze();
      } catch (e) {
        if (!disposed && token === generation) {
          stopCamera();
          setError(e instanceof DOMException && e.name === 'NotAllowedError' ? 'Allow camera access in your browser settings, then retry.' : 'Camera unavailable. Check camera access, then retry.');
        }
      }
    }
    const visibility = () => { if (document.hidden) stopCamera(); else if (!reviewed) void startCamera(); };
    const orientation = () => { stability.reset(); previous = smoothed = null; polygon.current?.setAttribute('points', ''); if (outline.current) outline.current.dataset.locked = 'false'; };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('orientationchange', orientation);
    window.addEventListener('pagehide', stopCamera);
    window.addEventListener('pageshow', visibility);
    shutter.current = () => { void capture(false); };
    void startCamera();
    return () => {
      disposed = true; stopCamera(); worker?.terminate(); shutter.current = null;
      pending.forEach(p => { clearTimeout(p.timeout); p.reject(new Error('Scanner closed')); }); pending.clear();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('orientationchange', orientation);
      window.removeEventListener('pagehide', stopCamera);
      window.removeEventListener('pageshow', visibility);
    };
  }, [session]);

  // An icon for each thing the detector asks for, so the coaching line reads
  // at a glance from arm's length. Anything unexpected (a worker failure, a
  // capture that had to be retried) simply has no icon.
  const hint = error || (capturing ? 'Capturing…' : instruction);
  const COACHING: Record<string, typeof ScanLine> = {
    'Find ticket': ScanLine,
    'Move back': ZoomOut,
    'Move closer': ZoomIn,
    'Hold phone straighter': RotateCcw,
    'More light needed': Lightbulb,
    'Reduce glare': Sun,
    'Hold still...': Check,
  };
  const coaching = capturing || hint in COACHING;
  const HintIcon = error || !coaching ? RotateCcw : COACHING[hint] ?? null;
  // Coaching is the ordinary running commentary and stays quiet. Anything else
  // — a camera fault, a photo the straightening step turned away — is something
  // that went wrong and says so.
  const tone = hint === 'Hold still...' ? 'lock' : error || !coaching ? 'error' : undefined;

  return createPortal(
    <dialog ref={dialog} className={styles.scanner} aria-label="Scan load ticket" onCancel={event => { event.preventDefault(); close.current(); }}>
      <div className={styles.stage}>
        {result ? <Image unoptimized width={1200} height={1600} className={styles.preview} src={result.url} alt={result.cropped ? 'Cropped and perspective-corrected ticket' : 'Original ticket photo'} /> :
          <div className={styles.frame} style={{ aspectRatio: aspect, width: `min(100%, calc((100dvh - var(--chrome)) * ${aspect}))` }}>
            <video ref={video} autoPlay playsInline muted className={styles.video} />
            <svg ref={outline} viewBox="0 0 1000 1000" preserveAspectRatio="none" className={styles.outline} data-locked="false" aria-hidden="true"><polygon ref={polygon} points="" vectorEffect="non-scaling-stroke" /></svg>
            <div className={styles.brackets} aria-hidden="true"><i /><i /><i /><i /></div>
          </div>}
        {capturing ? <div className={styles.flash} aria-hidden="true" /> : null}
      </div>

      <header className={styles.header}>
        <span className={styles.title}>{result ? 'Review ticket' : 'Scan ticket'}</span>
        <button type="button" className={styles.close} aria-label="Close scanner" onClick={onClose}><X size={19} /></button>
      </header>

      <footer className={styles.footer}>
        {result ? <>
          <p className={styles.status} data-tone={result.cropped ? 'good' : 'warn'}>{result.cropped ? <><Check size={15} />Ready to use</> : <><Sun size={15} />Edges unclear · original photo kept</>}</p>
          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={() => { captured.current = null; setResult(null); setSession(s => s + 1); }}>Retake</button>
            <button type="button" className={styles.primary} onClick={() => { onUse(new File([result.corrected], `ticket-${Date.now()}.${result.corrected.type === 'image/png' ? 'png' : 'jpg'}`, { type: result.corrected.type })); }}>Use Photo</button>
          </div>
        </> : <>
          <output className={styles.hint} data-tone={tone} aria-live="polite">{HintIcon ? <HintIcon size={15} /> : null}{hint}</output>
          {error ? <button type="button" className={styles.secondary} onClick={() => setSession(s => s + 1)}>Retry camera</button> :
            <button type="button" className={styles.shutter} disabled={!ready || capturing} aria-label="Take photo manually" onClick={() => shutter.current?.()}><span /></button>}
        </>}
      </footer>
    </dialog>, document.body,
  );
}
