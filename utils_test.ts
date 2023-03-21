import { reason, weakETag } from "./utils.ts";
import {
  assert,
  assertEquals,
  assertThrows,
  describe,
  it,
} from "./_dev_deps.ts";

describe("reason", () => {
  it("should throw error", () => {
    assertThrows(() => reason("test")(Error()));
  });
});

describe("weakTag", () => {
  it("should return weak etag", async () => {
    const response = new Response("");
    assertEquals(
      await weakETag(response),
      { tag: "da39a3ee5e6b4b0d3255bfef95601890afd80709", weak: true },
    );
    assert(!response.bodyUsed);
  });
});
