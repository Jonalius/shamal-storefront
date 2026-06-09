import * as remixBuild from "virtual:react-router/server-build"; // Virtual entry point for the app
import { storefrontRedirect } from "@shopify/hydrogen";
import { createRequestHandler } from "@shopify/hydrogen/oxygen";
import { createHydrogenRouterContext } from "~/.server/context";
import { serializeError } from "~/utils/serialize-error";

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const hydrogenContext = await createHydrogenRouterContext(
        request,
        env,
        executionContext,
      );

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      if (hydrogenContext.session.isPending) {
        // Append (not set) so we don't clobber other Set-Cookie headers on the
        // response — most importantly the cart-id cookie written by the cart
        // action via cart.setCartId(). Using `.set` here overwrote that cookie
        // whenever the session was pending (logged-in customer, buyer identity,
        // or an access-token refresh), so a freshly-created cart id never
        // reached the browser and the cart appeared to stay empty.
        try {
          response.headers.append(
            "Set-Cookie",
            await hydrogenContext.session.commit(),
          );
        } catch (error) {
          console.error(
            "[cart-diag-session] session.commit / Set-Cookie threw",
            serializeError(error),
          );
          throw error;
        }
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(
        "[cart-diag-session] fetch handler caught",
        serializeError(error),
      );
      return new Response("An unexpected error occurred", { status: 500 });
    }
  },
};
