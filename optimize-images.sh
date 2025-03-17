#!/bin/bash

# Create optimized directories if they don't exist
mkdir -p assets/media/images/optimized
mkdir -p assets/media/images/optimized/thumbnails
mkdir -p assets/media/images/optimized/full

# Function to optimize an image
optimize_image() {
    input=$1
    filename=$(basename "$input")
    name="${filename%.*}"
    
    # Create optimized versions
    # Thumbnail (300px width)
    convert "$input" -strip -quality 85 -resize 300x -sampling-factor 4:2:0 "assets/media/images/optimized/thumbnails/${name}.jpg"
    convert "$input" -strip -quality 85 -resize 300x "assets/media/images/optimized/thumbnails/${name}.webp"
    
    # Full size (1200px width max)
    convert "$input" -strip -quality 85 -resize 1200x -sampling-factor 4:2:0 "assets/media/images/optimized/full/${name}.jpg"
    convert "$input" -strip -quality 85 -resize 1200x "assets/media/images/optimized/full/${name}.webp"
}

# Process all images in the images directory
for img in assets/media/images/*.{jpg,JPG,png,PNG}; do
    if [ -f "$img" ]; then
        echo "Optimizing $img..."
        optimize_image "$img"
    fi
done

# Process icons
mkdir -p assets/media/icons/optimized
for icon in assets/media/icons/*.{jpg,JPG,png,PNG,svg}; do
    if [ -f "$icon" ]; then
        filename=$(basename "$icon")
        name="${filename%.*}"
        echo "Optimizing icon $icon..."
        convert "$icon" -strip -quality 85 -resize 48x48 "assets/media/icons/optimized/${name}.png"
        convert "$icon" -strip -quality 85 -resize 48x48 "assets/media/icons/optimized/${name}.webp"
    fi
done

echo "Image optimization complete!" 