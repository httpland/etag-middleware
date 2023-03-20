# etag-middleware

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/etag_middleware)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/etag_middleware/mod.ts)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/httpland/etag-middleware)](https://github.com/httpland/etag-middleware/releases)
[![codecov](https://codecov.io/gh/httpland/etag-middleware/branch/main/graph/badge.svg)](https://codecov.io/gh/httpland/etag-middleware)
[![GitHub](https://img.shields.io/github/license/httpland/etag-middleware)](https://github.com/httpland/etag-middleware/blob/main/LICENSE)

[![test](https://github.com/httpland/etag-middleware/actions/workflows/test.yaml/badge.svg)](https://github.com/httpland/etag-middleware/actions/workflows/test.yaml)
[![NPM](https://nodei.co/npm/@httpland/etag-middleware.png?mini=true)](https://nodei.co/npm/@httpland/etag-middleware/)

HTTP ETag middleware.

Compliant with
[RFC 9110, 8.8.3. ETag](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.8.3).

## Middleware

For a definition of Universal HTTP middleware, see the
[http-middleware](https://github.com/httpland/http-middleware) project.

## Usage

From the response, calculate the ETag and add it to the `ETag` header.

```ts
import { etag } from "https://deno.land/x/etag_middleware@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const middleware = etag();
const response = await middleware(
  new Request("http://localhost"),
  (request) => new Response("ok"),
);

assertEquals(response.headers.get("etag"), `"<hex:SHA-1:body>"`);
```

yield:

```http
ETag: W/"<hex:SHA-1:body>"
```

The Default ETag is a hexadecimal representation of the sha-1 digest of the
Response body.

This is a weak ETag.

## Effects

Middleware will effect following:

- HTTP Headers
  - ETag

## Conditions

Middleware will execute only if the following conditions are met:

- Response body is successful(`2xx`) status code
- Response body exists
- Response body is readable
- `ETag` header does not exist in response

## API

All APIs can be found in the
[deno doc](https://doc.deno.land/https/deno.land/x/etag_middleware/mod.ts).

## License

Copyright © 2023-present [httpland](https://github.com/httpland).

Released under the [MIT](./LICENSE) license
