import { defineConfig } from "tsup";

import pkg from "./package.json" assert { type: "json" };

export default defineConfig({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "esnext",
  outdir: "dist",
  sourcemap: true,
  format: "esm",
  minify: true,
  external: Object.keys(pkg.dependencies),
  define: {
    "process.env.LOCAL_NODE_ENV":
      process.env.ENV === "dev" ? '"development"' : '"production"',
  },
  dts: true,
});
