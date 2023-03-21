// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import {
  concat,
  type ETag,
  isString,
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

export const DefaultStrategy: ETagStrategy = {
  weak: true,
  algorithm: "SHA-1",
  headers: [RepresentationHeader.ContentType],
};

export async function computeETagByStrategy(
  response: Response,
  strategy: ETagStrategy = DefaultStrategy,
): Promise<ETag> {
  const filteredHeaders = filterHeaders(response.headers, strategy.headers);
  const headersStr = stringifyHeaders(filteredHeaders);

  const buffer = await response
    .clone()
    .arrayBuffer()
    .catch(reason(FailBy.Fetch));
  const data = concat(
    new TextEncoder().encode(headersStr),
    new Uint8Array(buffer),
  );

  const tag = await crypto.subtle.digest(strategy.algorithm, data)
    .catch(reason(FailBy.CalcHash))
    .then(toHashString)
    .catch(reason(FailBy.CalcHashString));

  return { weak: strategy.weak, tag };
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

/** Filter header. */
export function filterHeaders(
  headers: Headers,
  fields: readonly string[],
): Headers {
  const entries = fields.map((field) => {
    const value = headers.get(field);

    return isString(value) ? [field, value] as const : undefined;
  }).filter(Boolean) as [string, string][];

  return new Headers(entries);
}
