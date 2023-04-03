// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import {
  concat,
  type ETag,
  filterKeys,
  RepresentationHeader,
  toHashString,
} from "./deps.ts";
import type { ComputeETag, ETagStrategy } from "./types.ts";

/** Catch error utility. */
export function reason(
  message: string,
  error: ErrorConstructor = Error,
): (cause: unknown) => never {
  return (cause) => {
    throw error(message, { cause });
  };
}

const enum FailBy {
  Fetch = "fail to fetch resource",
  CalcHash = "fail to calculate hash",
  CalcHashString = "fail to calculate hash string",
}

/** Digest algorithm. */
const enum Algorithm {
  Sha1 = "SHA-1",
}

function digestSha1(data: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.digest(Algorithm.Sha1, data);
}

export const DefaultStrategy: ETagStrategy = {
  strong: false,
  digest: digestSha1,
  headers: [RepresentationHeader.ContentType],
};

export async function computeETagByStrategy(
  response: Response,
  strategy: ETagStrategy = DefaultStrategy,
): Promise<ETag> {
  const filteredHeaders = filterKeys(
    response.headers,
    strategy.headers.includes.bind(strategy.headers),
  );
  const headersStr = stringifyHeaders(filteredHeaders);
  const hasHeader = !!headersStr;
  const encoder = new TextEncoder();

  const buffer = await response
    .clone()
    .arrayBuffer()
    .catch(reason(FailBy.Fetch));
  const data = concat(
    encoder.encode(headersStr),
    ...hasHeader ? [encoder.encode("\n\n")] : [],
    new Uint8Array(buffer),
  );

  const tag = await Promise.resolve(strategy.digest(data.buffer))
    .catch(reason(FailBy.CalcHash))
    .then(toHashString)
    .catch(reason(FailBy.CalcHashString));

  return { weak: !strategy.strong, tag };
}

export function strategy2ComputeETag(strategy: ETagStrategy): ComputeETag {
  return (response) => computeETagByStrategy(response, strategy);
}

/** Deserialize {@link Headers} into string. */
export function stringifyHeaders(headers: Headers): string {
  return [...headers.entries()]
    .map(formatEntry)
    .join("\n");
}

function formatEntry(entry: readonly [unknown, unknown]): string {
  return `${entry[0]}: ${entry[1]}`;
}
