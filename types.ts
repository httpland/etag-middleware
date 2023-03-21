// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { type ETag, type ETagFormat } from "./deps.ts";

/** Compute `<entity-tag>` API. */
export interface ComputeETag {
  (response: Response): ETagFormat | ETag | Promise<ETagFormat | ETag>;
}

/** ETag computation strategy. */
export interface ETagStrategy {
  /** Wether the etag is weak or not.
   * @default true
   */
  readonly weak: boolean;

  /** Hash algorithm.
   * @default `SHA-1`
   */
  readonly algorithm: Algorithm;

  /** Semantically significant header related with the representation data.
   * @default ["content-type"]
   */
  readonly headers: readonly string[];
}

/** Hash algorithm */
export type Algorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
