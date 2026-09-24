// Animate a mascot still into a seamless idle loop with fal's MiniMax H3 Max Turbo image-to-video.
// The same image is sent as first and last frame so the clip closes as a loop.
// Input should be the mascot on flat chroma green at the output aspect ratio.
//
// Usage: FAL_KEY=... node tools/mascot/idle-loop.mjs <greenPng> <outMp4> "<prompt>" [480P|768P] [seconds]
// Optional: SEED=<int>, MODEL=<fal endpoint id>
import { readFileSync, writeFileSync } from "node:fs";

const KEY = process.env.FAL_KEY;
const MODEL = process.env.MODEL || "minimax/h3-max-turbo/image-to-video";
const [img, out, prompt, resolution = "480P", duration = "5"] = process.argv.slice(2);
if (!KEY || !img || !out || !prompt) {
  console.error('Usage: FAL_KEY=... node tools/mascot/idle-loop.mjs <greenPng> <outMp4> "<prompt>" [480P|768P] [seconds]');
  process.exit(1);
}
const auth = { Authorization: `Key ${KEY}` };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function upload(path) {
  const tok = await fetch("https://rest.alpha.fal.ai/storage/auth/token?storage_type=fal-cdn-v3", {
    method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: "{}",
  }).then((r) => r.json());
  const res = await fetch(`${tok.base_url}/files/upload`, {
    method: "POST", headers: { Authorization: `Bearer ${tok.token}`, "Content-Type": "image/png" }, body: readFileSync(path),
  });
  const up = await res.json();
  if (!res.ok) throw new Error(`upload failed: ${JSON.stringify(up).slice(0, 300)}`);
  return up.access_url || up.url;
}

const url = await upload(img);
const input = { prompt, image_url: url, end_image_url: url, resolution, duration: Number(duration), prompt_expansion_mode: "disabled" };
if (process.env.SEED) input.seed = Number(process.env.SEED);
const sub = await fetch(`https://queue.fal.run/${MODEL}`, {
  method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify(input),
}).then((r) => r.json());
if (!sub.status_url) throw new Error(`submit failed: ${JSON.stringify(sub).slice(0, 300)}`);
console.log(`queued ${sub.request_id}`);
for (const deadline = Date.now() + 9 * 60_000; ; ) {
  if (Date.now() > deadline) throw new Error("timed out");
  await sleep(5000);
  const s = await fetch(sub.status_url, { headers: auth }).then((r) => r.json()).catch(() => ({}));
  if (s.status === "COMPLETED") break;
  if (s.status === "FAILED" || s.error) throw new Error(`failed: ${JSON.stringify(s).slice(0, 300)}`);
}
const result = await fetch(sub.response_url, { headers: auth }).then((r) => r.json());
const buf = Buffer.from(await fetch(result.video.url).then((r) => r.arrayBuffer()));
writeFileSync(out, buf);
console.log(`saved ${out} (${Math.round(buf.length / 1024)} KB)`);
