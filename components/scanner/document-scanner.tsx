'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Check, RotateCcw, ScanLine, X } from 'lucide-react';
import { enhanceDocument, type DocumentFilter } from '@/lib/scanner/enhance';
import { detectPaperFrame } from '@/lib/scanner/rectify';
import { UNKNOWN_FRAME, type PaperFrame } from '@/lib/load-desk/recovery/contract';
import styles from './document-scanner.module.css';

type Result = { original: Blob; photo: Blob; url: string };
const canvas = (width: number, height: number) => Object.assign(document.createElement('canvas'), { width, height });
/**
 * Longest edge of the picture that is kept. A full sensor photo is 12
 * megapixels and, on phones that give takePhoto() the whole sensor, up to 48 —
 * more detail than anything downstream works at: a scanned PDF page reaches the
 * reader at around 2100 x 2750.
 */
const PHOTO_MAX = 2600;
/**
 * How long the framing check may hold Use Photo back before the photograph is
 * simply accepted. The detector is OpenCV, ten megabytes of it, fetched the
 * first time a scan needs it; on a slow connection that is the whole budget on
 * its own. Nobody standing over a ticket is waiting for the scanner to think,
 * and an unanswered question has never been a reason to refuse a photograph
 * here — past this the frame is unknown, and unknown blocks nothing.
 */
const FRAMING_BUDGET_MS = 4000;
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
  const shutter = useRef<(() => void) | null>(null);
  const [session, setSession] = useState(0);
  /** Only ever something that went wrong and can be tried again. */
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  /** Where the sheet's edges stood in the photograph, once it has been looked at. */
  const [paper, setPaper] = useState<PaperFrame | null>(null);
  const [checking, setChecking] = useState(false);
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
    let busy = false, reviewed = false;
    function stopCamera() {
      generation++;
      stream?.getTracks().forEach(track => track.stop());
      stream = null;
      if (video.current) video.current.srcObject = null;
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
    /**
     * Whether the sheet ran off the picture that was just taken.
     *
     * The same detector the uploader uses, on the same photograph, before the
     * person walks away from the ticket. It answers about the paper, not the
     * print: a ticket whose top or sides are off the frame has lost the part
     * that is billed, and the only fix is another photograph — which is free
     * while they are still standing there and impossible an hour later.
     *
     * Every other answer lets the photograph through. Nothing found, no
     * worker, a detector that did not come back inside the budget: the scanner
     * has always failed open and there is no reason for this to be the first
     * thing in it that refuses a picture it cannot explain.
     */
    async function checkFraming(source: HTMLCanvasElement) {
      setChecking(true);
      try {
        const seen = await Promise.race([
          detectPaperFrame(source),
          new Promise<PaperFrame>(resolve =>
            setTimeout(() => resolve(UNKNOWN_FRAME), FRAMING_BUDGET_MS)),
        ]);
        if (!disposed) setPaper(seen);
      } catch {
        if (!disposed) setPaper(UNKNOWN_FRAME);
      } finally {
        if (!disposed) setChecking(false);
      }
    }
    async function capture() {
      if (busy || disposed || !stream || document.hidden) return;
      busy = true; setCapturing(true);
      const token = generation;
      try {
        // The frame on the screen, which is the picture that was framed. The
        // preview is already focused, and a full-sensor still through
        // ImageCapture.takePhoto() costs a shutter cycle, a refocus and the
        // decode of a 12 to 48 megapixel photograph — a second or more on a
        // phone — for detail PHOTO_MAX throws away again a moment later.
        const source = frame(PHOTO_MAX);
        const original = await blobFrom(source);
        if (disposed || token !== generation) return;
        reviewed = true; stopCamera();
        navigator.vibrate?.(35);
        // Every capture is developed before it is shown: a photograph of paper
        // is not what the reader downstream is built for (see lib/scanner/
        // enhance.ts).
        //
        // Developing is a nicety and a photo is not. The camera has already
        // been stopped by this point, so anything that fails here must still
        // end at the review screen with the picture that was taken.
        let shown: { blob: Blob; url: string };
        try {
          const pixels = source.getContext('2d')!.getImageData(0, 0, source.width, source.height);
          shown = await renderFiltered(pixels, 'auto');
        } catch {
          shown = { blob: original, url: URL.createObjectURL(original) };
        }
        // Only disposal matters from here. stopCamera() moves the generation on
        // by design, so comparing the token against it after that point would
        // throw away every capture that was just taken.
        if (disposed) { URL.revokeObjectURL(shown.url); return; }
        setResult({ original, photo: shown.blob, url: shown.url });
        // The picture is on the screen either way; what is still being settled
        // is whether it is worth reading. Held off the awaited path above so
        // the shutter is finished with and the review screen is up while the
        // detector is still looking.
        void checkFraming(source);
      } catch (e) {
        // The camera is still running, so this is something to try again rather
        // than a fault to back out of: the shutter stays where it is.
        if (!disposed && token === generation) setNotice(e instanceof Error ? e.message : 'Please try again');
      } finally { busy = false; if (!disposed) setCapturing(false); }
    }
    async function startCamera() {
      if (disposed || reviewed || document.hidden) return;
      stopCamera(); const token = generation;
      setError(''); setNotice('');
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
        setAspect(v.videoWidth / v.videoHeight); setReady(true);
      } catch (e) {
        if (!disposed && token === generation) {
          stopCamera();
          setError(e instanceof DOMException && e.name === 'NotAllowedError' ? 'Allow camera access in your browser settings, then retry.' : 'Camera unavailable. Check camera access, then retry.');
        }
      }
    }
    const visibility = () => { if (document.hidden) stopCamera(); else if (!reviewed) void startCamera(); };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', stopCamera);
    window.addEventListener('pageshow', visibility);
    shutter.current = () => { void capture(); };
    void startCamera();
    return () => {
      disposed = true; stopCamera(); shutter.current = null;
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pagehide', stopCamera);
      window.removeEventListener('pageshow', visibility);
    };
  }, [session]);

  // Nothing to say while the camera is simply running: point it at the ticket
  // and press the button. The line under the frame is for the two moments there
  // is something to say — the shutter is working, or something went wrong.
  const hint = error || (capturing ? 'Capturing…' : notice);
  const tone = error || notice ? 'error' : undefined;

  // The bottom of a ticket is allowed to run off the picture: everything that
  // is billed is printed in the top half, and one held close enough to read
  // leaves the warranty out of shot. The top and the sides are not — losing
  // either loses the thing the photograph was taken for. Nothing detected says
  // nothing, and stops nothing.
  const cropped =
    paper !== null &&
    (paper.top === 'cut' || paper.left === 'cut' || paper.right === 'cut');

  return createPortal(
    <dialog ref={dialog} className={styles.scanner} aria-label="Scan load ticket" onCancel={event => { event.preventDefault(); close.current(); }}>
      <div className={styles.stage}>
        {result ? <Image unoptimized width={1200} height={1600} className={styles.preview} src={result.url} alt="Ticket photo" /> :
          <div className={styles.frame} style={{ aspectRatio: aspect, width: `min(100%, calc((100dvh - var(--chrome)) * ${aspect}))` }}>
            <video ref={video} autoPlay playsInline muted className={styles.video} />
            {/* Corner marks for where to hold the ticket. Nothing is being
                looked for behind them — they are where to aim, not a reading. */}
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
          {cropped
            ? <p className={styles.status} data-tone="error" aria-live="polite"><RotateCcw size={15} />Move the ticket fully into frame and retake</p>
            : checking
              ? <p className={styles.status} aria-live="polite"><ScanLine size={15} />Checking framing…</p>
              : <p className={styles.status} data-tone="good"><Check size={15} />Ready to use</p>}
          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={() => { setResult(null); setPaper(null); setChecking(false); setSession(s => s + 1); }}>Retake</button>
            <button type="button" className={styles.primary} disabled={checking || cropped} onClick={() => { onUse(new File([result.photo], `ticket-${Date.now()}.${result.photo.type === 'image/png' ? 'png' : 'jpg'}`, { type: result.photo.type })); }}>Use Photo</button>
          </div>
        </> : <>
          {hint ? <output className={styles.hint} data-tone={tone} aria-live="polite"><RotateCcw size={15} />{hint}</output> : null}
          {error ? <button type="button" className={styles.secondary} onClick={() => setSession(s => s + 1)}>Retry camera</button> :
            <button type="button" className={styles.shutter} disabled={!ready || capturing} aria-label="Take photo" onClick={() => shutter.current?.()}><span /></button>}
        </>}
      </footer>
    </dialog>, document.body,
  );
}
