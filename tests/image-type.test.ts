import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sniffImage } from '../lib/server/image-type.ts';

const bytes = (...values: (number | string)[]) =>
  new Uint8Array(
    values.flatMap((value) =>
      typeof value === 'string' ? Array.from({ length: value.length }, (_, i) => value.charCodeAt(i)) : [value],
    ),
  );

void test('profile photos are recognized by their contents', () => {
  assert.equal(sniffImage(bytes(0xff, 0xd8, 0xff, 0xe0, 0, 0x10)), 'image/jpeg');
  assert.equal(sniffImage(bytes(0x89, 'PNG', 0x0d, 0x0a, 0x1a, 0x0a, 0, 0)), 'image/png');
  assert.equal(sniffImage(bytes('RIFF', 0x24, 0, 0, 0, 'WEBP', 'VP8 ')), 'image/webp');
});

void test('anything that is not a supported image is refused', () => {
  assert.equal(sniffImage(bytes('<svg xmlns="http://www.w3.org/2000/svg">')), null);
  assert.equal(sniffImage(bytes('<!doctype html><script>')), null);
  assert.equal(sniffImage(bytes('GIF89a')), null);
  assert.equal(sniffImage(bytes('%PDF-1.7')), null);
  assert.equal(sniffImage(bytes('RIFF', 0, 0, 0, 0, 'WAVE')), null);
  assert.equal(sniffImage(new Uint8Array()), null);
  assert.equal(sniffImage(bytes(0xff, 0xd8)), null);
});
