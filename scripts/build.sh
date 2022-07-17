#!/bin/bash

ESBUILD_BIN=./node_modules/.bin/esbuild

${ESBUILD_BIN} \
	src/index.ts \
  --platform=browser \
  --target=es2020 \
  --format=cjs \
  --conditions=worker,browser \
	--bundle \
	--outfile=dist/worker.js \
	--allow-overwrite
