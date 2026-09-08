#!/bin/sh
set -eu
theme_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
export HUGO_RESOURCEDIR="${HUGO_RESOURCE_DIR:-$theme_dir/.hugo-resources}"
export PATH="$theme_dir/node_modules/.bin:$PATH"
base_url="https://victoria.dev/hugo-theme-sam/"
if [ "${1:-}" = "server" ]; then base_url="http://localhost/"; fi
exec hugo --source "$theme_dir/exampleSite" \
  --themesDir "$(dirname -- "$theme_dir")" \
  --theme "$(basename -- "$theme_dir")" \
  --destination "${HUGO_DESTINATION:-$theme_dir/public}" \
  --cleanDestinationDir --minify \
  --baseURL "${HUGO_BASEURL:-$base_url}" "$@"
