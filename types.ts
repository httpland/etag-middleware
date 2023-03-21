// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { type ETag, type ETagFormat } from "./deps.ts";

/** Function to calculate `<entity-tag>`. */
export interface CalculateETag {
  (response: Response): ETagFormat | ETag | Promise<ETagFormat | ETag>;
}
