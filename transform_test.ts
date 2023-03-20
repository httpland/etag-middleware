import {
  assert,
  assertEquals,
  assertSpyCalls,
  describe,
  equalsResponse,
  it,
  RepresentationHeader,
  spy,
} from "./_dev_deps.ts";
import { withEtag } from "./transform.ts";

describe("withEtag", () => {
  it("should return with etag header field if the response does not have etag field", async () => {
    const digest = spy(() => `""`);
    const initResponse = new Response("ok");
    const response = await withEtag(initResponse, digest);

    assertSpyCalls(digest, 1);
    assert(
      await equalsResponse(
        response,
        new Response("ok", { headers: { [RepresentationHeader.ETag]: `""` } }),
        true,
      ),
    );
  });

  it("should process custom digest what return strong etag object", async () => {
    const digest = spy(() => ({ weak: false, tag: "abc" }));
    const initResponse = new Response("ok");
    const response = await withEtag(initResponse, digest);

    assertSpyCalls(digest, 1);
    assert(
      await equalsResponse(
        response,
        new Response("ok", {
          headers: {
            [RepresentationHeader.ETag]: `"abc"`,
          },
        }),
        true,
      ),
    );
  });

  it("should process custom digest what return weak etag object", async () => {
    const digest = spy(() => ({ weak: true, tag: "abc" }));
    const initResponse = new Response("ok");
    const response = await withEtag(initResponse, digest);

    assertSpyCalls(digest, 1);
    assert(
      await equalsResponse(
        response,
        new Response("ok", {
          headers: {
            [RepresentationHeader.ETag]: `W/"abc"`,
          },
        }),
        true,
      ),
    );
  });

  it("should return same response if the response status code is not 2xx", async () => {
    const initResponse = new Response("", { status: 404 });
    const digest = spy(() => "");

    const response = await withEtag(initResponse, digest);

    assertSpyCalls(digest, 0);
    assertEquals(initResponse, response);
  });

  it("should return same response if the response body does not exist", async () => {
    const initResponse = new Response();
    const digest = spy(() => "");

    const response = await withEtag(initResponse, digest);

    assertSpyCalls(digest, 0);
    assertEquals(initResponse, response);
  });

  it("should return same response if the response has been read", async () => {
    const initResponse = new Response("ok");
    const digest = spy(() => "");

    await initResponse.text();
    const response = await withEtag(initResponse, digest);

    assert(initResponse.bodyUsed);
    assertSpyCalls(digest, 0);
    assertEquals(initResponse, response);
  });

  it("should return same response if the response has etag header", async () => {
    const initResponse = new Response("ok", {
      headers: { [RepresentationHeader.ETag]: "" },
    });
    const digest = spy(() => "");

    const response = await withEtag(initResponse, digest);

    assertSpyCalls(digest, 0);
    assertEquals(initResponse, response);
  });
});
