// Export a mascot loop for every platform from one chroma-green source clip.
// Writes, per size: WebM VP9 with alpha (Chromium/Firefox), a stacked-alpha H.264 MP4
// (color on top, alpha as luma below; for Android players and canvas/WebGL shaders),
// and, only where the hevc_videotoolbox encoder exists (macOS), HEVC-with-alpha .mov
// for Safari/iOS. Also writes a transparent poster/sticker PNG and manifest.json.
// Audio is always dropped. Requires ffmpeg on PATH.
//
// Usage: node tools/mascot/export.mjs <green.mp4> <outDir> <name> [sizes=720,480,240] [key=0x00B140]
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [src, outDir, name, sizesArg = "720,480,240", key = "0x00B140"] = process.argv.slice(2);
if (!src || !outDir || !name) {
  console.error("Usage: node tools/mascot/export.mjs <green.mp4> <outDir> <name> [sizes=720,480,240] [key=0x00B140]");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
const ff = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: ["ignore", "inherit", "inherit"] });
const probe = (args) => execFileSync("ffprobe", ["-v", "error", ...args], { encoding: "utf8" }).trim();
const hasVideotoolbox = execFileSync("ffmpeg", ["-hide_banner", "-encoders"], { encoding: "utf8" }).includes("hevc_videotoolbox");
const [w, h] = probe(["-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", src]).split(",").map(Number);
const keyed = `chromakey=${key}:0.13:0.06,despill=type=green`;
const kb = (p) => Math.round(statSync(p).size / 1024);

const manifest = { name, source: { width: w, height: h }, poster: `${name}-poster.png`, sizes: [] };
ff(["-i", src, "-vf", `${keyed},format=rgba`, "-frames:v", "1", join(outDir, manifest.poster)]);

for (const size of sizesArg.split(",").map(Number).filter((s) => s > 0 && s <= Math.max(w, h))) {
  const scale = `scale=${size}:-2:flags=lanczos`;
  const entry = { size, files: {} };
  const webm = `${name}-${size}.webm`;
  ff(["-i", src, "-vf", `${keyed},${scale},format=yuva420p`, "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "32", "-an", join(outDir, webm)]);
  entry.files.webm_alpha = webm;
  // Stacked alpha: top half color (premultiplied over black), bottom half alpha as grayscale.
  const stacked = `${name}-${size}-stacked.mp4`;
  ff(["-i", src, "-filter_complex",
    `[0]${keyed},${scale},format=rgba,split[c][a];[c]premultiply=inplace=1,format=yuv420p[top];[a]alphaextract,format=yuv420p[bot];[top][bot]vstack`,
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-movflags", "+faststart", "-an", join(outDir, stacked)]);
  entry.files.stacked_alpha_mp4 = stacked;
  if (hasVideotoolbox) {
    const mov = `${name}-${size}.mov`;
    ff(["-i", src, "-vf", `${keyed},${scale},format=bgra`, "-c:v", "hevc_videotoolbox", "-alpha_quality", "0.75", "-tag:v", "hvc1", "-an", join(outDir, mov)]);
    entry.files.hevc_alpha_mov = mov;
  }
  entry.kb = Object.fromEntries(Object.entries(entry.files).map(([k, f]) => [k, kb(join(outDir, f))]));
  manifest.sizes.push(entry);
}
if (!hasVideotoolbox) manifest.note = "hevc_alpha_mov not produced: hevc_videotoolbox is macOS-only. Encode on a Mac for Safari/iOS alpha video.";
writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(JSON.stringify(manifest, null, 2));
