/**
 * Vendors brand SVGs from svgl.app into public/logos/.
 *
 * For each option id in lib/data/logos.ts LOGO_TITLES, resolves the svgl
 * entry by exact (normalized) title, downloads the light SVG to
 * `public/logos/<id>.svg` plus the dark variant to `<id>-dark.svg` when the
 * entry is themed, and rewrites LOGO_DARK_VARIANTS. Prints misses for manual
 * resolution. Be kind to the free API: sequential requests, small delay.
 *
 * Usage: npm run fetch-logos
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, "public", "logos");
const logosPath = path.join(root, "lib", "data", "logos.ts");

function readTitleMap(source) {
  const block = source.match(/LOGO_TITLES[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!block) throw new Error("LOGO_TITLES block not found");
  const entries = [...block[1].matchAll(/^\s*"?([\w.+-]+)"?\s*:\s*"([^"]+)",?\s*$/gm)];
  return Object.fromEntries(entries.map((m) => [m[1], m[2]]));
}

const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/\.js$/, "js")
    .replace(/[^a-z0-9#+]/g, "");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const LOGO_TITLES = readTitleMap(await readFile(logosPath, "utf8"));
  const res = await fetch("https://api.svgl.app");
  if (!res.ok) throw new Error(`svgl API: HTTP ${res.status}`);
  const entries = await res.json();
  const byTitle = new Map();
  for (const entry of entries) {
    const key = normalize(entry.title);
    if (!byTitle.has(key)) byTitle.set(key, entry);
  }
  console.log(`svgl entries: ${entries.length}`);

  await mkdir(outDir, { recursive: true });
  const dark = [];
  const misses = [];
  const hits = [];

  for (const [optionId, title] of Object.entries(LOGO_TITLES)) {
    const entry = byTitle.get(normalize(title));
    if (!entry) {
      misses.push(`${optionId} (title "${title}")`);
      continue;
    }
    const routes =
      typeof entry.route === "string"
        ? { light: entry.route }
        : entry.route;
    try {
      const lightRes = await fetch(routes.light);
      if (!lightRes.ok) throw new Error(`HTTP ${lightRes.status}`);
      await writeFile(
        path.join(outDir, `${optionId}.svg`),
        await lightRes.text(),
      );
      hits.push(optionId);
      if (routes.dark) {
        const darkRes = await fetch(routes.dark);
        if (!darkRes.ok) throw new Error(`HTTP ${darkRes.status}`);
        await writeFile(
          path.join(outDir, `${optionId}-dark.svg`),
          await darkRes.text(),
        );
        dark.push(optionId);
      }
    } catch (error) {
      misses.push(`${optionId} (download failed: ${error.message})`);
    }
    await sleep(120);
  }

  const source = await readFile(logosPath, "utf8");
  const darkList = dark
    .sort()
    .map((id) => `  "${id}",`)
    .join("\n");
  const updated = source.replace(
    /\/\* BEGIN:logo-dark \*\/[\s\S]*?\/\* END:logo-dark \*\//,
    `/* BEGIN:logo-dark */\n${darkList}\n  /* END:logo-dark */`,
  );
  await writeFile(logosPath, updated);

  console.log(`\nhits (${hits.length}): ${hits.join(", ")}`);
  console.log(`dark variants (${dark.length}): ${dark.join(", ")}`);
  console.log(`\nmisses (${misses.length}):`);
  for (const miss of misses) console.log(`  - ${miss}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
