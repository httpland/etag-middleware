// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { type Middleware } from "./deps.ts";
import { withEtag } from "./transform.ts";
import { DefaultStrategy, strategy2ComputeETag } from "./utils.ts";
import { ETagStrategy } from "./types.ts";

/** Create `ETag` header middleware.
 *
 * @example
 * ```ts
 * import {
 *   etag,
 *   type Handler,
 * } from "https://deno.land/x/etag_middleware@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * const middleware = etag();
 * declare const request: Request;
 * declare const handler: Handler;
 *
 * const response = await middleware(request, handler);
 *
 * assertEquals(
 *   response.headers.get("etag"),
 *   `W/"<hex:SHA-1:Content-Type,body>"`,
 * );
 * ```
 */
export function etag(strategy?: Partial<ETagStrategy>): Middleware {
  const compute = strategy2ComputeETag({ ...DefaultStrategy, ...strategy });

  return async (request, next) => {
    const response = await next(request);

    return withEtag(response, compute);
  };
}
