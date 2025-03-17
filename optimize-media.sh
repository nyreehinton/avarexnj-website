#!/bin/bash

# Create optimized directories
mkdir -p assets/media/audio/optimized
mkdir -p "assets/media/original_backup/$(date +%Y%m%d)"

# Function to optimize an audio file
optimize_audio() {
    local input="$1"
    local filename=$(basename "$input")
    local name="${filename%.*}"
    local filesize=$(stat -f %z "$input")
    local size_mb=$((filesize / 1000000))

    echo "Processing ${filename} (${size_mb}MB)"

    # Create optimized version (128kbps MP3)
    ffmpeg -i "$input" \
        -codec:a libmp3lame \
        -b:a 128k \
        -ar 44100 \
        -ac 2 \
        -y \
        "assets/media/audio/optimized/${name}.mp3"

    # Move original to backup
    mv "$input" "assets/media/original_backup/$(date +%Y%m%d)/"
    echo "Moved original file ${filename} to backup (${size_mb}MB)"
}

echo "Starting audio optimization process..."
echo "Original files will be backed up to assets/media/original_backup/$(date +%Y%m%d)/"

# Process all audio files
for audio in assets/media/audio/*.mp3; do
    if [ -f "$audio" ]; then
        optimize_audio "$audio"
    fi
done

# Calculate and display size difference
original_size=$(du -sh assets/media/original_backup/$(date +%Y%m%d) 2>/dev/null | cut -f1)
optimized_size=$(du -sh assets/media/audio/optimized 2>/dev/null | cut -f1)

echo -e "\nOptimization complete! Summary:"
echo "----------------------------------------"
echo "Original files size:  ${original_size:-0} (backed up)"
echo "Optimized files size: ${optimized_size:-0}"
echo "----------------------------------------" 