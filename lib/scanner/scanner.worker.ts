import cvModule from '@techstark/opencv-js';
import { detectDocument, rectifyDocument, type OpenCV } from './vision';
import { type Quad, scannerConfig } from './geometry';
let cv: OpenCV;
const ready = (async () => {
  // The build hands over the OpenCV runtime; it finishes loading its wasm later.
  const runtime = cvModule as OpenCV & { onRuntimeInitialized?: () => void };
  if (!runtime.Mat) await new Promise<void>(resolve => { runtime.onRuntimeInitialized = resolve; });
  cv = runtime;
})();
self.onmessage = async (event: MessageEvent<{ id: number; image: ImageData; kind: 'detect' | 'crop'; corners?: Quad }>) => {
  const { id, image, kind, corners } = event.data;
  try {
    await ready;
    if (kind === 'detect') self.postMessage({ id, detection: detectDocument(cv, image, corners) });
    else {
      if (!corners) throw new Error('Missing document corners');
      const result = rectifyDocument(cv, image, corners);
      self.postMessage({ id, image: result }, { transfer: [result.data.buffer] });
    }
  } catch { self.postMessage({ id, error: 'Document processing unavailable' }); }
};
void ready.then(() => self.postMessage({ ready: true, interval: scannerConfig.intervalMs })).catch(() => self.postMessage({ error: 'Document processing unavailable' }));
