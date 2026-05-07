const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const AVATAR_SRC = path.join(ROOT, "public", "avatars");
const AVATAR_OUT = path.join(ROOT, "public", "avatars", "raster");
const TEXTURE_SRC = path.join(ROOT, "public", "textures");
const TEXTURE_OUT = path.join(ROOT, "public", "textures", "raster");

const AVATAR_SIZES = [128, 64, 40];
const TEXTURE_SIZES = [1600, 1200, 800];

const FORMATS = [
  { ext: "avif", fn: (img, opts) => img.avif(opts), opts: { quality: 60 } },
  { ext: "webp", fn: (img, opts) => img.webp(opts), opts: { quality: 70 } },
  { ext: "png", fn: (img, opts) => img.png(opts), opts: { compressionLevel: 8 } },
];

async function ensure(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function rasterizeAvatars() {
  await ensure(AVATAR_OUT);
  const files = fs
    .readdirSync(AVATAR_SRC)
    .filter((f) => f.toLowerCase().endsWith(".svg"))
    .map((f) => path.join(AVATAR_SRC, f));
  const manifest = { avatars: [], generatedAt: new Date().toISOString() };

  for (const f of files) {
    const name = path.basename(f, path.extname(f));
    const item = { name, variants: [] };
    for (const size of AVATAR_SIZES) {
      for (const fmt of FORMATS) {
        const outName = `${name}_${size}.${fmt.ext}`;
        const outPath = path.join(AVATAR_OUT, outName);
        try {
          let img = sharp(f).resize(size, size, { fit: "cover" });
          img = fmt.fn(img, fmt.opts);
          await img.toFile(outPath);
          item.variants.push({ size, format: fmt.ext, path: path.relative(ROOT, outPath).replace(/\\/g, "/") });
          console.log("Wrote", outPath);
        } catch (e) {
          console.error("Error", outPath, e);
        }
      }
    }
    manifest.avatars.push(item);
  }
  fs.writeFileSync(path.join(AVATAR_OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("Avatars manifest written");
}

async function rasterizeTextures() {
  await ensure(TEXTURE_OUT);
  const files = fs
    .readdirSync(TEXTURE_SRC)
    .filter((f) => f.toLowerCase().endsWith(".svg"))
    .map((f) => path.join(TEXTURE_SRC, f));
  const manifest = { textures: [], generatedAt: new Date().toISOString() };

  for (const f of files) {
    const name = path.basename(f, path.extname(f));
    const item = { name, variants: [] };
    for (const w of TEXTURE_SIZES) {
      for (const fmt of FORMATS) {
        const outName = `${name}_${w}.${fmt.ext}`;
        const outPath = path.join(TEXTURE_OUT, outName);
        try {
          let img = sharp(f).resize(w, null, { fit: "cover" });
          img = fmt.fn(img, fmt.opts);
          await img.toFile(outPath);
          item.variants.push({ width: w, format: fmt.ext, path: path.relative(ROOT, outPath).replace(/\\/g, "/") });
          console.log("Wrote", outPath);
        } catch (e) {
          console.error("Error", outPath, e);
        }
      }
    }
    manifest.textures.push(item);
  }
  fs.writeFileSync(path.join(TEXTURE_OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("Textures manifest written");
}

async function main() {
  await rasterizeAvatars();
  await rasterizeTextures();
  console.log("All done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
