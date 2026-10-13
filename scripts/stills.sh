#!/usr/bin/env bash
# Usage : scripts/stills.sh <dossier-de-sortie> <secondes> [<secondes> ...]
# Rend des images fixes de la composition Master aux instants donnés (en secondes).
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="$1"; shift
mkdir -p "$OUT"
npx remotion bundle src/index.ts --out-dir out/bundle --log=error >/dev/null
for s in "$@"; do
  frame=$(python3 -c "print(round($s*30))")
  name=$(python3 -c "s=$s; m=int(s//60); print(f'{m}m{s-m*60:05.2f}s'.replace('.','_'))")
  npx remotion still out/bundle Master "$OUT/$name.png" --frame="$frame" --log=error
  echo "$OUT/$name.png"
done
