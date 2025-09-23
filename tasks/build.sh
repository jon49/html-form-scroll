#!/bin/bash

rm -rf public
mkdir public

npx esbuild html-form-scroll.js --format=iife --outdir=public
npx esbuild ./public/html-form-scroll.js --minify --outfile=public/html-form-scroll.min.js

rm -rf js || true
rm -rf css || true
rm sw.js || true
rm html-form.js || true

cp node_modules/html-form/public/html-form.js ./html-form.js
cp -r ./node_modules/html-form-test-suite/test-files/* ./
