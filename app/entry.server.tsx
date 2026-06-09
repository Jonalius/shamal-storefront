import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from "@shopify/hydrogen";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { EntryContext, HandleErrorFunction } from "react-router";
import { ServerRouter } from "react-router";
import { serializeError } from "~/utils/serialize-error";
import { getWeaverseCsp } from "~/weaverse/csp";

/**
 * Catch-all for ANY uncaught loader/action/render throw across all routes.
 * This is the net that caught nothing last time because it wasn't wired up.
 */
export const handleError: HandleErrorFunction = (error, { request }) => {
  // Ignore client-aborted requests — those are not real failures.
  if (request.signal.aborted) {
    return;
  }
  console.error(
    "[cart-diag-ssr] handleError",
    request.method,
    new URL(request.url).pathname,
    serializeError(error),
  );
};

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    ...getWeaverseCsp(request, context),
    shop: {
      checkoutDomain:
        context.env?.PUBLIC_CHECKOUT_DOMAIN || context.env?.PUBLIC_STORE_DOMAIN,
      storeDomain: context.env?.PUBLIC_STORE_DOMAIN,
    },
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error("[cart-diag-ssr] render onError", serializeError(error));
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get("user-agent"))) {
    await Promise.race([
      body.allReady,
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);
  }

  responseHeaders.set("Content-Type", "text/html");
  // TODO: change to Content-Security-Policy when you ready with your CSP configs.
  responseHeaders.set("Content-Security-Policy-Report-Only", header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
