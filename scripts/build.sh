#!/bin/bash

ESBUILD_BIN=./node_modules/.bin/esbuild

${ESBUILD_BIN} \
	src/index.ts \
	--bundle \
	--outfile=dist/worker.js
