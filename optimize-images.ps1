# Image Optimization Script for Zenetra Tech
# This script creates optimized versions of all images without modifying the originals
# to ensure backwards compatibility

Write-Host "Starting image optimization..." -ForegroundColor Cyan

# Create directory structure for optimized images if it doesn't exist
if (-not (Test-Path "src/assets/images/optimized")) {
    Write-Host "Creating optimized image directory structure..." -ForegroundColor Yellow
    New-Item -Path "src/assets/images/optimized" -ItemType Directory -Force | Out-Null
    New-Item -Path "src/assets/images/optimized/320x240" -ItemType Directory -Force | Out-Null
    New-Item -Path "src/assets/images/optimized/640x480" -ItemType Directory -Force | Out-Null
    New-Item -Path "src/assets/images/optimized/1200x900" -ItemType Directory -Force | Out-Null
    New-Item -Path "src/assets/images/optimized/webp" -ItemType Directory -Force | Out-Null
}

# Check if ImageMagick is installed
try {
    $magickVersion = magick -version
    Write-Host "ImageMagick found: $($magickVersion[0])" -ForegroundColor Green
} catch {
    Write-Host "ImageMagick not found. Please install ImageMagick to use this script." -ForegroundColor Red
    Write-Host "You can download it from: https://imagemagick.org/script/download.php" -ForegroundColor Red
    exit 1
}

# Process all JPG images
$imageCount = 0
$largeSizeWarning = 0
$largeImagesList = @()

Write-Host "Processing JPG images..." -ForegroundColor Cyan

Get-ChildItem -Path "src/assets/images" -Filter "*.jpg" -Recurse | ForEach-Object {
    $imagePath = $_.FullName
    $imageName = $_.BaseName
    $imageSize = [math]::Round(($_.Length / 1MB), 2)
    
    # Check if this is a large image
    if ($_.Length -gt 5MB) {
        $largeSizeWarning++
        $largeImagesList += "$($_.Name) ($imageSize MB)"
    }
    
    Write-Host "Processing: $($_.Name) - $imageSize MB" -ForegroundColor Yellow
    
    # Create WebP version (with 80% quality for better compression)
    $outputWebP = "src/assets/images/optimized/webp/$imageName.webp"
    magick "$imagePath" -quality 80 "$outputWebP"
    
    # Create resized JPG versions
    $output1200 = "src/assets/images/optimized/1200x900/$imageName.jpg"
    $output640 = "src/assets/images/optimized/640x480/$imageName.jpg"
    $output320 = "src/assets/images/optimized/320x240/$imageName.jpg"
    
    # Use -resize to maintain aspect ratio while limiting to the specified dimensions
    magick "$imagePath" -quality 80 -resize "1200x900>" "$output1200"
    magick "$imagePath" -quality 80 -resize "640x480>" "$output640"
    magick "$imagePath" -quality 80 -resize "320x240>" "$output320"
    
    # Also create WebP versions of the resized images
    magick "$output1200" -quality 80 "src/assets/images/optimized/1200x900/$imageName.webp"
    magick "$output640" -quality 80 "src/assets/images/optimized/640x480/$imageName.webp"
    magick "$output320" -quality 80 "src/assets/images/optimized/320x240/$imageName.webp"
    
    $imageCount++
}

# Process all PNG images
Write-Host "Processing PNG images..." -ForegroundColor Cyan

Get-ChildItem -Path "src/assets/images" -Filter "*.png" -Recurse | ForEach-Object {
    $imagePath = $_.FullName
    $imageName = $_.BaseName
    $imageSize = [math]::Round(($_.Length / 1MB), 2)
    
    # Check if this is a large image
    if ($_.Length -gt 1MB) {
        $largeSizeWarning++
        $largeImagesList += "$($_.Name) ($imageSize MB)"
    }
    
    Write-Host "Processing: $($_.Name) - $imageSize MB" -ForegroundColor Yellow
    
    # Create WebP version 
    $outputWebP = "src/assets/images/optimized/webp/$imageName.webp"
    magick "$imagePath" -quality 80 "$outputWebP"
    
    # Create resized PNG versions with optimization
    $output1200 = "src/assets/images/optimized/1200x900/$imageName.png"
    $output640 = "src/assets/images/optimized/640x480/$imageName.png"
    $output320 = "src/assets/images/optimized/320x240/$imageName.png"
    
    magick "$imagePath" -resize "1200x900>" -quality 80 "$output1200"
    magick "$imagePath" -resize "640x480>" -quality 80 "$output640"
    magick "$imagePath" -resize "320x240>" -quality 80 "$output320"
    
    # Also create WebP versions of the resized images
    magick "$output1200" -quality 80 "src/assets/images/optimized/1200x900/$imageName.webp"
    magick "$output640" -quality 80 "src/assets/images/optimized/640x480/$imageName.webp"
    magick "$output320" -quality 80 "src/assets/images/optimized/320x240/$imageName.webp"
    
    $imageCount++
}

# Create placeholder images if not exist
if (-not (Test-Path "src/assets/images/placeholders")) {
    Write-Host "Creating placeholder directory..." -ForegroundColor Yellow
    New-Item -Path "src/assets/images/placeholders" -ItemType Directory -Force | Out-Null
    
    # Create a simple SVG placeholder
    $placeholderSvg = @"
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#001a12"/>
  <path d="M160,125 L240,125 L240,175 L160,175 Z" fill="#013024"/>
  <path d="M200,100 Q215,115 200,130 Q185,115 200,100" fill="#2AF598"/>
  <rect x="185" y="140" width="30" height="20" fill="#2AF598"/>
</svg>
"@
    
    Set-Content -Path "src/assets/images/placeholders/placeholder.svg" -Value $placeholderSvg
    Write-Host "Created placeholder SVG" -ForegroundColor Green
}

# Summary
Write-Host "`nOptimization Complete!" -ForegroundColor Green
Write-Host "Processed $imageCount images" -ForegroundColor Cyan

if ($largeSizeWarning -gt 0) {
    Write-Host "`nWARNING: Found $largeSizeWarning large images that should be manually optimized:" -ForegroundColor Red
    $largeImagesList | ForEach-Object {
        Write-Host "  - $_" -ForegroundColor Yellow
    }
    
    Write-Host "`nConsider using an online tool like TinyPNG.com to compress these large images before adding them to the assets folder." -ForegroundColor Yellow
}

Write-Host "`nTo use optimized images in your code, modify the ImageOptimizationService.ts to return the optimized versions." -ForegroundColor Cyan
Write-Host "Example: return url.replace('/assets/images/', '/assets/images/optimized/webp/').replace('.jpg', '.webp');" -ForegroundColor Cyan
