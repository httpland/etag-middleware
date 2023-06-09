// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { isString, RepresentationHeader, stringifyETag } from "./deps.ts";
import type { ComputeETag } from "./types.ts";

/** Response with `ETag` header field.
 * @param response Response
 * @param calculate Function to calculate ETag values.
 */
export async function withEtag(
  response: Response,
  calculate: ComputeETag,
): Promise<Response> {
  if (
    !response.ok ||
    !response.body ||
    response.bodyUsed ||
    response.headers.has(RepresentationHeader.ETag)
  ) return response;

  const etagLike = await calculate(response.clone());
  const etag = isString(etagLike) ? etagLike : stringifyETag(etagLike);
  const res = response.clone();

  res.headers.set(RepresentationHeader.ETag, etag);

  return res;
}
