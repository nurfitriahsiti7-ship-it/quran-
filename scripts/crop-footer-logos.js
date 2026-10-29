import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function cropLogos() {
  const dir = path.resolve('public/assets/logos');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 1. Yayasan Karya Pondok Mandiri
  // BBox: minX: 28, minY: 701, maxX: 1050, maxY: 1712
  const p1 = Math.max(0, 28 - 10);
  const top1 = Math.max(0, 701 - 10);
  const w1 = Math.min(1080 - p1, 1022 + 20);
  const h1 = Math.min(2408 - top1, 1011 + 20);

  await sharp('public/assets/aistudio/Screenshot_20261029-112312_bb433de6.png')
    .extract({ left: p1, top: top1, width: w1, height: h1 })
    .resize(500, 500, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile('public/assets/logos/yayasan_karya_pondok_mandiri.png');
  console.log('Saved yayasan_karya_pondok_mandiri.png');

  // 2. Embi Tech Computindo
  // BBox: minX: 95, minY: 752, maxX: 986, maxY: 1670
  const p2 = Math.max(0, 95 - 15);
  const top2 = Math.max(0, 752 - 15);
  const w2 = Math.min(1080 - p2, 891 + 30);
  const h2 = Math.min(2408 - top2, 918 + 30);

  await sharp('public/assets/aistudio/Screenshot_20261029-112321_d6b36828.png')
    .extract({ left: p2, top: top2, width: w2, height: h2 })
    .resize(500, 500, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile('public/assets/logos/embi_tech_computindo.png');
  console.log('Saved embi_tech_computindo.png');

  // 3. BBPVP Bekasi
  // BBox: minX: 20, minY: 1003, maxX: 1059, maxY: 1404
  const p3 = Math.max(0, 20 - 10);
  const top3 = Math.max(0, 1003 - 15);
  const w3 = Math.min(1080 - p3, 1039 + 20);
  const h3 = Math.min(2408 - top3, 401 + 30);

  await sharp('public/assets/aistudio/Screenshot_20261029-112333_a8629014.png')
    .extract({ left: p3, top: top3, width: w3, height: h3 })
    .resize(600, 230, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile('public/assets/logos/bbpvp_bekasi.png');
  console.log('Saved bbpvp_bekasi.png');
}

cropLogos().catch(console.error);
