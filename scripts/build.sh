#!/bin/bash

ESBUILD_BIN=./node_modules/.bin/esbuild

${ESBUILD_BIN} \
	src/index.ts \
  --platform=browser \
  --target=es2020 \
  --format=esm \
  --conditions=worker,browser \
	--bundle \
	--minify \
	--outfile=dist/worker.js \
	--allow-overwrite
