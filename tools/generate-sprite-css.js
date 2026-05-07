const fs = require("fs");
const path = require("path");

const OUT_CSS = path.join(__dirname, "..", "public", "sprites", "sprite.css");
const ICONS_DIR = path.join(__dirname, "..", "public", "icons");
const files = fs
  .readdirSync(ICONS_DIR)
  .filter((f) => /^discipline-.*\.svg$/i.test(f))
  .map((f) => path.join(ICONS_DIR, f));

const lines = [];
files.forEach((f) => {
  const name = path.basename(f, ".svg");
  const cls = `.icon-${name}`;
  const symbolId = name;
  const rule = `${cls} { width: 32px; height: 32px; background: none; display:inline-block; background-image: url('/sprites/sprite.svg#${symbolId}'); background-repeat: no-repeat; }`;
  lines.push(rule);
});

fs.writeFileSync(OUT_CSS, lines.join("\n"));
console.log("sprite css written", OUT_CSS);
