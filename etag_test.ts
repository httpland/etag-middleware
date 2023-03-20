import { stringify } from "./etag.ts";
import { ETag } from "./types.ts";
import { assertEquals, describe, it } from "./_dev_deps.ts";

describe("stringify", () => {
  it("return weak etag format", () => {
    const table: [ETag, string][] = [
      [{ weak: true, tag: "" }, `W/""`],
      [{ weak: true, tag: "abc" }, `W/"abc"`],
      [{ weak: true, tag: `"abc"` }, `W/""abc""`],
    ];

    table.forEach(([etag, expected]) => {
      assertEquals(stringify(etag), expected);
    });
  });

  it("return strong etag format", () => {
    const table: [ETag, string][] = [
      [{ weak: false, tag: "" }, `""`],
      [{ weak: false, tag: "abc" }, `"abc"`],
      [{ weak: false, tag: `"abc"` }, `""abc""`],
    ];

    table.forEach(([etag, expected]) => {
      assertEquals(stringify(etag), expected);
    });
  });
});
