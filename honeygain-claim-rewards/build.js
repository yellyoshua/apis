const path = require("path");

require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    allowOverwrite: true,
    outfile: path.join(__dirname, "dist", "worker.js"),
  })
  .catch(() => process.exit(1));
