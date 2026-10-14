#!/usr/bin/env bash
# Vérifie un MP4 : durée, format, piste audio, poids ; extrait une image toutes les 5 s en planche contact.
# Usage : scripts/verify.sh fichier.mp4 [planche.jpg]
set -euo pipefail
F="$1"; SHEET="${2:-${F%.mp4}_planche.jpg}"
echo "== $F"
ls -l "$F" | awk '{printf "Poids : %.1f Mo\n", $5/1e6}'
ffprobe -v error -show_entries format=duration,bit_rate -of default=nw=1 "$F"
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate,nb_frames,pix_fmt -of default=nw=1 "$F"
if ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1 "$F" | grep -q codec_name; then
  ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1 "$F"
else
  echo "Piste audio : aucune"
fi
ffmpeg -y -loglevel error -i "$F" -vf "fps=1/5,scale=480:270,tile=4x7:padding=4:color=black" -frames:v 1 -q:v 3 "$SHEET"
echo "Planche : $SHEET"
