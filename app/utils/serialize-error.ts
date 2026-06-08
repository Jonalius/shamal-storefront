// TEMPORARY DIAGNOSTIC — surface the masked production 500.
// Oxygen logs `{ name: 'Error', message: '' }` because the real detail lives on
// non-enumerable props (cause / graphQLErrors / errors) or inside a thrown
// Response body, and a bare `console.error(err)` / `JSON.stringify(err)` drops
// all of it. Remove with spec .weaverse/specs/2026-06-08--cart-500-diagnosis.

const DIAG_PREFIX = "[cart-diag]";

// Recursive, depth-capped, circular-safe walk. Uses getOwnPropertyNames so
// non-enumerable props (cause, graphQLErrors, errors, body, response, status…)
// are captured — plain JSON.stringify(err) would omit them.
export function serializeError(
  value: unknown,
  seen: Set<unknown>,
  depth: number,
): unknown {
  if (depth > 6) return "[max-depth]";
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return "[circular]";
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => serializeError(item, seen, depth + 1));
  }

  const out: Record<string, unknown> = {};
  if (value instanceof Error) {
    out.__name = value.name;
    out.__message = value.message;
    out.__stack = value.stack;
  }
  if (value instanceof Response) {
    out.__responseStatus = value.status;
    out.__responseStatusText = value.statusText;
  }
  for (const key of Object.getOwnPropertyNames(value)) {
    out[key] = serializeError(
      (value as Record<string, unknown>)[key],
      seen,
      depth + 1,
    );
  }
  return out;
}

// Synchronous deep log — safe to call from React's renderToReadableStream
// onError and from React Router's handleError (neither awaits).
export function logErrorSync(scope: string, err: unknown) {
  try {
    console.error(
      `${DIAG_PREFIX} ${scope}`,
      JSON.stringify(serializeError(err, new Set(), 0)),
    );
  } catch (serializationError) {
    console.error(
      `${DIAG_PREFIX} ${scope} could not serialize error`,
      String(err),
      serializationError,
    );
  }
}

// Async variant that additionally reads a thrown Response (or err.cause being a
// Response) body — call from places that can await (route loaders/actions).
export async function logError(scope: string, err: unknown) {
  const maybeResponse =
    err instanceof Response
      ? err
      : (err as { cause?: unknown })?.cause instanceof Response
        ? ((err as { cause?: unknown }).cause as Response)
        : null;
  if (maybeResponse) {
    let body = "";
    try {
      body = await maybeResponse.clone().text();
    } catch {
      body = "[unreadable body]";
    }
    console.error(
      `${DIAG_PREFIX} ${scope} threw Response`,
      JSON.stringify({
        status: maybeResponse.status,
        statusText: maybeResponse.statusText,
        headers: Object.fromEntries(maybeResponse.headers.entries()),
        body,
      }),
    );
  }
  logErrorSync(scope, err);
}
