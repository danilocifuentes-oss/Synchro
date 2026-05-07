const fs = require("fs");
const path = require("path");
const svgstore = require("svgstore");

const ICONS_DIR = path.join(__dirname, "..", "public", "icons");
const SPRITES_DIR = path.join(__dirname, "..", "public", "sprites");
const OUT_FILE = path.join(SPRITES_DIR, "sprite.svg");

if (!fs.existsSync(SPRITES_DIR)) fs.mkdirSync(SPRITES_DIR, { recursive: true });

const files = fs.readdirSync(ICONS_DIR).filter((f) => /^discipline-.*\.svg$/i.test(f));
const sprites = svgstore({ inline: true });

for (const file of files) {
  const id = path.basename(file, ".svg");
  const content = fs.readFileSync(path.join(ICONS_DIR, file), "utf8");
  sprites.add(id, content);
}

fs.writeFileSync(OUT_FILE, sprites.toString({ inline: true }));
console.log("sprite svg written", OUT_FILE);
