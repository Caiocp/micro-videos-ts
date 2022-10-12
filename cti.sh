#!/bin/sh

yarn cti create './src/shared/application' -i '*spec.ts' -b &&
yarn cti create './src/shared/domain' -i '*spec.ts' -b &&
yarn cti create './src/shared/infra' -i '*spec.ts' -b &&

yarn cti create './src/category/application' -i '*spec.ts' -b &&
yarn cti create './src/category/domain' -i '*spec.ts' -b &&
yarn cti create './src/category/infra' -i '*spec.ts' -b