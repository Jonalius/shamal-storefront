import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from "@shopify/hydrogen";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type {
  ActionFunctionArgs,
  EntryContext,
  LoaderFunctionArgs,
} from "react-router";
import { ServerRouter } from "react-router";
import { logErrorSync } from "~/utils/serialize-error";
import { getWeaverseCsp } from "~/weaverse/csp";

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
        // DIAGNOSTIC: deep-log SSR render errors (was a bare console.error that
        // Oxygen masked as `{ name: 'Error', message: '' }`).
        logErrorSync(
          `ssr render onError (${new URL(request.url).pathname})`,
          error,
        );
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

// DIAGNOSTIC: React Router calls handleError for every uncaught error thrown by
// a loader, action, or data request (including Weaverse loaders) — the catch-all
// that our cart-route try/catch missed. Remove with spec
// .weaverse/specs/2026-06-08--cart-500-diagnosis.
export function handleError(
  error: unknown,
  { request }: LoaderFunctionArgs | ActionFunctionArgs,
) {
  // Don't log client-aborted requests as errors.
  if (request.signal.aborted) return;
  logErrorSync(
    `handleError (${request.method} ${new URL(request.url).pathname})`,
    error,
  );
}
