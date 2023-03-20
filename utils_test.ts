import { quoted, reason, weakETag, weakPrefix } from "./utils.ts";
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

describe("weakPrefix", () => {
  it("should return string", () => {
    assertEquals(weakPrefix(""), "W/");
    assertEquals(weakPrefix("a"), "W/a");
  });
});

describe("quoted", () => {
  it("should return quoted string", () => {
    assertEquals(quoted(""), `""`);
    assertEquals(quoted("a"), `"a"`);
  });
});

describe("weakTag", () => {
  it("should return weak etag", async () => {
    const response = new Response("");
    assertEquals(
      await weakETag(response),
      `W/"da39a3ee5e6b4b0d3255bfef95601890afd80709"`,
    );
    assert(!response.bodyUsed);
  });

  it("should throw error if the response has been read", async () => {
    const response = new Response("");

    await response.text();

    assert(response.bodyUsed);
    assertThrows(() => weakETag(response));
  });
});
