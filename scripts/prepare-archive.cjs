const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const siteRoot = path.resolve(__dirname, '..');
const assetsDirectory = path.join(siteRoot, 'assets');
const sourceDirectory = path.join(assetsDirectory, 'source');

const archiveImages = [
  { source: 'clients/claro.png', output: 'client-claro.webp' },
  { source: 'clients/cencosud.png', output: 'client-cencosud.webp' },
  { source: 'clients/acueducto.png', output: 'client-acueducto.webp' },
  { source: 'clients/inamsilco.png', output: 'client-inamsilco.webp' },
  { source: 'clients/olimpica.png', output: 'client-olimpica.webp' },
  { source: 'clients/jumbo.png', output: 'client-jumbo.webp' }
];

async function prepareArchive() {
  await fs.mkdir(assetsDirectory, { recursive: true });
  const report = await Promise.all(archiveImages.map(async (asset) => {
    const sourcePath = path.join(sourceDirectory, asset.source);
    const outputPath = path.join(assetsDirectory, asset.output);
    const sourceMetadata = await sharp(sourcePath).metadata();
    const sourceFile = await fs.stat(sourcePath);
    const maximumDimension = 240;
    const encoding = { lossless: true };
    const outputMetadata = await sharp(sourcePath)
      .rotate()
      .resize({ width: maximumDimension, height: maximumDimension, fit: 'inside', withoutEnlargement: true })
      .webp(encoding)
      .toFile(outputPath);

    return {
      source: asset.source,
      sourceWidth: sourceMetadata.width,
      sourceHeight: sourceMetadata.height,
      sourceBytes: sourceFile.size,
      output: `assets/${asset.output}`,
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
