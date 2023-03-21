// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { type ETag, toHashString } from "./deps.ts";

/** Catch error utility. */
export function reason(
  message: string,
  error: ErrorConstructor = Error,
): (cause: unknown) => never {
  return (cause) => {
    throw error(message, { cause });
  };
}

export async function weakETag(response: Response): Promise<ETag> {
  const tag = await response
    .clone()
    .arrayBuffer()
    .catch(reason(FailBy.Fetch))
    .then(digestSha1)
    .catch(reason(FailBy.CalcHash))
    .then(toHashString)
    .catch(reason(FailBy.CalcHashString));

  return { tag, weak: true };
}

export function digestSha1(data: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.digest("sha-1", data);
}

const enum FailBy {
  Fetch = "fail to fetch resource",
  CalcHash = "fail to calculate hash",
  CalcHashString = "fail to calculate hash string",
}
