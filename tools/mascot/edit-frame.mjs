// Make an aligned expression frame (for example eyes closed) by editing a transparent mascot still.
// Uses the OpenAI images edit endpoint with a transparent background.
//
// Usage: OPENAI_API_KEY=... node tools/mascot/edit-frame.mjs <in.png> <out.png> "<edit prompt>"
// Optional: MODEL (default gpt-image-2.5-sunburst), QUALITY (low|medium|high, default medium)
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const KEY = process.env.OPENAI_API_KEY;
const [src, out, prompt] = process.argv.slice(2);
if (!KEY || !src || !out || !prompt) {
  console.error('Usage: OPENAI_API_KEY=... node tools/mascot/edit-frame.mjs <in.png> <out.png> "<edit prompt>"');
  process.exit(1);
}
const form = new FormData();
form.append("model", process.env.MODEL || "gpt-image-2.5-sunburst");
form.append("image[]", new Blob([readFileSync(src)], { type: "image/png" }), basename(src));
form.append("prompt", `${prompt} Keep every other part identical: pose, position, framing, colors. Transparent background.`);
form.append("background", "transparent");
form.append("output_format", "png");
form.append("quality", process.env.QUALITY || "medium");
const res = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: `Bearer ${KEY}` }, body: form });
const j = await res.json();
if (!res.ok || !j.data) throw new Error(`edit failed: ${JSON.stringify(j).slice(0, 400)}`);
writeFileSync(out, Buffer.from(j.data[0].b64_json, "base64"));
console.log(`saved ${out}; usage ${JSON.stringify(j.usage)}`);
