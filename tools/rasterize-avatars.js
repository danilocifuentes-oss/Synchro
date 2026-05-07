const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC_DIR = path.join(__dirname, "..", "public", "avatars");
const OUT_DIR = path.join(__dirname, "..", "public", "avatars", "raster");
const SIZES = [128, 64, 40];
const FORMATS = [
  { name: "avif", options: { quality: 60 } },
  { name: "webp", options: { quality: 70 } },
  { name: "png", options: { compressionLevel: 8 } },
];

async function ensure(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function processFile(file) {
  const basename = path.basename(file, path.extname(file));
  const input = path.join(SRC_DIR, file);
  const outEntries = [];

  for (const size of SIZES) {
    for (const fmt of FORMATS) {
      const outName = `${basename}_${size}.${fmt.name}`;
      const outPath = path.join(OUT_DIR, outName);
      try {
        let img = sharp(input).resize(size, size, { fit: "cover" }).png();
        if (fmt.name === "avif") img = sharp(input).resize(size, size, { fit: "cover" }).avif(fmt.options);
        if (fmt.name === "webp") img = sharp(input).resize(size, size, { fit: "cover" }).webp(fmt.options);
        if (fmt.name === "png") img = sharp(input).resize(size, size, { fit: "cover" }).png(fmt.options);
        await img.toFile(outPath);
        outEntries.push({ file: outName, size, format: fmt.name, path: path.relative(path.join(__dirname, ".."), outPath) });
        console.log("Wrote", outName);
      } catch (err) {
        console.error("Failed", outName, err);
      }
    }
  }
  return { basename, generated: outEntries };
}

async function main() {
  await ensure(OUT_DIR);
  const files = fs.readdirSync(SRC_DIR).filter((f) => /\.(svg|png)$/i.test(f));
  const manifest = { generatedAt: new Date().toISOString(), items: [] };

  for (const f of files) {
    console.log("Processing", f);
    const res = await processFile(f);
    manifest.items.push(res);
  }

  const manifestPath = path.join(OUT_DIR, "manifest-avatars.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log("Done. Manifest written to", manifestPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
