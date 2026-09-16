import { copyFile, mkdir, readdir } from 'node:fs/promises';
await mkdir('public/ocr', { recursive: true });
await copyFile(
  'node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
  'public/ocr/pdf.worker.min.mjs',
);
await copyFile(
  'node_modules/tesseract.js/dist/worker.min.js',
  'public/ocr/worker.min.js',
);
for (const file of await readdir('node_modules/tesseract.js-core')) {
  if (file.includes('.wasm'))
    await copyFile(
      `node_modules/tesseract.js-core/${file}`,
      `public/ocr/${file}`,
    );
}
