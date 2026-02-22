import path from "node:path";
import ssg from "@hono/vite-ssg";
import mdx from "@mdx-js/rollup";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import honox from "honox/vite";
import client from "honox/vite/client";

import recmaExportFilepath from "recma-export-filepath";
import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { rehypePlugins, remarkPlugins } from "./app/lib/mdx";

const entry = "./app/server.ts";

const fixViteSsgBuiltins = () => ({
  name: "fix-vite-ssg-builtins",
  configResolved(resolvedConfig: any) {
    const builtins = resolvedConfig.resolve?.builtins;
    if (!Array.isArray(builtins)) {
      resolvedConfig.resolve.builtins = [];
    }
  },
});

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      plugins: [client()],
    };
  }

  return {
    ssr: {
      external: [
        "style-to-js",          // ← require() を含む CJS のため
        "@mdx-js/mdx",          // ← CJS を含むため SSR から除外
        "hast-util-to-estree",  // ← これも require() を内部で呼ぶ
      ],
    },
    assetsInclude: ["**/*.JPG"],
    base: process.env.NODE_ENV === "production" 
      ? "https://www.ponnlog.com" 
      : "/",
    resolve: {
      builtins: [],
    },
    build: {
      emptyOutDir: false,
    },
    plugins: [
      fixViteSsgBuiltins(),
      viteCommonjs({
        include: [
          "acorn-jsx",
          "debug",
          "ms",
          "supports-color",
          "has-flag",
          "extend",
          "style-to-object",
          "inline-style-parser",
          "highlight.js",
          "toml",
          "yaml",
        ],
      }),
      honox(),
      mdx({
        jsxImportSource: "hono/jsx",
        providerImportSource: "./app/lib/mdx-components",
        remarkPlugins,
        rehypePlugins,
        recmaPlugins: [recmaExportFilepath],
      }),
      ssg({ entry }),
      viteStaticCopy({
        targets: [
          {
            src: [
              "./app/routes/posts/**/*.png",
              "./app/routes/posts/**/*.jpg",
              "./app/routes/posts/**/*.jpeg",
              "./app/routes/posts/**/*.webp",
            ],
            dest: "posts",
            rename: (fileName, fileExtension, fullPath) => {
              const destPath = normalizePath(
                path
                  .relative(__dirname, fullPath)
                  .replaceAll("app/routes/posts/", "")
              );
              return destPath;
            },
            overwrite: false,
          },
        ],
      }),
    ],
  };
});

