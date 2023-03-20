// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { isString, RepresentationHeader } from "./deps.ts";
import { stringify } from "./etag.ts";
import type { CalculateETag } from "./types.ts";

/** Response with `ETag` header field.
 * @param response Response
 * @param calculate Function to calculate ETag values.
 */
export async function withEtag(
  response: Response,
  calculate: CalculateETag,
): Promise<Response> {
  if (
    !response.ok ||
    !response.body ||
    response.bodyUsed ||
    response.headers.has(RepresentationHeader.ETag)
  ) return response;

  const etagLike = await calculate(response.clone());
  const etag = isString(etagLike) ? etagLike : stringify(etagLike);
  const res = response.clone();

  res.headers.set(RepresentationHeader.ETag, etag);

  return res;
}
