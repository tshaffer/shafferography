#!/usr/bin/env bash
set -euo pipefail

QUAR_ROOT="/Volumes/ShMedia/Shafferography/_QUARANTINE/byte_identical_dupes_20260222_131733"
mkdir -p "$QUAR_ROOT"
LOG="$QUAR_ROOT/move_log.txt"
echo "Quarantine root: $QUAR_ROOT" | tee "$LOG"

# IMG_0987.jpg  takenAt=2025-05-10T10:34:23.000+10:00  dims=10726x3682
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Australia 2025/05_11_2025/IMG_0987.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Australia 2025/05_11_2025"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Australia 2025/05_11_2025/IMG_0987.jpg -> $QUAR_ROOT/Australia 2025/05_11_2025/IMG_0987.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Australia 2025/05_11_2025/IMG_0987.jpg" "$QUAR_ROOT/Australia 2025/05_11_2025/IMG_0987.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Australia 2025/05_11_2025/IMG_0987.jpg" | tee -a "$LOG"
fi

# IMG_3831.JPG  takenAt=2024-09-27T09:27:27.000-07:00  dims=1536x2048
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3831.JPG" ]; then
  mkdir -p "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3831.JPG -> $QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3831.JPG" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3831.JPG" "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3831.JPG"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3831.JPG" | tee -a "$LOG"
fi

# IMG_3832.JPG  takenAt=2024-09-27T09:27:37.000-07:00  dims=1536x2048
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3832.JPG" ]; then
  mkdir -p "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3832.JPG -> $QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3832.JPG" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3832.JPG" "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3832.JPG"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3832.JPG" | tee -a "$LOG"
fi

# IMG_3833.JPG  takenAt=2024-09-27T09:27:36.000-07:00  dims=1536x2048
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3833.JPG" ]; then
  mkdir -p "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3833.JPG -> $QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3833.JPG" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3833.JPG" "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3833.JPG"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3833.JPG" | tee -a "$LOG"
fi

# IMG_3834.JPG  takenAt=2024-09-27T09:27:46.000-07:00  dims=1536x2048
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3834.JPG" ]; then
  mkdir -p "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3834.JPG -> $QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3834.JPG" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3834.JPG" "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3834.JPG"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3834.JPG" | tee -a "$LOG"
fi

# IMG_3835.JPG  takenAt=2024-09-27T09:27:47.000-07:00  dims=1536x2048
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3835.JPG" ]; then
  mkdir -p "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3835.JPG -> $QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3835.JPG" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3835.JPG" "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3835.JPG"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3835.JPG" | tee -a "$LOG"
fi

# IMG_3836.JPG  takenAt=2024-09-27T09:27:47.000-07:00  dims=1536x2048
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3836.JPG" ]; then
  mkdir -p "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3836.JPG -> $QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3836.JPG" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3836.JPG" "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3836.JPG"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3836.JPG" | tee -a "$LOG"
fi

# IMG_3838.JPG  takenAt=2024-09-27T11:42:08.000-07:00  dims=1536x2048
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3838.JPG" ]; then
  mkdir -p "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3838.JPG -> $QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3838.JPG" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3838.JPG" "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3838.JPG"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3838.JPG" | tee -a "$LOG"
fi

# IMG_3839.JPG  takenAt=2024-09-27T11:42:09.000-07:00  dims=1536x2048
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3839.JPG" ]; then
  mkdir -p "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3839.JPG -> $QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3839.JPG" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3839.JPG" "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3839.JPG"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3839.JPG" | tee -a "$LOG"
fi

# IMG_3840.JPG  takenAt=2024-09-27T11:42:17.000-07:00  dims=1536x2048
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3840.JPG" ]; then
  mkdir -p "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3840.JPG -> $QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3840.JPG" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3840.JPG" "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3840.JPG"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3840.JPG" | tee -a "$LOG"
fi

# IMG_3841.JPG  takenAt=2024-09-27T11:42:26.000-07:00  dims=1536x2048
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3841.JPG" ]; then
  mkdir -p "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3841.JPG -> $QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3841.JPG" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3841.JPG" "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3841.JPG"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3841.JPG" | tee -a "$LOG"
fi

# IMG_3846.JPG  takenAt=2024-09-27T16:42:28.000-07:00  dims=1536x2048
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3846.JPG" ]; then
  mkdir -p "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3846.JPG -> $QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3846.JPG" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3846.JPG" "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3846.JPG"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3846.JPG" | tee -a "$LOG"
fi

# IMG_3847.JPG  takenAt=2024-09-27T16:42:27.000-07:00  dims=1536x2048
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3847.JPG" ]; then
  mkdir -p "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3847.JPG -> $QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3847.JPG" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3847.JPG" "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3847.JPG"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3847.JPG" | tee -a "$LOG"
fi

# IMG_3861.JPG  takenAt=2024-09-27T16:48:32.000-07:00  dims=1536x2048
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3861.JPG" ]; then
  mkdir -p "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3861.JPG -> $QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3861.JPG" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3861.JPG" "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3861.JPG"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3861.JPG" | tee -a "$LOG"
fi

# IMG_3863.JPG  takenAt=2024-09-27T18:06:31.000-07:00  dims=2048x1536
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3863.JPG" ]; then
  mkdir -p "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3863.JPG -> $QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3863.JPG" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3863.JPG" "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3863.JPG"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3863.JPG" | tee -a "$LOG"
fi

# IMG_3865.JPG  takenAt=2024-09-27T19:11:44.000-07:00  dims=1536x2048
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3865.JPG" ]; then
  mkdir -p "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3865.JPG -> $QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3865.JPG" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3865.JPG" "$QUAR_ROOT/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3865.JPG"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Jorgan Wedding Photos/Jorgan Wedding Guest Photos/IMG_3865.JPG" | tee -a "$LOG"
fi

# IMG_5126.jpg  takenAt=2024-12-08T11:18:18.000-08:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5126.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5126.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5126.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5126.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5126.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5126.jpg" | tee -a "$LOG"
fi

# IMG_5127.jpg  takenAt=2024-12-08T11:18:25.000-08:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5127.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5127.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5127.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5127.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5127.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5127.jpg" | tee -a "$LOG"
fi

# IMG_5153.jpg  takenAt=2024-12-08T11:45:42.000-08:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5153.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5153.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5153.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5153.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5153.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5153.jpg" | tee -a "$LOG"
fi

# IMG_5168.jpg  takenAt=2024-12-08T16:24:29.000-08:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5168.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5168.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5168.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5168.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5168.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5168.jpg" | tee -a "$LOG"
fi

# IMG_5171.jpg  takenAt=2024-12-08T16:24:33.000-08:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5171.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5171.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5171.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5171.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5171.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5171.jpg" | tee -a "$LOG"
fi

# IMG_5176.jpg  takenAt=2024-12-08T16:25:20.000-08:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5176.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5176.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5176.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5176.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5176.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5176.jpg" | tee -a "$LOG"
fi

# IMG_5677.jpg  takenAt=2024-08-19T19:21:57.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_5677.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_5677.jpg -> $QUAR_ROOT/Arcata 2024/IMG_5677.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_5677.jpg" "$QUAR_ROOT/Arcata 2024/IMG_5677.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_5677.jpg" | tee -a "$LOG"
fi

# IMG_5953.jpg  takenAt=2024-12-08T11:27:38.000-08:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5953.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5953.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5953.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5953.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5953.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5953.jpg" | tee -a "$LOG"
fi

# IMG_5954.jpg  takenAt=2024-12-08T11:27:20.000-08:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5954.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5954.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5954.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5954.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5954.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5954.jpg" | tee -a "$LOG"
fi

# IMG_5956.jpg  takenAt=2024-12-08T11:27:40.000-08:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5956.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5956.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5956.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5956.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5956.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5956.jpg" | tee -a "$LOG"
fi

# IMG_5962.jpg  takenAt=2024-12-08T16:47:20.000-08:00  dims=4284x5712
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5962.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5962.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5962.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5962.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5962.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5962.jpg" | tee -a "$LOG"
fi

# IMG_5965.jpg  takenAt=2024-12-08T17:02:19.000-08:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5965.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5965.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5965.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5965.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5965.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5965.jpg" | tee -a "$LOG"
fi

# IMG_5969.jpg  takenAt=2024-12-08T17:02:22.000-08:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5969.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5969.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5969.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5969.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5969.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5969.jpg" | tee -a "$LOG"
fi

# IMG_5973.jpg  takenAt=2024-12-08T17:02:24.000-08:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5973.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5973.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5973.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5973.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5973.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5973.jpg" | tee -a "$LOG"
fi

# IMG_5976.jpg  takenAt=2024-12-08T15:17:06.000-08:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5976.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5976.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5976.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5976.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5976.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5976.jpg" | tee -a "$LOG"
fi

# IMG_5977.jpg  takenAt=2024-12-08T10:09:13.000-08:00  dims=4284x5712
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5977.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5977.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5977.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5977.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5977.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5977.jpg" | tee -a "$LOG"
fi

# IMG_5980.jpg  takenAt=2024-12-08T16:47:08.000-08:00  dims=4284x5712
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5980.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5980.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5980.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5980.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5980.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5980.jpg" | tee -a "$LOG"
fi

# IMG_5982.jpg  takenAt=2024-12-08T17:02:20.000-08:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5982.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5982.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5982.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5982.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5982.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5982.jpg" | tee -a "$LOG"
fi

# IMG_5983.jpg  takenAt=2024-12-08T15:35:10.000-08:00  dims=4284x5712
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5983.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Lori Birthday 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5983.jpg -> $QUAR_ROOT/Lori Birthday 2024/IMG_5983.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5983.jpg" "$QUAR_ROOT/Lori Birthday 2024/IMG_5983.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Lori Birthday 2024/IMG_5983.jpg" | tee -a "$LOG"
fi

# IMG_6111.jpg  takenAt=2025-01-20T19:36:43.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_6111.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Baja 2025/Shaffer Media"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_6111.jpg -> $QUAR_ROOT/Baja 2025/Shaffer Media/IMG_6111.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_6111.jpg" "$QUAR_ROOT/Baja 2025/Shaffer Media/IMG_6111.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_6111.jpg" | tee -a "$LOG"
fi

# IMG_6606.jpg  takenAt=2025-05-10T10:27:06.000+10:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Australia 2025/05_11_2025/IMG_6606.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Australia 2025/05_11_2025"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Australia 2025/05_11_2025/IMG_6606.jpg -> $QUAR_ROOT/Australia 2025/05_11_2025/IMG_6606.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Australia 2025/05_11_2025/IMG_6606.jpg" "$QUAR_ROOT/Australia 2025/05_11_2025/IMG_6606.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Australia 2025/05_11_2025/IMG_6606.jpg" | tee -a "$LOG"
fi

# IMG_6609.jpg  takenAt=2025-05-10T10:33:57.000+10:00  dims=5712x4284
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Australia 2025/05_11_2025/IMG_6609.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Australia 2025/05_11_2025"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Australia 2025/05_11_2025/IMG_6609.jpg -> $QUAR_ROOT/Australia 2025/05_11_2025/IMG_6609.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Australia 2025/05_11_2025/IMG_6609.jpg" "$QUAR_ROOT/Australia 2025/05_11_2025/IMG_6609.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Australia 2025/05_11_2025/IMG_6609.jpg" | tee -a "$LOG"
fi

# IMG_9070.jpg  takenAt=2024-07-15T07:58:07.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9070.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9070.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9070.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9070.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9070.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9070.jpg" | tee -a "$LOG"
fi

# IMG_9071.jpg  takenAt=2024-07-15T07:58:20.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9071.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9071.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9071.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9071.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9071.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9071.jpg" | tee -a "$LOG"
fi

# IMG_9072.jpg  takenAt=2024-07-15T07:58:49.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9072.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9072.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9072.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9072.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9072.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9072.jpg" | tee -a "$LOG"
fi

# IMG_9073.jpg  takenAt=2024-07-15T08:11:46.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9073.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9073.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9073.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9073.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9073.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9073.jpg" | tee -a "$LOG"
fi

# IMG_9074.jpg  takenAt=2024-07-15T08:11:59.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9074.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9074.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9074.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9074.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9074.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9074.jpg" | tee -a "$LOG"
fi

# IMG_9075.jpg  takenAt=2024-07-15T08:12:16.000-07:00  dims=7830x3920
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9075.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9075.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9075.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9075.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9075.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9075.jpg" | tee -a "$LOG"
fi

# IMG_9076.jpg  takenAt=2024-07-15T08:13:07.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9076.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9076.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9076.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9076.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9076.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9076.jpg" | tee -a "$LOG"
fi

# IMG_9077.jpg  takenAt=2024-07-15T08:13:26.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9077.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9077.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9077.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9077.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9077.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9077.jpg" | tee -a "$LOG"
fi

# IMG_9078.jpg  takenAt=2024-07-15T08:41:00.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9078.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9078.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9078.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9078.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9078.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9078.jpg" | tee -a "$LOG"
fi

# IMG_9079.jpg  takenAt=2024-07-15T08:41:02.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9079.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9079.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9079.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9079.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9079.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9079.jpg" | tee -a "$LOG"
fi

# IMG_9080.jpg  takenAt=2024-07-15T08:41:12.000-07:00  dims=6348x3920
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9080.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9080.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9080.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9080.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9080.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9080.jpg" | tee -a "$LOG"
fi

# IMG_9081.jpg  takenAt=2024-07-15T08:41:47.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9081.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9081.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9081.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9081.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9081.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9081.jpg" | tee -a "$LOG"
fi

# IMG_9082.jpg  takenAt=2024-07-15T08:42:41.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9082.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9082.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9082.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9082.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9082.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9082.jpg" | tee -a "$LOG"
fi

# IMG_9083.jpg  takenAt=2024-07-15T08:42:45.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9083.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9083.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9083.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9083.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9083.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9083.jpg" | tee -a "$LOG"
fi

# IMG_9084.jpg  takenAt=2024-07-15T08:42:53.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9084.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9084.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9084.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9084.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9084.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9084.jpg" | tee -a "$LOG"
fi

# IMG_9085.jpg  takenAt=2024-07-15T08:44:18.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9085.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9085.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9085.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9085.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9085.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9085.jpg" | tee -a "$LOG"
fi

# IMG_9086.jpg  takenAt=2024-07-15T08:46:04.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9086.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9086.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9086.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9086.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9086.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9086.jpg" | tee -a "$LOG"
fi

# IMG_9087.jpg  takenAt=2024-07-15T08:57:44.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9087.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9087.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9087.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9087.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9087.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9087.jpg" | tee -a "$LOG"
fi

# IMG_9088.jpg  takenAt=2024-07-15T08:57:57.000-07:00  dims=4560x3942
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9088.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9088.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9088.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9088.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9088.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9088.jpg" | tee -a "$LOG"
fi

# IMG_9089.jpg  takenAt=2024-07-15T08:58:35.000-07:00  dims=3096x3908
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9089.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9089.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9089.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9089.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9089.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9089.jpg" | tee -a "$LOG"
fi

# IMG_9090.jpg  takenAt=2024-07-15T08:58:42.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9090.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9090.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9090.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9090.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9090.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9090.jpg" | tee -a "$LOG"
fi

# IMG_9091.jpg  takenAt=2024-07-15T09:01:36.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9091.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9091.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9091.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9091.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9091.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9091.jpg" | tee -a "$LOG"
fi

# IMG_9092.jpg  takenAt=2024-07-15T09:01:42.000-07:00  dims=3904x4838
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9092.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9092.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9092.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9092.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9092.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9092.jpg" | tee -a "$LOG"
fi

# IMG_9093.jpg  takenAt=2024-07-15T09:02:01.000-07:00  dims=7022x3922
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9093.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9093.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9093.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9093.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9093.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9093.jpg" | tee -a "$LOG"
fi

# IMG_9094.jpg  takenAt=2024-07-15T09:08:08.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9094.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9094.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9094.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9094.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9094.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9094.jpg" | tee -a "$LOG"
fi

# IMG_9095.jpg  takenAt=2024-07-15T09:09:49.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9095.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9095.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9095.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9095.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9095.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9095.jpg" | tee -a "$LOG"
fi

# IMG_9096.jpg  takenAt=2024-07-15T09:09:53.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9096.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9096.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9096.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9096.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9096.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9096.jpg" | tee -a "$LOG"
fi

# IMG_9097.jpg  takenAt=2024-07-15T09:18:18.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9097.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9097.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9097.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9097.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9097.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9097.jpg" | tee -a "$LOG"
fi

# IMG_9098.jpg  takenAt=2024-07-15T09:22:38.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9098.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9098.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9098.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9098.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9098.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9098.jpg" | tee -a "$LOG"
fi

# IMG_9099.jpg  takenAt=2024-07-15T09:22:46.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9099.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9099.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9099.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9099.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9099.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9099.jpg" | tee -a "$LOG"
fi

# IMG_9100.jpg  takenAt=2024-07-15T09:23:00.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9100.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9100.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9100.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9100.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9100.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9100.jpg" | tee -a "$LOG"
fi

# IMG_9101.jpg  takenAt=2024-07-15T09:23:18.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9101.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9101.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9101.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9101.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9101.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9101.jpg" | tee -a "$LOG"
fi

# IMG_9102.jpg  takenAt=2024-07-15T09:23:25.000-07:00  dims=3800x6740
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9102.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9102.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9102.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9102.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9102.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9102.jpg" | tee -a "$LOG"
fi

# IMG_9103.jpg  takenAt=2024-07-15T09:23:48.000-07:00  dims=8766x3906
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9103.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9103.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9103.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9103.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9103.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9103.jpg" | tee -a "$LOG"
fi

# IMG_9104.jpg  takenAt=2024-07-15T09:24:15.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9104.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9104.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9104.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9104.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9104.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9104.jpg" | tee -a "$LOG"
fi

# IMG_9105.jpg  takenAt=2024-07-15T09:25:32.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9105.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9105.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9105.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9105.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9105.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9105.jpg" | tee -a "$LOG"
fi

# IMG_9106.jpg  takenAt=2024-07-15T09:25:38.000-07:00  dims=8832x3826
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9106.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9106.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9106.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9106.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9106.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9106.jpg" | tee -a "$LOG"
fi

# IMG_9107.jpg  takenAt=2024-07-15T09:26:21.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9107.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9107.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9107.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9107.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9107.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9107.jpg" | tee -a "$LOG"
fi

# IMG_9108.jpg  takenAt=2024-07-15T09:26:29.000-07:00  dims=9210x3826
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9108.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9108.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9108.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9108.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9108.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9108.jpg" | tee -a "$LOG"
fi

# IMG_9110.jpg  takenAt=2024-07-15T09:29:54.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9110.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9110.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9110.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9110.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9110.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9110.jpg" | tee -a "$LOG"
fi

# IMG_9111.jpg  takenAt=2024-07-15T09:30:00.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9111.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9111.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9111.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9111.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9111.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9111.jpg" | tee -a "$LOG"
fi

# IMG_9112.jpg  takenAt=2024-07-15T09:32:35.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9112.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9112.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9112.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9112.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9112.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9112.jpg" | tee -a "$LOG"
fi

# IMG_9113.jpg  takenAt=2024-07-15T09:32:49.000-07:00  dims=3678x4680
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9113.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9113.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9113.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9113.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9113.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9113.jpg" | tee -a "$LOG"
fi

# IMG_9114.jpg  takenAt=2024-07-15T09:33:07.000-07:00  dims=8982x3858
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9114.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9114.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9114.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9114.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9114.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9114.jpg" | tee -a "$LOG"
fi

# IMG_9115.jpg  takenAt=2024-07-15T09:35:29.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9115.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9115.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9115.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9115.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9115.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9115.jpg" | tee -a "$LOG"
fi

# IMG_9116.jpg  takenAt=2024-07-15T09:35:41.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9116.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9116.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9116.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9116.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9116.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9116.jpg" | tee -a "$LOG"
fi

# IMG_9117.jpg  takenAt=2024-07-15T09:36:44.000-07:00  dims=8524x3876
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9117.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9117.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9117.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9117.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9117.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9117.jpg" | tee -a "$LOG"
fi

# IMG_9118.jpg  takenAt=2024-07-15T09:37:06.000-07:00  dims=3690x4546
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9118.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9118.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9118.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9118.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9118.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9118.jpg" | tee -a "$LOG"
fi

# IMG_9119.jpg  takenAt=2024-07-15T09:53:07.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9119.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9119.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9119.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9119.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9119.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9119.jpg" | tee -a "$LOG"
fi

# IMG_9120.jpg  takenAt=2024-07-15T09:53:17.000-07:00  dims=8128x3834
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9120.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9120.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9120.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9120.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9120.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9120.jpg" | tee -a "$LOG"
fi

# IMG_9121.jpg  takenAt=2024-07-15T09:55:12.000-07:00  dims=7610x3828
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9121.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9121.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9121.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9121.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9121.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9121.jpg" | tee -a "$LOG"
fi

# IMG_9122.jpg  takenAt=2024-07-15T10:15:49.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9122.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9122.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9122.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9122.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9122.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9122.jpg" | tee -a "$LOG"
fi

# IMG_9123.jpg  takenAt=2024-07-15T10:16:10.000-07:00  dims=8006x3878
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9123.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9123.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9123.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9123.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9123.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9123.jpg" | tee -a "$LOG"
fi

# IMG_9124.jpg  takenAt=2024-07-15T10:16:46.000-07:00  dims=3956x3486
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9124.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9124.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9124.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9124.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9124.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9124.jpg" | tee -a "$LOG"
fi

# IMG_9125.jpg  takenAt=2024-07-15T10:18:25.000-07:00  dims=7816x3882
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9125.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9125.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9125.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9125.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9125.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9125.jpg" | tee -a "$LOG"
fi

# IMG_9126.jpg  takenAt=2024-07-15T10:18:45.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9126.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9126.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9126.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9126.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9126.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9126.jpg" | tee -a "$LOG"
fi

# IMG_9127.jpg  takenAt=2024-07-15T10:22:44.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9127.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9127.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9127.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9127.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9127.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9127.jpg" | tee -a "$LOG"
fi

# IMG_9128.jpg  takenAt=2024-07-15T10:22:52.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9128.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9128.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9128.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9128.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9128.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9128.jpg" | tee -a "$LOG"
fi

# IMG_9129.jpg  takenAt=2024-07-15T10:28:58.000-07:00  dims=7478x3922
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9129.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9129.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9129.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9129.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9129.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9129.jpg" | tee -a "$LOG"
fi

# IMG_9130.jpg  takenAt=2024-07-15T10:29:22.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9130.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9130.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9130.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9130.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9130.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9130.jpg" | tee -a "$LOG"
fi

# IMG_9131.jpg  takenAt=2024-07-15T10:43:50.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9131.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9131.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9131.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9131.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9131.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9131.jpg" | tee -a "$LOG"
fi

# IMG_9132.jpg  takenAt=2024-07-15T10:43:56.000-07:00  dims=3716x7298
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9132.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9132.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9132.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9132.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9132.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9132.jpg" | tee -a "$LOG"
fi

# IMG_9133.jpg  takenAt=2024-07-15T10:47:57.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9133.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9133.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9133.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9133.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9133.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9133.jpg" | tee -a "$LOG"
fi

# IMG_9136.jpg  takenAt=2024-07-15T10:49:46.000-07:00  dims=9166x3868
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9136.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9136.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9136.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9136.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9136.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9136.jpg" | tee -a "$LOG"
fi

# IMG_9137.jpg  takenAt=2024-07-15T10:50:18.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9137.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9137.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9137.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9137.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9137.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9137.jpg" | tee -a "$LOG"
fi

# IMG_9138.jpg  takenAt=2024-07-15T10:50:24.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9138.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Snow Lake 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9138.jpg -> $QUAR_ROOT/Snow Lake 2024/IMG_9138.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9138.jpg" "$QUAR_ROOT/Snow Lake 2024/IMG_9138.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Snow Lake 2024/IMG_9138.jpg" | tee -a "$LOG"
fi

# IMG_9140.jpg  takenAt=2024-07-16T09:43:54.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9140.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9140.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9140.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9140.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9140.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9140.jpg" | tee -a "$LOG"
fi

# IMG_9141.jpg  takenAt=2024-07-16T09:44:01.000-07:00  dims=3854x5474
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9141.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9141.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9141.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9141.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9141.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9141.jpg" | tee -a "$LOG"
fi

# IMG_9142.jpg  takenAt=2024-07-16T09:44:19.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9142.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9142.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9142.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9142.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9142.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9142.jpg" | tee -a "$LOG"
fi

# IMG_9143.jpg  takenAt=2024-07-16T09:44:26.000-07:00  dims=4708x3956
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9143.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9143.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9143.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9143.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9143.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9143.jpg" | tee -a "$LOG"
fi

# IMG_9145.jpg  takenAt=2024-07-16T10:00:35.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9145.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9145.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9145.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9145.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9145.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9145.jpg" | tee -a "$LOG"
fi

# IMG_9146.jpg  takenAt=2024-07-16T10:00:43.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9146.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9146.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9146.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9146.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9146.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9146.jpg" | tee -a "$LOG"
fi

# IMG_9147.jpg  takenAt=2024-07-16T10:22:23.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9147.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9147.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9147.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9147.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9147.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9147.jpg" | tee -a "$LOG"
fi

# IMG_9148.jpg  takenAt=2024-07-16T10:22:37.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9148.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9148.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9148.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9148.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9148.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9148.jpg" | tee -a "$LOG"
fi

# IMG_9149.jpg  takenAt=2024-07-16T10:24:17.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9149.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9149.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9149.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9149.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9149.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9149.jpg" | tee -a "$LOG"
fi

# IMG_9150.jpg  takenAt=2024-07-16T10:24:32.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9150.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9150.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9150.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9150.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9150.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9150.jpg" | tee -a "$LOG"
fi

# IMG_9151.jpg  takenAt=2024-07-16T10:35:31.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9151.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9151.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9151.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9151.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9151.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9151.jpg" | tee -a "$LOG"
fi

# IMG_9152.jpg  takenAt=2024-07-16T10:35:51.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9152.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9152.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9152.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9152.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9152.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9152.jpg" | tee -a "$LOG"
fi

# IMG_9153.jpg  takenAt=2024-07-16T10:39:49.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9153.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9153.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9153.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9153.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9153.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9153.jpg" | tee -a "$LOG"
fi

# IMG_9154.jpg  takenAt=2024-07-16T10:39:53.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9154.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9154.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9154.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9154.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9154.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9154.jpg" | tee -a "$LOG"
fi

# IMG_9156.jpg  takenAt=2024-07-16T10:40:15.000-07:00  dims=4758x3956
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9156.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9156.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9156.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9156.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9156.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9156.jpg" | tee -a "$LOG"
fi

# IMG_9157.jpg  takenAt=2024-07-16T10:54:33.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9157.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9157.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9157.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9157.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9157.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9157.jpg" | tee -a "$LOG"
fi

# IMG_9158.jpg  takenAt=2024-07-16T11:26:39.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9158.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9158.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9158.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9158.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9158.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9158.jpg" | tee -a "$LOG"
fi

# IMG_9160.jpg  takenAt=2024-07-16T11:35:14.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9160.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9160.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9160.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9160.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9160.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9160.jpg" | tee -a "$LOG"
fi

# IMG_9161.jpg  takenAt=2024-07-16T11:35:32.000-07:00  dims=6216x3924
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9161.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9161.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9161.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9161.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9161.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9161.jpg" | tee -a "$LOG"
fi

# IMG_9162.jpg  takenAt=2024-07-16T11:35:52.000-07:00  dims=9574x3864
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9162.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9162.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9162.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9162.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9162.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9162.jpg" | tee -a "$LOG"
fi

# IMG_9163.jpg  takenAt=2024-07-16T11:36:33.000-07:00  dims=3842x5286
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9163.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9163.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9163.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9163.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9163.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9163.jpg" | tee -a "$LOG"
fi

# IMG_9164.jpg  takenAt=2024-07-16T11:36:45.000-07:00  dims=3628x3442
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9164.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9164.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9164.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9164.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9164.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9164.jpg" | tee -a "$LOG"
fi

# IMG_9165.jpg  takenAt=2024-07-16T11:36:50.000-07:00  dims=3726x3748
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9165.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9165.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9165.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9165.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9165.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9165.jpg" | tee -a "$LOG"
fi

# IMG_9166.jpg  takenAt=2024-07-16T11:36:56.000-07:00  dims=4030x1680
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9166.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9166.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9166.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9166.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9166.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9166.jpg" | tee -a "$LOG"
fi

# IMG_9167.jpg  takenAt=2024-07-16T11:36:57.000-07:00  dims=3818x4600
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9167.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9167.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9167.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9167.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9167.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9167.jpg" | tee -a "$LOG"
fi

# IMG_9169.jpg  takenAt=2024-07-16T11:43:35.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9169.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9169.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9169.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9169.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9169.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9169.jpg" | tee -a "$LOG"
fi

# IMG_9172.jpg  takenAt=2024-07-16T11:44:34.000-07:00  dims=5202x3742
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9172.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9172.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9172.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9172.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9172.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9172.jpg" | tee -a "$LOG"
fi

# IMG_9173.jpg  takenAt=2024-07-16T11:45:00.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9173.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9173.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9173.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9173.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9173.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9173.jpg" | tee -a "$LOG"
fi

# IMG_9174.jpg  takenAt=2024-07-16T13:43:20.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9174.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9174.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9174.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9174.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9174.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9174.jpg" | tee -a "$LOG"
fi

# IMG_9175.jpg  takenAt=2024-07-16T13:43:40.000-07:00  dims=8198x3918
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9175.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9175.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9175.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9175.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9175.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9175.jpg" | tee -a "$LOG"
fi

# IMG_9177.jpg  takenAt=2024-07-16T13:49:28.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9177.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9177.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9177.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9177.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9177.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9177.jpg" | tee -a "$LOG"
fi

# IMG_9178.jpg  takenAt=2024-07-16T13:49:39.000-07:00  dims=8068x3850
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9178.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9178.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9178.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9178.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9178.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9178.jpg" | tee -a "$LOG"
fi

# IMG_9179.jpg  takenAt=2024-07-16T13:49:56.000-07:00  dims=3628x3924
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9179.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9179.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9179.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9179.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9179.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9179.jpg" | tee -a "$LOG"
fi

# IMG_9180.jpg  takenAt=2024-07-16T13:50:02.000-07:00  dims=3864x3778
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9180.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9180.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9180.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9180.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9180.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9180.jpg" | tee -a "$LOG"
fi

# IMG_9181.jpg  takenAt=2024-07-16T13:50:13.000-07:00  dims=3680x3790
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9181.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9181.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9181.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9181.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9181.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9181.jpg" | tee -a "$LOG"
fi

# IMG_9182.jpg  takenAt=2024-07-16T13:50:21.000-07:00  dims=4030x1680
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9182.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9182.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9182.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9182.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9182.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9182.jpg" | tee -a "$LOG"
fi

# IMG_9183.jpg  takenAt=2024-07-16T13:50:27.000-07:00  dims=3704x6470
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9183.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9183.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9183.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9183.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9183.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9183.jpg" | tee -a "$LOG"
fi

# IMG_9185.jpg  takenAt=2024-07-16T13:50:53.000-07:00  dims=3628x4386
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9185.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9185.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9185.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9185.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9185.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9185.jpg" | tee -a "$LOG"
fi

# IMG_9186.jpg  takenAt=2024-07-16T13:51:01.000-07:00  dims=4030x1680
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9186.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9186.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9186.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9186.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9186.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9186.jpg" | tee -a "$LOG"
fi

# IMG_9187.jpg  takenAt=2024-07-16T13:51:10.000-07:00  dims=3856x5686
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9187.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9187.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9187.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9187.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9187.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9187.jpg" | tee -a "$LOG"
fi

# IMG_9189.jpg  takenAt=2024-07-16T14:04:24.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9189.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9189.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9189.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9189.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9189.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9189.jpg" | tee -a "$LOG"
fi

# IMG_9191.jpg  takenAt=2024-07-16T14:04:59.000-07:00  dims=5662x3892
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9191.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9191.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9191.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9191.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9191.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9191.jpg" | tee -a "$LOG"
fi

# IMG_9192.jpg  takenAt=2024-07-16T14:10:01.000-07:00  dims=3878x5046
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9192.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9192.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9192.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9192.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9192.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9192.jpg" | tee -a "$LOG"
fi

# IMG_9193.jpg  takenAt=2024-07-16T14:10:18.000-07:00  dims=5004x3816
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9193.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9193.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9193.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9193.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9193.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9193.jpg" | tee -a "$LOG"
fi

# IMG_9194.jpg  takenAt=2024-07-16T14:10:35.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9194.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9194.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9194.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9194.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9194.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9194.jpg" | tee -a "$LOG"
fi

# IMG_9196.jpg  takenAt=2024-07-16T15:49:18.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9196.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9196.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9196.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9196.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9196.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9196.jpg" | tee -a "$LOG"
fi

# IMG_9197.jpg  takenAt=2024-07-16T15:49:25.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9197.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9197.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9197.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9197.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9197.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9197.jpg" | tee -a "$LOG"
fi

# IMG_9198.jpg  takenAt=2024-07-16T15:59:53.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9198.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9198.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9198.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9198.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9198.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9198.jpg" | tee -a "$LOG"
fi

# IMG_9199.jpg  takenAt=2024-07-16T16:00:15.000-07:00  dims=3790x7884
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9199.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9199.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9199.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9199.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9199.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9199.jpg" | tee -a "$LOG"
fi

# IMG_9200.jpg  takenAt=2024-07-16T16:00:33.000-07:00  dims=3040x4002
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9200.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9200.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9200.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9200.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9200.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9200.jpg" | tee -a "$LOG"
fi

# IMG_9201.jpg  takenAt=2024-07-16T16:00:44.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9201.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9201.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9201.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9201.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9201.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9201.jpg" | tee -a "$LOG"
fi

# IMG_9202.jpg  takenAt=2024-07-16T16:05:58.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9202.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9202.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9202.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9202.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9202.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9202.jpg" | tee -a "$LOG"
fi

# IMG_9203.jpg  takenAt=2024-07-16T16:06:08.000-07:00  dims=3750x7416
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9203.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9203.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9203.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9203.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9203.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9203.jpg" | tee -a "$LOG"
fi

# IMG_9204.jpg  takenAt=2024-07-16T16:06:43.000-07:00  dims=3880x6760
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9204.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9204.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9204.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9204.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9204.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9204.jpg" | tee -a "$LOG"
fi

# IMG_9205.jpg  takenAt=2024-07-16T16:07:08.000-07:00  dims=5178x3846
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9205.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9205.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9205.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9205.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9205.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9205.jpg" | tee -a "$LOG"
fi

# IMG_9207.jpg  takenAt=2024-07-16T17:15:16.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9207.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9207.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9207.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9207.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9207.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9207.jpg" | tee -a "$LOG"
fi

# IMG_9208.jpg  takenAt=2024-07-16T17:15:25.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9208.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9208.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9208.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9208.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9208.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9208.jpg" | tee -a "$LOG"
fi

# IMG_9209.jpg  takenAt=2024-07-16T17:15:30.000-07:00  dims=3922x3774
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9209.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9209.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9209.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9209.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9209.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9209.jpg" | tee -a "$LOG"
fi

# IMG_9210.jpg  takenAt=2024-07-16T17:15:38.000-07:00  dims=3796x6894
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9210.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9210.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9210.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9210.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9210.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9210.jpg" | tee -a "$LOG"
fi

# IMG_9211.jpg  takenAt=2024-07-16T17:16:07.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9211.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9211.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9211.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9211.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9211.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9211.jpg" | tee -a "$LOG"
fi

# IMG_9213.jpg  takenAt=2024-07-16T17:17:26.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9213.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9213.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9213.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9213.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9213.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9213.jpg" | tee -a "$LOG"
fi

# IMG_9214.jpg  takenAt=2024-07-16T17:18:46.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9214.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9214.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9214.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9214.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9214.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9214.jpg" | tee -a "$LOG"
fi

# IMG_9215.jpg  takenAt=2024-07-16T17:23:10.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9215.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9215.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9215.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9215.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9215.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9215.jpg" | tee -a "$LOG"
fi

# IMG_9216.jpg  takenAt=2024-07-16T17:23:18.000-07:00  dims=3822x7506
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9216.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9216.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9216.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9216.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9216.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9216.jpg" | tee -a "$LOG"
fi

# IMG_9217.jpg  takenAt=2024-07-16T17:28:35.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9217.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9217.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9217.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9217.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9217.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9217.jpg" | tee -a "$LOG"
fi

# IMG_9218.jpg  takenAt=2024-07-17T07:16:08.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9218.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9218.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9218.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9218.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9218.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9218.jpg" | tee -a "$LOG"
fi

# IMG_9219.jpg  takenAt=2024-07-17T07:16:12.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9219.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9219.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9219.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9219.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9219.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9219.jpg" | tee -a "$LOG"
fi

# IMG_9220.jpg  takenAt=2024-07-17T07:20:06.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9220.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9220.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9220.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9220.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9220.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9220.jpg" | tee -a "$LOG"
fi

# IMG_9221.jpg  takenAt=2024-07-17T07:20:08.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9221.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9221.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9221.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9221.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9221.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9221.jpg" | tee -a "$LOG"
fi

# IMG_9222.jpg  takenAt=2024-07-17T07:20:45.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9222.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9222.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9222.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9222.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9222.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9222.jpg" | tee -a "$LOG"
fi

# IMG_9223.jpg  takenAt=2024-07-17T07:21:50.000-07:00  dims=7154x3856
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9223.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9223.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9223.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9223.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9223.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9223.jpg" | tee -a "$LOG"
fi

# IMG_9224.jpg  takenAt=2024-07-17T07:22:07.000-07:00  dims=5530x3944
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9224.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9224.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9224.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9224.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9224.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9224.jpg" | tee -a "$LOG"
fi

# IMG_9225.jpg  takenAt=2024-07-17T07:23:01.000-07:00  dims=3746x6274
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9225.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9225.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9225.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9225.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9225.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9225.jpg" | tee -a "$LOG"
fi

# IMG_9226.jpg  takenAt=2024-07-17T07:23:20.000-07:00  dims=4030x1680
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9226.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9226.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9226.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9226.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9226.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9226.jpg" | tee -a "$LOG"
fi

# IMG_9227.jpg  takenAt=2024-07-17T07:23:22.000-07:00  dims=3760x6720
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9227.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9227.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9227.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9227.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9227.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9227.jpg" | tee -a "$LOG"
fi

# IMG_9228.jpg  takenAt=2024-07-17T07:24:11.000-07:00  dims=3830x7628
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9228.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9228.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9228.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9228.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9228.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9228.jpg" | tee -a "$LOG"
fi

# IMG_9229.jpg  takenAt=2024-07-17T07:24:45.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9229.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9229.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9229.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9229.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9229.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9229.jpg" | tee -a "$LOG"
fi

# IMG_9230.jpg  takenAt=2024-07-17T07:41:29.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9230.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9230.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9230.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9230.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9230.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9230.jpg" | tee -a "$LOG"
fi

# IMG_9231.jpg  takenAt=2024-07-17T07:41:32.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9231.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9231.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9231.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9231.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9231.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9231.jpg" | tee -a "$LOG"
fi

# IMG_9232.jpg  takenAt=2024-07-17T07:42:29.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9232.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9232.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9232.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9232.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9232.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9232.jpg" | tee -a "$LOG"
fi

# IMG_9233.jpg  takenAt=2024-07-17T07:42:33.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9233.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9233.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9233.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9233.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9233.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9233.jpg" | tee -a "$LOG"
fi

# IMG_9234.jpg  takenAt=2024-07-17T07:43:55.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9234.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9234.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9234.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9234.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9234.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9234.jpg" | tee -a "$LOG"
fi

# IMG_9235.jpg  takenAt=2024-07-17T07:44:27.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9235.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9235.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9235.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9235.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9235.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9235.jpg" | tee -a "$LOG"
fi

# IMG_9238.jpg  takenAt=2024-07-17T07:46:44.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9238.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9238.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9238.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9238.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9238.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9238.jpg" | tee -a "$LOG"
fi

# IMG_9239.jpg  takenAt=2024-07-17T07:47:34.000-07:00  dims=3872x6260
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9239.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9239.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9239.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9239.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9239.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9239.jpg" | tee -a "$LOG"
fi

# IMG_9240.jpg  takenAt=2024-07-17T07:48:20.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9240.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9240.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9240.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9240.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9240.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9240.jpg" | tee -a "$LOG"
fi

# IMG_9241.jpg  takenAt=2024-07-17T07:48:30.000-07:00  dims=3884x5784
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9241.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9241.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9241.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9241.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9241.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9241.jpg" | tee -a "$LOG"
fi

# IMG_9242.jpg  takenAt=2024-07-17T07:58:45.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9242.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9242.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9242.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9242.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9242.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9242.jpg" | tee -a "$LOG"
fi

# IMG_9243.jpg  takenAt=2024-07-17T08:16:23.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9243.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9243.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9243.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9243.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9243.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9243.jpg" | tee -a "$LOG"
fi

# IMG_9244.jpg  takenAt=2024-07-17T08:16:27.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9244.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9244.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9244.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9244.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9244.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9244.jpg" | tee -a "$LOG"
fi

# IMG_9245.jpg  takenAt=2024-07-17T08:20:27.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9245.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9245.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9245.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9245.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9245.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9245.jpg" | tee -a "$LOG"
fi

# IMG_9246.jpg  takenAt=2024-07-17T08:20:33.000-07:00  dims=3804x5798
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9246.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9246.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9246.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9246.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9246.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9246.jpg" | tee -a "$LOG"
fi

# IMG_9247.jpg  takenAt=2024-07-17T08:24:16.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9247.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9247.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9247.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9247.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9247.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9247.jpg" | tee -a "$LOG"
fi

# IMG_9248.jpg  takenAt=2024-07-17T08:26:42.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9248.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9248.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9248.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9248.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9248.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9248.jpg" | tee -a "$LOG"
fi

# IMG_9249.jpg  takenAt=2024-07-17T08:26:46.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9249.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9249.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9249.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9249.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9249.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9249.jpg" | tee -a "$LOG"
fi

# IMG_9250.jpg  takenAt=2024-07-17T08:29:31.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9250.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9250.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9250.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9250.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9250.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9250.jpg" | tee -a "$LOG"
fi

# IMG_9253.jpg  takenAt=2024-07-17T08:31:59.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9253.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9253.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9253.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9253.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9253.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9253.jpg" | tee -a "$LOG"
fi

# IMG_9255.jpg  takenAt=2024-07-17T08:35:44.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9255.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9255.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9255.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9255.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9255.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9255.jpg" | tee -a "$LOG"
fi

# IMG_9256.jpg  takenAt=2024-07-17T08:35:47.000-07:00  dims=3628x7524
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9256.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9256.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9256.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9256.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9256.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9256.jpg" | tee -a "$LOG"
fi

# IMG_9257.jpg  takenAt=2024-07-17T08:36:23.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9257.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9257.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9257.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9257.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9257.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9257.jpg" | tee -a "$LOG"
fi

# IMG_9258.jpg  takenAt=2024-07-17T08:38:05.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9258.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9258.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9258.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9258.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9258.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9258.jpg" | tee -a "$LOG"
fi

# IMG_9259.jpg  takenAt=2024-07-17T08:52:50.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9259.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9259.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9259.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9259.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9259.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9259.jpg" | tee -a "$LOG"
fi

# IMG_9261.jpg  takenAt=2024-07-17T09:03:19.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9261.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9261.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9261.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9261.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9261.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9261.jpg" | tee -a "$LOG"
fi

# IMG_9262.jpg  takenAt=2024-07-17T09:14:14.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9262.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9262.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9262.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9262.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9262.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9262.jpg" | tee -a "$LOG"
fi

# IMG_9264.jpg  takenAt=2024-07-17T09:15:21.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9264.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9264.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9264.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9264.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9264.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9264.jpg" | tee -a "$LOG"
fi

# IMG_9265.jpg  takenAt=2024-07-17T09:15:59.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9265.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9265.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9265.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9265.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9265.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9265.jpg" | tee -a "$LOG"
fi

# IMG_9267.jpg  takenAt=2024-07-17T09:16:55.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9267.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9267.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9267.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9267.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9267.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9267.jpg" | tee -a "$LOG"
fi

# IMG_9268.jpg  takenAt=2024-07-17T09:31:17.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9268.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9268.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9268.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9268.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9268.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9268.jpg" | tee -a "$LOG"
fi

# IMG_9269.jpg  takenAt=2024-07-17T09:32:52.000-07:00  dims=8554x3814
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9269.jpg" ]; then
  mkdir -p "$QUAR_ROOT/PNW Waterfalls 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9269.jpg -> $QUAR_ROOT/PNW Waterfalls 2024/IMG_9269.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9269.jpg" "$QUAR_ROOT/PNW Waterfalls 2024/IMG_9269.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/PNW Waterfalls 2024/IMG_9269.jpg" | tee -a "$LOG"
fi

# IMG_9301.jpg  takenAt=2024-08-19T15:53:15.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9301.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9301.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9301.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9301.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9301.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9301.jpg" | tee -a "$LOG"
fi

# IMG_9302.jpg  takenAt=2024-08-19T15:53:18.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9302.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9302.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9302.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9302.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9302.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9302.jpg" | tee -a "$LOG"
fi

# IMG_9303.jpg  takenAt=2024-08-19T15:53:18.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9303.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9303.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9303.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9303.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9303.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9303.jpg" | tee -a "$LOG"
fi

# IMG_9304.jpg  takenAt=2024-08-19T16:20:30.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9304.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9304.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9304.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9304.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9304.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9304.jpg" | tee -a "$LOG"
fi

# IMG_9305.jpg  takenAt=2024-08-19T16:23:43.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9305.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9305.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9305.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9305.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9305.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9305.jpg" | tee -a "$LOG"
fi

# IMG_9306.jpg  takenAt=2024-08-19T16:23:49.000-07:00  dims=3746x8162
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9306.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9306.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9306.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9306.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9306.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9306.jpg" | tee -a "$LOG"
fi

# IMG_9307.jpg  takenAt=2024-08-19T17:40:05.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9307.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9307.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9307.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9307.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9307.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9307.jpg" | tee -a "$LOG"
fi

# IMG_9308.jpg  takenAt=2024-08-20T05:27:51.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9308.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9308.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9308.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9308.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9308.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9308.jpg" | tee -a "$LOG"
fi

# IMG_9309.jpg  takenAt=2024-08-20T05:28:03.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9309.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9309.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9309.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9309.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9309.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9309.jpg" | tee -a "$LOG"
fi

# IMG_9310.jpg  takenAt=2024-08-20T06:02:36.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9310.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9310.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9310.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9310.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9310.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9310.jpg" | tee -a "$LOG"
fi

# IMG_9311.jpg  takenAt=2024-08-20T06:02:47.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9311.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9311.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9311.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9311.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9311.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9311.jpg" | tee -a "$LOG"
fi

# IMG_9312.jpg  takenAt=2024-08-20T06:42:00.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9312.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9312.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9312.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9312.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9312.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9312.jpg" | tee -a "$LOG"
fi

# IMG_9313.jpg  takenAt=2024-08-20T06:55:23.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9313.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9313.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9313.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9313.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9313.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9313.jpg" | tee -a "$LOG"
fi

# IMG_9314.jpg  takenAt=2024-08-20T06:55:34.000-07:00  dims=7040x3918
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9314.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9314.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9314.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9314.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9314.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9314.jpg" | tee -a "$LOG"
fi

# IMG_9315.jpg  takenAt=2024-08-20T06:56:06.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9315.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9315.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9315.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9315.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9315.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9315.jpg" | tee -a "$LOG"
fi

# IMG_9316.jpg  takenAt=2024-08-20T07:01:22.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9316.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9316.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9316.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9316.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9316.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9316.jpg" | tee -a "$LOG"
fi

# IMG_9317.jpg  takenAt=2024-08-20T07:01:27.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9317.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9317.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9317.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9317.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9317.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9317.jpg" | tee -a "$LOG"
fi

# IMG_9318.jpg  takenAt=2024-08-20T07:02:14.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9318.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9318.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9318.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9318.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9318.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9318.jpg" | tee -a "$LOG"
fi

# IMG_9319.jpg  takenAt=2024-08-20T12:27:29.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9319.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9319.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9319.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9319.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9319.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9319.jpg" | tee -a "$LOG"
fi

# IMG_9320.jpg  takenAt=2024-08-20T12:27:36.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9320.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9320.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9320.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9320.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9320.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9320.jpg" | tee -a "$LOG"
fi

# IMG_9321.jpg  takenAt=2024-08-20T12:27:45.000-07:00  dims=3866x4802
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9321.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9321.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9321.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9321.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9321.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9321.jpg" | tee -a "$LOG"
fi

# IMG_9322.jpg  takenAt=2024-08-20T12:28:16.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9322.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9322.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9322.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9322.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9322.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9322.jpg" | tee -a "$LOG"
fi

# IMG_9323.jpg  takenAt=2024-08-20T12:28:17.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9323.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9323.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9323.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9323.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9323.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9323.jpg" | tee -a "$LOG"
fi

# IMG_9324.jpg  takenAt=2024-08-20T12:28:18.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9324.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9324.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9324.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9324.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9324.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9324.jpg" | tee -a "$LOG"
fi

# IMG_9327.jpg  takenAt=2024-08-21T10:16:44.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9327.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9327.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9327.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9327.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9327.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9327.jpg" | tee -a "$LOG"
fi

# IMG_9328.jpg  takenAt=2024-08-21T10:17:20.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9328.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9328.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9328.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9328.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9328.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9328.jpg" | tee -a "$LOG"
fi

# IMG_9329.jpg  takenAt=2024-08-21T10:17:33.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9329.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9329.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9329.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9329.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9329.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9329.jpg" | tee -a "$LOG"
fi

# IMG_9330.jpg  takenAt=2024-08-21T10:20:15.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9330.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9330.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9330.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9330.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9330.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9330.jpg" | tee -a "$LOG"
fi

# IMG_9331.jpg  takenAt=2024-08-21T10:21:13.000-07:00  dims=10196x3762
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9331.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9331.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9331.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9331.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9331.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9331.jpg" | tee -a "$LOG"
fi

# IMG_9332.jpg  takenAt=2024-08-21T10:22:11.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9332.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9332.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9332.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9332.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9332.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9332.jpg" | tee -a "$LOG"
fi

# IMG_9334.jpg  takenAt=2024-08-21T10:22:51.000-07:00  dims=3892x5798
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9334.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9334.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9334.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9334.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9334.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9334.jpg" | tee -a "$LOG"
fi

# IMG_9336.jpg  takenAt=2024-08-21T10:26:04.000-07:00  dims=3874x6590
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9336.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9336.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9336.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9336.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9336.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9336.jpg" | tee -a "$LOG"
fi

# IMG_9337.jpg  takenAt=2024-08-21T10:27:43.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9337.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9337.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9337.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9337.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9337.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9337.jpg" | tee -a "$LOG"
fi

# IMG_9338.jpg  takenAt=2024-08-21T10:27:45.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9338.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9338.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9338.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9338.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9338.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9338.jpg" | tee -a "$LOG"
fi

# IMG_9339.jpg  takenAt=2024-08-21T13:35:59.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9339.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9339.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9339.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9339.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9339.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9339.jpg" | tee -a "$LOG"
fi

# IMG_9340.jpg  takenAt=2024-08-21T13:36:05.000-07:00  dims=3900x6080
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9340.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9340.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9340.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9340.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9340.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9340.jpg" | tee -a "$LOG"
fi

# IMG_9341.jpg  takenAt=2024-08-21T13:43:53.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9341.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9341.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9341.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9341.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9341.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9341.jpg" | tee -a "$LOG"
fi

# IMG_9343.jpg  takenAt=2024-08-21T13:44:18.000-07:00  dims=3828x6436
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9343.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9343.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9343.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9343.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9343.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9343.jpg" | tee -a "$LOG"
fi

# IMG_9344.jpg  takenAt=2024-08-21T13:45:08.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9344.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9344.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9344.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9344.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9344.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9344.jpg" | tee -a "$LOG"
fi

# IMG_9345.jpg  takenAt=2024-08-21T13:45:14.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9345.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9345.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9345.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9345.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9345.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9345.jpg" | tee -a "$LOG"
fi

# IMG_9346.jpg  takenAt=2024-08-21T13:46:33.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9346.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9346.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9346.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9346.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9346.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9346.jpg" | tee -a "$LOG"
fi

# IMG_9347.jpg  takenAt=2024-08-21T13:46:49.000-07:00  dims=3922x4628
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9347.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9347.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9347.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9347.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9347.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9347.jpg" | tee -a "$LOG"
fi

# IMG_9348.jpg  takenAt=2024-08-21T13:47:20.000-07:00  dims=6910x3906
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9348.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9348.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9348.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9348.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9348.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9348.jpg" | tee -a "$LOG"
fi

# IMG_9349.jpg  takenAt=2024-08-21T19:50:00.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9349.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9349.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9349.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9349.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9349.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9349.jpg" | tee -a "$LOG"
fi

# IMG_9350.jpg  takenAt=2024-08-21T19:50:04.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9350.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Arcata 2024"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9350.jpg -> $QUAR_ROOT/Arcata 2024/IMG_9350.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9350.jpg" "$QUAR_ROOT/Arcata 2024/IMG_9350.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Arcata 2024/IMG_9350.jpg" | tee -a "$LOG"
fi

# IMG_9690.jpg  takenAt=2025-01-19T14:33:22.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9690.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Baja 2025/Shaffer Media"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9690.jpg -> $QUAR_ROOT/Baja 2025/Shaffer Media/IMG_9690.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9690.jpg" "$QUAR_ROOT/Baja 2025/Shaffer Media/IMG_9690.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9690.jpg" | tee -a "$LOG"
fi

# IMG_9692.jpg  takenAt=2025-01-19T20:06:59.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9692.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Baja 2025/Shaffer Media"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9692.jpg -> $QUAR_ROOT/Baja 2025/Shaffer Media/IMG_9692.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9692.jpg" "$QUAR_ROOT/Baja 2025/Shaffer Media/IMG_9692.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9692.jpg" | tee -a "$LOG"
fi

# IMG_9693.jpg  takenAt=2025-01-20T09:03:23.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9693.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Baja 2025/Shaffer Media"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9693.jpg -> $QUAR_ROOT/Baja 2025/Shaffer Media/IMG_9693.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9693.jpg" "$QUAR_ROOT/Baja 2025/Shaffer Media/IMG_9693.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9693.jpg" | tee -a "$LOG"
fi

# IMG_9945.jpg  takenAt=2025-01-30T07:03:43.000-07:00  dims=4032x3024
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9945.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Baja 2025/Shaffer Media"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9945.jpg -> $QUAR_ROOT/Baja 2025/Shaffer Media/IMG_9945.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9945.jpg" "$QUAR_ROOT/Baja 2025/Shaffer Media/IMG_9945.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9945.jpg" | tee -a "$LOG"
fi

# IMG_9947.jpg  takenAt=2025-01-30T09:15:52.000-07:00  dims=3024x4032
if [ -f "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9947.jpg" ]; then
  mkdir -p "$QUAR_ROOT/Baja 2025/Shaffer Media"
  echo "MOVE: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9947.jpg -> $QUAR_ROOT/Baja 2025/Shaffer Media/IMG_9947.jpg" | tee -a "$LOG"
  mv -n "/Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9947.jpg" "$QUAR_ROOT/Baja 2025/Shaffer Media/IMG_9947.jpg"
else
  echo "MISSING: /Volumes/ShMedia/Shafferography/ShafferographyMedia/Baja 2025/Shaffer Media/IMG_9947.jpg" | tee -a "$LOG"
fi
