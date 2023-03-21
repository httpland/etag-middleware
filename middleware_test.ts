import { etag } from "./middleware.ts";
import {
  assert,
  describe,
  equalsResponse,
  it,
  RepresentationHeader,
} from "./_dev_deps.ts";

const opaqueTag = `"6b4f9b34cb268809e4863aea74e2c81b54c847dc"`;

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
    const middleware = etag({ strong: true });
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

  it("should change digest function", async () => {
    const middleware = etag({ digest: () => new ArrayBuffer(0) });
    const response = await middleware(
      new Request("test:"),
      () => new Response(""),
    );

    assert(
      await equalsResponse(
        response,
        new Response("", {
          headers: { [RepresentationHeader.ETag]: `W/""` },
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
