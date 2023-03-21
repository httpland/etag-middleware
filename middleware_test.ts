import { etag } from "./middleware.ts";
import {
  assert,
  assertSpyCalls,
  describe,
  equalsResponse,
  it,
  RepresentationHeader,
  spy,
} from "./_dev_deps.ts";

describe("etag", () => {
  it("should return response what include etag header", async () => {
    const middleware = etag();
    const response = await middleware(
      new Request("test:"),
      () => new Response(""),
    );

    const WEAK_TAG = `W/"da39a3ee5e6b4b0d3255bfef95601890afd80709"`;

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

  it("should override calculate etag function", async () => {
    const calculate = spy(() => ({ tag: "", weak: false }));
    const middleware = etag(calculate);
    const response = await middleware(
      new Request("test:"),
      () => new Response(""),
    );

    assertSpyCalls(calculate, 1);
    assert(
      await equalsResponse(
        response,
        new Response("", {
          headers: { [RepresentationHeader.ETag]: `""` },
        }),
        true,
      ),
    );
  });
});
