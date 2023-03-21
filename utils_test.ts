import { ETagStrategy } from "./types.ts";
import {
  computeETagByStrategy,
  filterHeaders,
  reason,
  stringifyHeaders,
} from "./utils.ts";
import {
  assert,
  assertEquals,
  assertThrows,
  describe,
  distinct,
  it,
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

describe("filterHeaders", () => {
  it("should return fileted headers", () => {
    const table: [Headers, string[], Headers][] = [
      [new Headers(), [], new Headers()],
      [new Headers({ a: "" }), [], new Headers()],
      [new Headers({ a: "" }), ["a"], new Headers({ a: "" })],
      [new Headers({ a: "a" }), ["a"], new Headers({ a: "a" })],
      [new Headers({ a: "a" }), ["a", "b"], new Headers({ a: "a" })],
      [
        new Headers({ a: "aa", b: "bb" }),
        ["a", "b"],
        new Headers({ a: "aa", b: "bb" }),
      ],
      [
        new Headers({ a: "aa", b: "bb" }),
        ["b", "a"],
        new Headers({ b: "bb", a: "aa" }),
      ],
      [
        new Headers({ a: "aa", b: "bb" }),
        ["c", "d", "f"],
        new Headers({}),
      ],
    ];

    table.forEach(([headers, fields, expected]) => {
      assertEquals(filterHeaders(headers, fields), expected);
    });
  });

  it("should throw error if the field name is invalid", () => {
    const table: [Headers, string[]][] = [
      [new Headers(), [""]],
      [new Headers(), ["?"]],
    ];

    table.forEach(([headers, fields]) => {
      assertThrows(() => filterHeaders(headers, fields));
    });
  });
});

describe("computeETagByStrategy", () => {
  it("should return unique hash tag", async () => {
    const table: [Response, ETagStrategy | undefined][] = [
      [new Response(""), undefined],
      [new Response(), undefined],
      [new Response("a"), undefined],
      [new Response("a"), { headers: [], algorithm: "SHA-1", weak: false }],
      [new Response("a"), { headers: [], algorithm: "SHA-256", weak: false }],
      [new Response("a"), { headers: [], algorithm: "SHA-384", weak: false }],
      [new Response("a"), { headers: [], algorithm: "SHA-512", weak: true }],
    ];

    const results = await Promise.all(
      table.map(async ([response, strategy]) => {
        const result = await computeETagByStrategy(response, strategy);

        assertEquals(result.weak, strategy?.weak ?? true);

        return result;
      }),
    );

    const tags = results.map(({ tag }) => tag);

    assert(distinct(tags).length === results.length);
  });
});
