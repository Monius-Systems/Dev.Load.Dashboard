'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Camera, X } from 'lucide-react';
import { guidance, movement, scannerConfig, StabilityTracker, type Detection, type Quad } from '@/lib/scanner/geometry';
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
const blobFrom = (surface: HTMLCanvasElement) => new Promise<Blob>((resolve, reject) => surface.toBlob(b => b ? resolve(b) : reject(new Error('Could not save photo')), 'image/jpeg', 0.97));

/** Both images stay in this session; only the corrected File crosses the existing upload boundary. */
export default function DocumentScanner({ onClose, onUse }: { onClose: () => void; onUse: (file: File) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const polygon = useRef<SVGPolygonElement>(null);
  const shutter = useRef<(() => void) | null>(null);
  const [session, setSession] = useState(0);
  const [instruction, setInstruction] = useState('Find ticket');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [aspect, setAspect] = useState(3 / 4);
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
    let locked = false, reviewed = false, workerReady = false, sequence = 0;
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
        let corrected = original, cropped = false;
        if (workerReady) {
          try {
            // Re-detect on the actual still: still-photo FoV can differ from the preview.
            const scale = Math.min(1, 1440 / Math.max(source.width, source.height));
            const analysis = canvas(Math.round(source.width * scale), Math.round(source.height * scale));
            analysis.getContext('2d')!.drawImage(source, 0, 0, analysis.width, analysis.height);
            const detected = (await process(analysis.getContext('2d')!.getImageData(0, 0, analysis.width, analysis.height), 'detect')).detection;
            const inside = detected?.corners.every(p => p.x > scannerConfig.frameMargin && p.y > scannerConfig.frameMargin && p.x < 1 - scannerConfig.frameMargin && p.y < 1 - scannerConfig.frameMargin);
            const matches = !live || (detected && movement(live.corners, detected.corners) < 0.12);
            if (detected && inside && matches && detected.confidence >= scannerConfig.minConfidence) {
              if (automatic && (guidance(detected, source.width, source.height) !== 'Hold still...' || detected.sharpness < scannerConfig.minSharpness)) throw new Error('Reposition the ticket and try again');
              const output = (await process(source.getContext('2d')!.getImageData(0, 0, source.width, source.height), 'crop', detected.corners)).image;
              if (!output) throw new Error('Could not crop photo');
              const correctedCanvas = canvas(output.width, output.height);
              correctedCanvas.getContext('2d')!.putImageData(output, 0, 0);
              corrected = await blobFrom(correctedCanvas); cropped = true;
            }
          } catch { if (automatic) throw new Error('Reposition the ticket and try again'); }
        }
        if (automatic && !cropped) throw new Error('Reposition the ticket and try again');
        if (disposed || token !== generation) return;
        reviewed = true; stopCamera();
        navigator.vibrate?.(35);
        setResult({ original, corrected, cropped, url: URL.createObjectURL(corrected) });
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
          if (stability.update(detection?.corners ?? null, acceptable, performance.now())) { await capture(true, detection); return; }
        }
      } catch { stability.reset(); if (!disposed) setInstruction('Automatic scan unavailable · take a photo'); }
      if (!disposed && token === generation && !locked && !reviewed) timer = setTimeout(() => void analyze(), scannerConfig.intervalMs);
    }
    async function startCamera() {
      if (disposed || reviewed || document.hidden) return;
      stopCamera(); const token = generation;
      setError(''); setInstruction('Find ticket');
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
    const orientation = () => { stability.reset(); previous = smoothed = null; polygon.current?.setAttribute('points', ''); };
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

  return createPortal(
    <dialog ref={dialog} className={styles.scanner} aria-label="Scan load ticket" onCancel={event => { event.preventDefault(); close.current(); }}>
      <header className={styles.header}><span>{result ? 'Review ticket' : 'Scan ticket'}</span><button type="button" aria-label="Close scanner" onClick={onClose}><X size={24} /></button></header>
      <div className={styles.viewport}>
        {result ? <Image unoptimized width={1200} height={1600} className={styles.preview} src={result.url} alt={result.cropped ? 'Cropped and perspective-corrected ticket' : 'Original ticket photo'} /> :
          <div className={styles.frame} style={{ aspectRatio: aspect, width: `min(100%, calc((100dvh - 210px) * ${aspect}))` }}>
            <video ref={video} autoPlay playsInline muted className={styles.video} />
            <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className={styles.outline} aria-hidden="true"><polygon ref={polygon} points="" vectorEffect="non-scaling-stroke" /></svg>
          </div>}
      </div>
      <footer className={styles.footer}>
        {result ? <><p>{result.cropped ? 'Ready to use' : 'Edges unclear · original photo kept'}</p><div className={styles.actions}><button type="button" onClick={() => { setResult(null); setSession(s => s + 1); }}>Retake</button><button type="button" className={styles.primary} onClick={() => { onUse(new File([result.corrected], `ticket-${Date.now()}.${result.corrected.type === 'image/png' ? 'png' : 'jpg'}`, { type: result.corrected.type })); }}>Use Photo</button></div></> :
          <><output aria-live="polite">{error || (capturing ? 'Capturing…' : instruction)}</output>{error ? <button type="button" onClick={() => setSession(s => s + 1)}>Retry camera</button> : <button type="button" className={styles.shutter} disabled={!ready || capturing} aria-label="Take photo manually" onClick={() => shutter.current?.()}><Camera size={26} /></button>}</>}
      </footer>
    </dialog>, document.body,
  );
}
