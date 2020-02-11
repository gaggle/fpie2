#!/usr/bin/env sh
cd fixtures/docker/package
node ../../../../src/cli.js .. .includefile --print-files
node ../../../../src/cli.js .. .includefile
node ../../../../src/cli.js .. .includefile | docker build --rm -f package/Dockerfile -
