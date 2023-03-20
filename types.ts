// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

/** Function to calculate `<entity-tag>`. */
export interface CalculateETag {
  (response: Response): string | ETag | Promise<string | ETag>;
}

export interface ETag {
  /** Whether this is weak etag or not. */
  readonly weak: boolean;

  /** Representation of [`<etagc>`](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.8.3-2). */
  readonly tag: string;
}
