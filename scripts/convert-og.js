const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const svgPath = path.join(__dirname, '..', 'public', 'og-image.svg');
  const pngPath = path.join(__dirname, '..', 'public', 'og-image.png');
  const svgBuffer = fs.readFileSync(svgPath);
  
  await sharp(svgBuffer)
    .resize(1200, 630)
    .png({ quality: 90 })
    .toFile(pngPath);
    
  console.log('Successfully created og-image.png, size:', fs.statSync(pngPath).size);
}

main().catch(err => {
  console.error('Error generating image:', err);
  process.exit(1);
});
