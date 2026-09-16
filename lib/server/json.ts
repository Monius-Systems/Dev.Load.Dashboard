/**
 * Reads a request body as text with a byte limit and a required content type,
 * so an oversized request is rejected before it is parsed. Throws with a
 * user-facing message.
 */
export async function boundedText(
  request: Request,
  maxBytes: number,
  contentType: string,
): Promise<string> {
  if (!request.headers.get('Content-Type')?.startsWith(contentType)) {
    throw new Error(`${contentType} required.`);
  }
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Request body required.');
  const decoder = new TextDecoder();
  let text = '';
  let bytes = 0;
  for (;;) {
    const next = await reader.read();
    if (next.done) break;
    bytes += next.value.byteLength;
    if (bytes > maxBytes) {
      await reader.cancel();
      throw new Error('Request too large.');
    }
    text += decoder.decode(next.value, { stream: true });
  }
  return text + decoder.decode();
}

/**
 * Reads a JSON object body with a byte limit, so an oversized or malformed
 * request is rejected before parsing. Throws with a user-facing message.
 */
export async function boundedJson(
  request: Request,
  maxBytes = 64_000,
): Promise<Record<string, unknown>> {
  const text = await boundedText(request, maxBytes, 'application/json');
  const value: unknown = JSON.parse(text);
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Expected a JSON object.');
  }
  return value as Record<string, unknown>;
}
