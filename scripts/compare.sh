#!/usr/bin/env bash
# Usage : scripts/compare.sh <rendu.png> <reference.jpg> <sortie.jpg>
# Planche côte à côte : référence (gauche) | rendu Remotion (droite)
set -euo pipefail
ffmpeg -loglevel error -y -i "$2" -i "$1" -filter_complex \
 "[0]scale=960:540,drawtext=text='REFERENCE':x=20:y=20:fontsize=28:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=8[a];[1]scale=960:540,drawtext=text='RENDU':x=20:y=20:fontsize=28:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=8[b];[a][b]hstack" \
 -q:v 3 "$3"
