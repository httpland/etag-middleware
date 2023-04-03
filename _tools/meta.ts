import { BuildOptions } from "https://deno.land/x/dnt@0.33.1/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  compilerOptions: {
    lib: ["dom", "dom.iterable", "esnext"],
  },
  typeCheck: true,
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    name: "@httpland/etag-middleware",
    version,
    description: "HTTP ETag middleware",
    keywords: [
      "http",
      "middleware",
      "header",
      "etag",
      "weak",
      "entity-tag",
      "fetch-api",
    ],
    license: "MIT",
    homepage: "https://github.com/httpland/etag-middleware",
    repository: {
      type: "git",
      url: "git+https://github.com/httpland/etag-middleware.git",
    },
    bugs: {
      url: "https://github.com/httpland/etag-middleware/issues",
    },
    sideEffects: false,
    type: "module",
    publishConfig: {
      access: "public",
    },
  },
  packageManager: "pnpm",
  mappings: {
    "https://deno.land/x/http_middleware@1.0.0/mod.ts": {
      name: "@httpland/http-middleware",
      version: "1.0.0",
    },
    "https://deno.land/x/isx@1.1.1/is_string.ts": {
      name: "@miyauci/isx",
      version: "1.1.1",
      subPath: "is_string",
    },
    "https://deno.land/x/http_utils@1.0.0/header.ts": {
      name: "@httpland/http-utils",
      version: "1.0.0",
      subPath: "header.js",
    },
    "https://deno.land/x/etag_parser@1.1.0/mod.ts": {
      name: "@httpland/etag-parser",
      version: "1.1.0",
    },
  },
});
