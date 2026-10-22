const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const siteRoot = path.resolve(__dirname, '..');
const assetsDirectory = path.join(siteRoot, 'assets');
const sourceDirectory = path.join(assetsDirectory, 'source');

async function prepareArchive() {
  const { logos } = JSON.parse(await fs.readFile(path.join(siteRoot, 'content', 'client-logos.json'), 'utf8'));
  await fs.mkdir(assetsDirectory, { recursive: true });
  const report = await Promise.all(logos.map(async (asset) => {
    const sourcePath = path.join(sourceDirectory, asset.source);
    const outputPath = path.join(assetsDirectory, `client-${asset.id}.webp`);
    const pngPath = path.join(sourceDirectory, 'clients', `${asset.id}.png`);
    const sourceMetadata = await sharp(sourcePath).metadata();
    const sourceFile = await fs.stat(sourcePath);
    const vector = sourceMetadata.format === 'svg';
    const png = await sharp(sourcePath, vector ? { density: 600 } : {})
      .rotate()
      .trim({ threshold: 8 })
      .resize({ width: 1200, height: 640, fit: 'inside', withoutEnlargement: !vector })
      .png()
      .toBuffer();
    await fs.writeFile(pngPath, png);
    const outputMetadata = await sharp(png)
      .resize({ width: 648, height: 288, fit: 'inside', withoutEnlargement: true })
      .webp({ lossless: true })
      .toFile(outputPath);

    return {
      source: asset.source,
      sourceWidth: sourceMetadata.width,
      sourceHeight: sourceMetadata.height,
      sourceBytes: sourceFile.size,
      png: `assets/source/clients/${asset.id}.png`,
      output: `assets/client-${asset.id}.webp`,
      width: outputMetadata.width,
      height: outputMetadata.height,
      bytes: outputMetadata.size,
      encoding: 'WebP lossless'
    };
  }));
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

prepareArchive().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
