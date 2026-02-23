import fs from "node:fs";
import path from "node:path";
import ssg from "@hono/vite-ssg";
import mdx from "@mdx-js/rollup";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import honox from "honox/vite";
import client from "honox/vite/client";
import tailwindcss from "@tailwindcss/vite";

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

/**
 * Dev-only plugin: serves post images from app/routes/posts/ at /posts/
 * so that frontmatter `image: "/posts/slug/file.png"` works in dev.
 */
const servePostImages = (): import("vite").Plugin => ({
  name: "serve-post-images",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (!req.url) return next();
      // Match both /posts/slug/file.png and /app/routes/posts/slug/file.png
      const match = req.url.match(
        /^\/(app\/routes\/posts|posts)\/(.+\.(png|jpe?g|webp|gif|svg|avif))(\?.*)?$/i
      );
      if (!match) return next();
      const relativePath = match[2]; // e.g. "hello-world/53372440.png"
      const filePath = path.resolve(__dirname, "app/routes/posts", relativePath);
      if (!fs.existsSync(filePath)) return next();
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".avif": "image/avif",
      };
      res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
      fs.createReadStream(filePath).pipe(res);
    });
  },
});

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      plugins: [client(), tailwindcss()],
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
      alias: {
        "@": path.resolve(__dirname, "./app"),
      },
      builtins: [],
    },
    build: {
      emptyOutDir: false,
    },
    plugins: [
      servePostImages(),
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
      tailwindcss(),
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

