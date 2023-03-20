import { ETag } from "./types.ts";
import { quote, weakPrefix } from "./utils.ts";

export type WeakETagFormat = `W/"${string}"`;
export type StrongETagFormat = `"${string}"`;
export type ETagFormat = StrongETagFormat | WeakETagFormat;

/** Serialize {@link ETag} into string. */
export function stringify(etag: ETag): ETagFormat {
  const opaqueTag = quote(etag.tag);
  const etagFormat = etag.weak ? weakPrefix(opaqueTag) : opaqueTag;

  return etagFormat;
}
