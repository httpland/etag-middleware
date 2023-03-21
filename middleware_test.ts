import { etag } from "./middleware.ts";
import {
  assert,
  describe,
  equalsResponse,
  it,
  RepresentationHeader,
} from "./_dev_deps.ts";

const opaqueTag = `"389222d4f438ac48dac58e8594ab32279bf5ed4b"`;

describe("etag", () => {
  it("should return response what include etag header", async () => {
    const middleware = etag();
    const response = await middleware(
      new Request("test:"),
      () => new Response(""),
    );

    const WEAK_TAG = `W/` + opaqueTag;

    assert(
      await equalsResponse(
        response,
        new Response("", {
          headers: { [RepresentationHeader.ETag]: WEAK_TAG },
        }),
        true,
      ),
    );
  });

  it("should change to strong validator", async () => {
    const middleware = etag({ weak: false });
    const response = await middleware(
      new Request("test:"),
      () => new Response(""),
    );

    assert(
      await equalsResponse(
        response,
        new Response("", {
          headers: { [RepresentationHeader.ETag]: opaqueTag },
        }),
        true,
      ),
    );
  });

  it("should change hash algorithm", async () => {
    const middleware = etag({ algorithm: "SHA-256" });
    const response = await middleware(
      new Request("test:"),
      () => new Response(""),
    );

    const opaqueTag =
      `"186c92e7522aa3bb7bc51063c389b3b53e34d89ae00aa41e80956144bc188f5e"`;

    assert(
      await equalsResponse(
        response,
        new Response("", {
          headers: { [RepresentationHeader.ETag]: "W/" + opaqueTag },
        }),
        true,
      ),
    );
  });

  it("should change additional headers", async () => {
    const middleware = etag({ headers: [] });
    const response = await middleware(
      new Request("test:"),
      () => new Response(""),
    );

    const opaqueTag = `"da39a3ee5e6b4b0d3255bfef95601890afd80709"`;

    assert(
      await equalsResponse(
        response,
        new Response("", {
          headers: { [RepresentationHeader.ETag]: "W/" + opaqueTag },
        }),
        true,
      ),
    );
  });
});
