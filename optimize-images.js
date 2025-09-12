const fs = require('fs');
const path = require('path');

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function checkImageSizes() {
  const inputDir = 'src/assets/images';

  // Images to check
  const imagesToCheck = [
    'java-development.jpg',
    'about-bg.jpg',
    'workshop.jpg'
  ];

  console.log('Current image sizes:');
  console.log('===================');

  for (const imageName of imagesToCheck) {
    const inputPath = path.join(inputDir, imageName);

    if (fs.existsSync(inputPath)) {
      const size = getFileSize(inputPath);
      console.log(`${imageName}: ${formatBytes(size)}`);
    } else {
      console.log(`${imageName}: File not found`);
    }
  }

  console.log('\nNote: These images are very large and need optimization.');
  console.log('Recommendation: Use an online image compressor or tools like:');
  console.log('- TinyPNG (https://tinypng.com/)');
  console.log('- ImageOptim (https://imageoptim.com/)');
  console.log('- Squoosh (https://squoosh.app/)');
  console.log('\nTarget size: Under 500KB per image');
}

checkImageSizes();
