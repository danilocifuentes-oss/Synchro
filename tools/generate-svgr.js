const fs = require("fs");
const path = require("path");
const { transform } = require("@svgr/core");

const SRC = path.join(__dirname, "..", "public", "icons");
const OUT = path.join(__dirname, "..", "app", "components", "icons-react");

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

function toComponentName(fileBaseName) {
  const raw = fileBaseName
    .split("-")
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : ""))
    .join("");
  return raw.match(/^[A-Za-z_]/) ? raw : `Icon${raw}`;
}

async function generate() {
  const files = fs
    .readdirSync(SRC)
    .filter((f) => f.toLowerCase().endsWith(".svg"))
    .map((f) => path.join(SRC, f));
  const exports = [];
  for (const f of files) {
    const name = path.basename(f, ".svg");
    const compName = toComponentName(name);
    const svgCode = fs.readFileSync(f, "utf8");
    const tsx = await transform(
      svgCode,
      {
        icon: true,
        typescript: true,
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        prettier: false,
      },
      { componentName: compName },
    );
    const outFile = path.join(OUT, `${compName}.tsx`);
    fs.writeFileSync(outFile, tsx, "utf8");
    exports.push(`export { default as ${compName} } from "./${compName}";`);
    console.log("Wrote", outFile);
  }
  fs.writeFileSync(path.join(OUT, "index.ts"), exports.join("\n") + "\n");
  console.log("Index created");
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
