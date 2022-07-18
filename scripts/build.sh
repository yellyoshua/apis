#!/bin/bash

ESBUILD_BIN=./node_modules/.bin/esbuild

${ESBUILD_BIN} \
	src/index.ts \
  --platform=node \
  --conditions=worker,browser \
	--bundle \
	--outfile=dist/worker.js
