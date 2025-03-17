#!/bin/bash

# Create optimized directories
mkdir -p assets/media/images/optimized/{thumbnails,full}
mkdir -p assets/media/icons/optimized
mkdir -p "assets/media/original_backup/$(date +%Y%m%d)"

# Function to optimize an image
optimize_image() {
    local input="$1"
    local filename=$(basename "$input")
    local name="${filename%.*}"
    local filesize=$(stat -f %z "$input")
    local size_mb=$((filesize / 1000000))

    echo "Processing ${filename} (${size_mb}MB)"

    # Create optimized versions
    magick "$input" -strip -quality 85 -resize "1200x>" \
        "assets/media/images/optimized/full/${name}.jpg"
    magick "$input" -strip -quality 85 -resize "300x>" \
        "assets/media/images/optimized/thumbnails/${name}.jpg"
    magick "$input" -strip -quality 85 -resize "1200x>" \
        "assets/media/images/optimized/full/${name}.webp"
    magick "$input" -strip -quality 85 -resize "300x>" \
        "assets/media/images/optimized/thumbnails/${name}.webp"

    # Move large files to backup
    if [ $size_mb -gt 1 ]; then
        mv "$input" "assets/media/original_backup/$(date +%Y%m%d)/"
        echo "Moved large file ${filename} to backup (${size_mb}MB)"
    fi
}

# Function to optimize an icon
optimize_icon() {
    local input="$1"
    local filename=$(basename "$input")
    local name="${filename%.*}"

    echo "Optimizing icon ${input}..."
    
    magick "$input" -strip -quality 95 -resize "48x48>" \
        "assets/media/icons/optimized/${name}.png"
    magick "$input" -strip -quality 95 -resize "48x48>" \
        "assets/media/icons/optimized/${name}.webp"
}

echo "Starting optimization process..."
echo "Original files will be backed up to assets/media/original_backup/$(date +%Y%m%d)/"

# Process all images in the images directory
for img in assets/media/images/*.{jpg,JPG,jpeg,JPEG,png,PNG}; do
    if [ -f "$img" ]; then
        optimize_image "$img"
    fi
done

# Process all icons in the icons directory
for icon in assets/media/icons/*.{jpg,JPG,jpeg,JPEG,png,PNG}; do
    if [ -f "$icon" ]; then
        optimize_icon "$icon"
    fi
done

# Calculate and display size difference
original_size=$(du -sh assets/media/original_backup/$(date +%Y%m%d) 2>/dev/null | cut -f1)
optimized_size=$(du -sh assets/media/images/optimized 2>/dev/null | cut -f1)

echo -e "\nOptimization complete! Summary:"
echo "----------------------------------------"
echo "Original files size:  ${original_size:-0} (backed up)"
echo "Optimized files size: ${optimized_size:-0}"
echo "----------------------------------------" 