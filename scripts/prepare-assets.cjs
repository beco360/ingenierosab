const path = require('node:path');
const sharp = require('sharp');

const assets = path.resolve(__dirname, '../assets');
const sources = [['apartment-source.png', 'hero'], ['before-source.png', 'before']];
const coverText = Buffer.from(`<svg width="1200" height="630"><rect width="650" height="630" fill="#f4f2ec"/><g fill="#202421" font-family="Arial"><text x="56" y="100" font-size="22" letter-spacing="3">INGENIEROS AB</text><text x="52" y="235" font-size="60">Tu apartamento.</text><text x="52" y="315" font-size="60">Una nueva</text><text x="52" y="395" font-size="58" font-family="Georgia" font-style="italic">forma de vivir.</text><text x="56" y="520" font-size="19">REMODELACIÓN DE APARTAMENTOS</text><text x="56" y="555" font-size="19">BOGOTÁ, COLOMBIA</text></g></svg>`);

async function prepare() {
  for (const [source, name] of sources) {
    for (const width of [640, 896]) {
      await sharp(path.join(assets, source)).resize({ width }).webp({ quality: 82, effort: 5 }).toFile(path.join(assets, `${name}-${width}.webp`));
    }
  }
  const photograph = await sharp(path.join(assets, 'apartment-source.png')).resize(550, 630, { fit: 'cover' }).toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#f4f2ec' } })
    .composite([{ input: photograph, left: 650, top: 0 }, { input: coverText }])
    .jpeg({ quality: 88 })
    .toFile(path.join(assets, 'social-cover.jpg'));
  console.log('Imágenes responsivas y portada social preparadas.');
}

prepare().catch(error => { console.error(error.message); process.exitCode = 1; });
