// Wrap a transparent mascot PNG in a Lottie idle loop (breathe, bob, tilt).
// Keyframed transforms on embedded image layers. An optional aligned eyes-closed PNG adds blinks
// by swapping layers for a few frames. No rigging, so no ear motion.
//
// Usage: node tools/mascot/lottie-idle.mjs "<transparentPng>" "<out.json>" [size=512] [blinkPng]
import { readFileSync, writeFileSync } from "node:fs";

const [png, out, sizeArg = "512", blinkPng] = process.argv.slice(2);
if (!png || !out) {
  console.error('Usage: node tools/mascot/lottie-idle.mjs "<transparentPng>" "<out.json>" [size] [blinkPng]');
  process.exit(1);
}
const S = Number(sizeArg);
const FR = 30;
const OP = 120; // 4s loop
const ease = { i: { x: [0.45], y: [1] }, o: { x: [0.55], y: [0] } };
const easeN = (n) => ({ i: { x: Array(n).fill(0.45), y: Array(n).fill(1) }, o: { x: Array(n).fill(0.55), y: Array(n).fill(0) } });
const kf = (pairs, n) => pairs.map(([t, s], idx) => (idx < pairs.length - 1 ? { t, s, ...(n ? easeN(n) : ease) } : { t, s }));

// Anchor at the hooves so breathing/tilt pivots from the ground.
const anchor = [S / 2, S * 0.9, 0];
const ks = {
  o: { a: 0, k: 100 },
  a: { a: 0, k: anchor },
  p: { a: 1, k: kf([[0, anchor], [30, [S / 2, S * 0.9 - 4, 0]], [60, anchor], [90, [S / 2, S * 0.9 - 3, 0]], [120, anchor]], 3) },
  s: { a: 1, k: kf([[0, [100, 100, 100]], [30, [101.2, 102.4, 100]], [60, [100, 100, 100]], [90, [101, 102, 100]], [120, [100, 100, 100]]], 3) },
  r: { a: 1, k: kf([[0, [0]], [45, [0]], [65, [-2.5]], [95, [0]], [120, [0]]]) },
};
const asset = (id, file) => ({ id, w: S, h: S, u: "", p: `data:image/png;base64,${readFileSync(file).toString("base64")}`, e: 1 });
const layer = (ind, refId, extra = {}) => ({ ddd: 0, ind, ty: 2, nm: refId, refId, sr: 1, ao: 0, ip: 0, op: OP, st: 0, bm: 0, ks, ...extra });
// Blink: show the eyes-closed layer for 4 frames at 1.2s and 3.3s (hold keyframes).
const blinkOpacity = { a: 1, k: [[0, 0], [36, 100], [40, 0], [99, 100], [103, 0]].map(([t, v]) => ({ t, s: [v], h: 1 })) };

const anim = {
  v: "5.9.0", fr: FR, ip: 0, op: OP, w: S, h: S, nm: "lamb-idle", ddd: 0,
  assets: [asset("lamb", png), ...(blinkPng ? [asset("lamb-blink", blinkPng)] : [])],
  layers: [...(blinkPng ? [layer(1, "lamb-blink", { ks: { ...ks, o: blinkOpacity } })] : []), layer(2, "lamb")],
};
writeFileSync(out, JSON.stringify(anim));
console.log(`Saved ${out} (${Math.round(JSON.stringify(anim).length / 1024)} KB, ${OP / FR}s loop${blinkPng ? ", with blinks" : ""})`);
