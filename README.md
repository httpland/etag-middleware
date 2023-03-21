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
declare const request: Request;
declare const handler: () => Response;

const response = await middleware(request, handler);

assertEquals(
  response.headers.get("etag"),
  `W/"<hex:SHA-1:Content-Type::body>"`,
);
```

yield:

```http
ETag: W/"<hex:SHA-1:Content-Type::body>"
```

The Default ETag is a hexadecimal representation of the SHA-1 digest of the
response body and `Content-Type`.

This is a weak validator.

## ETag computation

The ETag is computed from the body and the response header.

By default, it is a hash of the stream of body and specific headers.

This satisfies most of the requirements for a strong validator. However,
middleware cannot guarantee that the following
[requirements](https://www.rfc-editor.org/rfc/rfc9110#section-8.8.1-9) will be
met:

> For example, if the origin server sends the same validator for a
> representation with a gzip content coding applied as it does for a
> representation with no content coding, then that validator is weak.

For this reason, the default is to compute as a weak validator.

## ETag Strategy

ETag computation strategy.

| Name      | Type                                                               | Default            | Description                                                           |
| --------- | ------------------------------------------------------------------ | ------------------ | --------------------------------------------------------------------- |
| strong    | `boolean`                                                          | `false`            | Whether the validator is strong or not.                               |
| algorithm | `"SHA-1"` &vert; `"SHA-256"` &vert; `"SHA-384"` &vert; `"SHA-512"` | `"SHA-1"`          | Hash algorithm.                                                       |
| headers   | `string[]`                                                         | `["content-type"]` | Semantically significant header related with the representation data. |

### Strong

The `strong` field specifies whether the validator is strong or not.

Middleware cannot guarantee that it is a strong validator.

This is because the body and `Content-Encoding` can be changed by other
processes after the ETag computing.

In that case, the ETag must be recomputed.

If you can guarantee that this situation will not occur, you can change to
strong validator.

```ts
import { etag } from "https://deno.land/x/etag_middleware@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const middleware = etag({ strong: true });
declare const request: Request;
declare const handler: () => Response;

const response = await middleware(request, handler);
assertEquals(response.headers.get("etag"), `"<hex:SHA-1:Content-Type::body>"`);
```

### Algorithm

Specifies the algorithm of the hash function. Default is `SHA-1`.

```ts
import { etag } from "https://deno.land/x/etag_middleware@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const middleware = etag({ algorithm: "SHA-256" });
declare const request: Request;
declare const handler: () => Response;

const response = await middleware(request, handler);
assertEquals(
  response.headers.get("etag"),
  `W/"<hex:SHA-256:Content-Type::body>"`,
);
```

### Headers

Additional metadata to uniquely identify representation data.

Default is `["content-type"]`.

The strong validator requires uniqueness to include metadata such as
`Content-Type` in addition to the body text.

By adding a header, a hash value is computed from the stream of the body and the
specified header.

```ts
import { etag } from "https://deno.land/x/etag_middleware@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const middleware = etag({ headers: [] });
declare const request: Request;
declare const handler: () => Response;

const response = await middleware(request, handler);
assertEquals(response.headers.get("etag"), `W/"<hex:SHA-256:body>"`);
```

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
