// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { type ETag, type ETagFormat } from "./deps.ts";

/** Compute `<entity-tag>` API. */
export interface ComputeETag {
  (response: Response): ETagFormat | ETag | Promise<ETagFormat | ETag>;
}

/** ETag computation strategy. */
export interface ETagStrategy {
  /** Whether the validator is strong or not.
   * @default false
   */
  readonly strong: boolean;

  /** Compute digest.
   * The default is SHA-1 digest.
   */
  readonly digest: Digest;

  /** Semantically significant header related with the representation data.
   * @default ["content-type"]
   */
  readonly headers: readonly string[];
}

/** Compute digest API. */
export interface Digest {
  (data: ArrayBuffer): ArrayBuffer | Promise<ArrayBuffer>;
}
