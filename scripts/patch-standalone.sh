#!/bin/sh
set -eu

RT=.next/standalone/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js

# Server runtime: strip /_next/ from generated asset URLs
sed -i \
  -e 's|\${t}/_next/|\${t}/|g' \
  -e 's|\${t\.assetPrefix}/_next/|\${t.assetPrefix}/|g' \
  -e 's|\${a\.assetPrefix}/_next/|\${a.assetPrefix}/|g' \
  -e 's|\${e\.assetPrefix}/_next/|\${e.assetPrefix}/|g' \
  -e 's|\${f}/_next/|\${f}/|g' \
  -e 's|\${s}/_next/|\${s}/|g' \
  "$RT"

if grep -qF \
  -e '${t}/_next/' \
  -e '${t.assetPrefix}/_next/' \
  -e '${a.assetPrefix}/_next/' \
  -e '${e.assetPrefix}/_next/' \
  -e '${f}/_next/' \
  -e '${s}/_next/' \
  "$RT"; then
  echo "PATCH FAILED: server runtime still contains /_next/ generators" >&2
  exit 1
fi

# Client: make the asset prefix lookup accept /static/ as well as /_next/
FILES=$(grep -rl 'Expected document.currentScript src' \
  .next/standalone/.next/static .next/standalone/public/static || true)

if [ -z "$FILES" ]; then
  echo "PATCH FAILED: client prefix lookup not found" >&2
  exit 1
fi

for f in $FILES; do
  sed -i 's#t\.indexOf("/_next/")#(t.indexOf("/_next/")+1||t.indexOf("/static/")+1)-1#g' "$f"
  if ! grep -qF 'indexOf("/static/")' "$f"; then
    echo "PATCH FAILED: client patch did not apply to $f" >&2
    exit 1
  fi
done

echo "standalone patches applied"
