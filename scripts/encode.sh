#!/usr/bin/env bash
# Ré-encode le master haute qualité en MP4 H.264 de moins de 95 Mo (2 passes), + version sans son.
# Usage : scripts/encode.sh [entrée=out/master_hq.mp4]
set -euo pipefail
cd "$(dirname "$0")/.."
IN="${1:-out/master_hq.mp4}"
OUT="rendu/coopeo-ai-master.mp4"
OUT_MUET="rendu/coopeo-ai-master-sans-son.mp4"
mkdir -p rendu out
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
# budget : 92 Mo au total (marge sous 95 Mo), audio AAC 192 kb/s
VBR=$(python3 -c "d=$DUR; print(int((92e6*8/d - 192e3)/1000))")
echo "Durée ${DUR}s → débit vidéo ${VBR} kb/s"
ffmpeg -y -loglevel error -i "$IN" -c:v libx264 -preset slow -b:v ${VBR}k -pass 1 -passlogfile out/x264 -pix_fmt yuv420p -an -f mp4 /dev/null
ffmpeg -y -loglevel error -i "$IN" -c:v libx264 -preset slow -b:v ${VBR}k -maxrate $((VBR*2))k -bufsize $((VBR*4))k -pass 2 -passlogfile out/x264 \
  -pix_fmt yuv420p -profile:v high -movflags +faststart -c:a aac -b:a 192k -ar 48000 "$OUT"
ffmpeg -y -loglevel error -i "$OUT" -c:v copy -an -movflags +faststart "$OUT_MUET"
ls -l "$OUT" "$OUT_MUET"
