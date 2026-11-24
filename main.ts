import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Bring the humans with a TikTok ad — entrypoint.
// Copies VIDEO.json (the TikTok video URL for this entry) into the
// grader's output directory. Nothing else is written, and no file or
// directory permissions are ever changed here.

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? ".";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

// A real TikTok video URL: https://www.tiktok.com/@<handle>/video/<digits>.
// The placeholder VIDEO.json ships with a digits-only id of all zeros;
// it matches this shape and is replaced with the real posted video's
// URL before the final submission.
const TIKTOK_URL = /^https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+$/;

const video = JSON.parse(
  readFileSync(join(BOT_DIR, "VIDEO.json"), "utf8"),
) as { url?: unknown };

if (typeof video.url !== "string" || !TIKTOK_URL.test(video.url)) {
  throw new Error(
    `VIDEO.json does not hold a valid TikTok video URL: ${String(video.url)}`,
  );
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(join(BOT_DIR, "VIDEO.json"), join(OUTPUT_DIR, "VIDEO.json"));
if (/\/0+$/.test(video.url)) {
  console.warn(
    "NOTE: VIDEO.json still holds the all-zeros placeholder id — " +
      "replace it with the real posted TikTok video URL before submitting.",
  );
}
console.log(`Wrote ${join(OUTPUT_DIR, "VIDEO.json")} for ${video.url}`);
