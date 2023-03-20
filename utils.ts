// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { toHashString } from "./deps.ts";

/** Catch error utility. */
export function reason(
  message: string,
  error: ErrorConstructor = Error,
): (cause: unknown) => never {
  return (cause) => {
    throw error(message, { cause });
  };
}

/** Return quoted string. */
export function quoted<T extends string>(input: T): `"${T}"`;
export function quoted(input: string): string;
export function quoted(input: string): string {
  return `"${input}"`;
}

export function weakPrefix<T extends string>(input: T): `W/${T}`;
export function weakPrefix(input: string): `W/${string}`;
export function weakPrefix(input: string): `W/${string}` {
  return `W/${input}`;
}

export function weakETag(response: Response): Promise<string> {
  return response
    .clone()
    .arrayBuffer()
    .catch(reason(FailBy.Fetch))
    .then(digestSha1)
    .catch(reason(FailBy.CalcHash))
    .then(toHashString)
    .catch(reason(FailBy.CalcHashString))
    .then(quoted)
    .then(weakPrefix);
}

export function digestSha1(data: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.digest("sha-1", data);
}

const enum FailBy {
  Fetch = "fail to fetch resource",
  CalcHash = "fail to calculate hash",
  CalcHashString = "fail to calculate hash string",
}
