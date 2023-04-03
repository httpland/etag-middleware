import { computeETagByStrategy, reason, stringifyHeaders } from "./utils.ts";
import {
  assertEquals,
  assertSpyCalls,
  assertThrows,
  describe,
  it,
  spy,
} from "./_dev_deps.ts";

describe("reason", () => {
  it("should throw error", () => {
    assertThrows(() => reason("test")(Error()));
  });
});

describe("stringifyHeaders", () => {
  it("should return deserialized string", () => {
    const table: [Headers, string][] = [
      [new Headers(), ""],
      [new Headers({ a: "" }), "a: "],
      [new Headers({ "a": "a" }), "a: a"],
      [new Headers({ "a": "", b: "" }), "a: \nb: "],
      [new Headers({ b: "", a: "" }), "a: \nb: "],
      [
        new Headers({ c: "c", b: "b", a: "a", "x-a": "" }),
        "a: a\nb: b\nc: c\nx-a: ",
      ],
      [
        new Headers({ aaa: "", a: "", aa: "" }),
        "a: \naa: \naaa: ",
      ],
    ];

    table.forEach(([headers, expected]) => {
      assertEquals(stringifyHeaders(headers), expected);
    });
  });
});

describe("computeETagByStrategy", () => {
  it("should pass body only if the header is none", async () => {
    const digest = spy((data: ArrayBuffer) => {
      assertEquals(
        new TextDecoder().decode(data),
        "a",
      );

      return new ArrayBuffer(0);
    });

    const etag = await computeETagByStrategy(new Response("a"), {
      digest,
      strong: false,
      headers: [],
    });

    assertSpyCalls(digest, 1);
    assertEquals(etag, { weak: true, tag: "" });
  });

  it("should pass header and body stream", async () => {
    const digest = spy((data: ArrayBuffer) => {
      assertEquals(
        new TextDecoder().decode(data),
        "content-type: text/plain;charset=UTF-8\n\na",
      );

      return new ArrayBuffer(0);
    });

    const etag = await computeETagByStrategy(new Response("a"), {
      digest,
      strong: true,
      headers: ["content-type"],
    });

    assertSpyCalls(digest, 1);
    assertEquals(etag, { weak: false, tag: "" });
  });

  it("should pass header and body stream by default", async () => {
    const etag = await computeETagByStrategy(new Response("abc"));
    const etagc = "52d3e27d9e12c76aa045b5d72bab675df54df141";

    assertEquals(etag, { weak: true, tag: etagc });
  });
});
