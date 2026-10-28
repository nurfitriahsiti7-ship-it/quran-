import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function main() {
  const imagePath = path.resolve('public/assets/aistudio/Medali_Bundar_Kaligrafi_Al-Qur_an_425f345a.png');
  if (!fs.existsSync(imagePath)) {
    console.error('Image not found at', imagePath);
    process.exit(1);
  }

  const image = sharp(imagePath);
  const metadata = await image.metadata();
  console.log(`Image size: ${metadata.width}x${metadata.height}`);

  // Generate PWA icons
  // 1. 192x192
  await image.clone().resize(192, 192, { fit: 'contain', background: { r: 253, g: 251, b: 247, alpha: 1 } })
    .toFile('public/pwa-192x192.png');
  console.log('Generated public/pwa-192x192.png');

  // 2. 512x512
  await image.clone().resize(512, 512, { fit: 'contain', background: { r: 253, g: 251, b: 247, alpha: 1 } })
    .toFile('public/pwa-512x512.png');
  console.log('Generated public/pwa-512x512.png');

  // 3. Apple Touch Icon 180x180
  await image.clone().resize(180, 180, { fit: 'contain', background: { r: 253, g: 251, b: 247, alpha: 1 } })
    .toFile('public/apple-touch-icon.png');
  console.log('Generated public/apple-touch-icon.png');

  // 4. Maskable 512x512 (with 15% safe-zone margin)
  // Inner image resized to 410x410 and centered on 512x512 canvas with background #FDFBF7
  const innerResized = await image.clone().resize(410, 410, { fit: 'contain', background: { r: 253, g: 251, b: 247, alpha: 0 } }).toBuffer();
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 253, g: 251, b: 247, alpha: 1 }
    }
  })
  .composite([{ input: innerResized, gravity: 'center' }])
  .toFile('public/pwa-maskable-512x512.png');
  console.log('Generated public/pwa-maskable-512x512.png');

  // 5. Favicon 64x64
  await image.clone().resize(64, 64, { fit: 'contain', background: { r: 253, g: 251, b: 247, alpha: 0 } })
    .toFile('public/favicon.png');
  console.log('Generated public/favicon.png');

  // Pixel sampling analysis
  const rawData = await image.clone().resize(100, 100).raw().toBuffer();
  // We can sample specific regions of interest on 100x100 grid:
  // Center is (50, 50) -> Center pink medallion background
  // (50, 20) -> Upper floral petals
  // (20, 50) -> Left gold rim & floral
  // (50, 7) -> Outer border
  const getPixel = (x, y) => {
    const idx = (y * 100 + x) * (metadata.channels || 4);
    return {
      r: rawData[idx],
      g: rawData[idx + 1],
      b: rawData[idx + 2],
      hex: '#' + [rawData[idx], rawData[idx + 1], rawData[idx + 2]].map(v => v.toString(16).padStart(2, '0')).join('')
    };
  };

  console.log('Sampled Center Pink (50, 36):', getPixel(50, 36));
  console.log('Sampled Floral Pink (50, 16):', getPixel(50, 16));
  console.log('Sampled Gold Border (50, 6):', getPixel(50, 6));
  console.log('Sampled Inner Ring Ivory (50, 24):', getPixel(50, 24));
}

main().catch(console.error);
