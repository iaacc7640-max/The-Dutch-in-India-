#!/bin/bash
# 9:16 Shorts reframe of one chapter: bash tools/shorts.sh <out.mp4> <start> <end> <year> "<title>"
# Picture (no captions) enlarged in the middle, captions re-rendered large below it, a title band on top,
# the bottom ~420 px left as parchment for the Shorts UI. Uses data/mix.wav for the sound.
set -eu
OUT=$1; S=$2; E=$3; YEAR=$4; TT=$5; TMP=$(mktemp -d)
QS='&nocap=1' node tools/capture.mjs video "$TMP/pic.mp4" "$S" "$E" >/dev/null
QS='&caponly=1' node tools/capture.mjs video "$TMP/cap.mp4" "$S" "$E" --draft >/dev/null
QS="&page=stitle&year=$YEAR&tt=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$TT")" node tools/capture.mjs frames "$TMP/t" "0" >/dev/null
D=$(python3 -c "print(round($E-$S,3))")
ffmpeg -v error -y -i "$TMP/pic.mp4" -i "$TMP/cap.mp4" -loop 1 -i "$TMP/t/t0.00.jpg" -filter_complex "
color=c=0xE9DCBC:s=1080x1920:d=$D[bg];
[2]crop=1080:520:420:150[title];
[0:v]scale=1404:790,crop=1080:790[pic];
[1:v]crop=1500:250:210:415,scale=1080:180[cap];
[bg][title]overlay=0:40:shortest=1[a];[a][pic]overlay=0:580[b];[b][cap]overlay=0:1395[v]" \
  -map "[v]" -map 0:a -af "afade=t=in:d=0.3,afade=t=out:st=$(python3 -c "print(round($D-0.5,3))"):d=0.5" -t "$D" \
  -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart "$OUT"
rm -rf "$TMP"; echo "$OUT ($D s)"
