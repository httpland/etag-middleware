// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { type Middleware } from "./deps.ts";
import { withEtag } from "./transform.ts";
import { weakETag } from "./utils.ts";
import { CalculateETag } from "./types.ts";

/** Create `ETag` header middleware.
 *
 * @example
 * ```ts
 * import { etag } from "https://deno.land/x/http_etag@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * const middleware = etag();
 * const response = await middleware(
 *   new Request("http://localhost"),
 *   (request) => new Response("ok"),
 * );
 *
 * assertEquals(response.headers.get("etag"), `"<body:SHA-1>"`);
 * ```
 */
export function etag(calculateETag?: CalculateETag): Middleware {
  const calculate = calculateETag ?? weakETag;

  return async (request, next) => {
    const response = await next(request);

    return withEtag(response, calculate);
  };
}
