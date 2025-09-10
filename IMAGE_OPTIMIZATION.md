# Image Optimization Guide

To ensure optimal image loading performance, please follow these steps to create optimized image versions:

1. Install an image conversion tool like ImageMagick or Sharp
2. For each image in the assets/images directory, create WebP versions with the following commands:

```bash
# For ImageMagick
for file in src/assets/images/**/*.jpg; do
  # Create WebP version
  magick "$file" -quality 80 "${file%.*}.webp"
  
  # Create a resized version for thumbnails
  magick "$file" -resize 320x240 -quality 80 "${file%.*}_thumb.webp"
  
  # Create different sized versions
  magick "$file" -resize 320x240 -quality 80 "src/assets/images/optimized/320x240/$(basename ${file%.*}).webp"
  magick "$file" -resize 640x480 -quality 80 "src/assets/images/optimized/640x480/$(basename ${file%.*}).webp"
  magick "$file" -resize 1200x900 -quality 80 "src/assets/images/optimized/1200x900/$(basename ${file%.*}).webp"
done
```

This will:
1. Convert all JPG images to WebP format (which typically provides 25-35% smaller file sizes)
2. Create thumbnail versions
3. Create different sized versions for responsive image loading

For most efficient loading:
- Above-the-fold images should use the `[priority]="true"` attribute
- Set width and height attributes on all images to prevent layout shifts
- Use `appLazyImage` directive for all images

## Image Guidelines

- Hero images: 1200x900px
- Course thumbnails: 320x320px
- Gallery images: 640x480px
- Testimonial avatars: 120x120px
