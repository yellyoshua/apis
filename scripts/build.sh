#!/bin/bash

ESBUILD_BIN=./node_modules/.bin/esbuild

${ESBUILD_BIN} \
	src/index.ts \
	--bundle \
	--minify \
	--outfile=dist/worker.js \
	--allow-overwrite