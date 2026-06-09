/**
 * Deep-serialize an unknown thrown value into a JSON string that preserves the
 * non-enumerable Error props (message, stack, cause, …) that plain
 * JSON.stringify / console.error drop — which is why our Oxygen logs kept
 * surfacing `{name:'Error', message:''}` with no detail.
 *
 * Walks Errors with Object.getOwnPropertyNames so `cause`, `graphQLErrors`,
 * and any custom fields are captured, recursing through nested errors/objects.
 */
export function serializeError(error: unknown): string {
  try {
    return JSON.stringify(toPlain(error, 0, new WeakSet()), null, 2);
  } catch (serializationError) {
    return `[cart-diag] serializeError failed: ${String(serializationError)} | original: ${String(error)}`;
  }
}

function toPlain(
  value: unknown,
  depth: number,
  seen: WeakSet<object>,
): unknown {
  if (depth > 5) {
    return "[max depth]";
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "function") {
    return `[function ${value.name || "anonymous"}]`;
  }

  if (value === null || typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return "[circular]";
  }
  seen.add(value);

  if (value instanceof Error) {
    const out: Record<string, unknown> = { name: value.name };
    for (const key of Object.getOwnPropertyNames(value)) {
      out[key] = toPlain(
        (value as unknown as Record<string, unknown>)[key],
        depth + 1,
        seen,
      );
    }
    return out;
  }

  if (Array.isArray(value)) {
    return value.map((item) => toPlain(item, depth + 1, seen));
  }

  const out: Record<string, unknown> = {};
  for (const key of Object.keys(value as Record<string, unknown>)) {
    out[key] = toPlain(
      (value as Record<string, unknown>)[key],
      depth + 1,
      seen,
    );
  }
  return out;
}
