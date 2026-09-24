import { writeFileSync } from 'node:fs';
import { signalField, WIDTH, HEIGHT } from './model.js';

const frames = [signalField(0), signalField(0.5), signalField(1)];
const times = [0, 60, 120];
const rgb = (hex) => [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
const track = (values) => ({ a: 1, k: values.map((value, index) => index < values.length - 1 ? {
  t: times[index], s: value, e: values[index + 1], i: { x: 1, y: 1 }, o: { x: 0, y: 0 },
} : { t: times[index], s: value }) });
const constant = (value) => ({ a: 0, k: value });
const fixedLayer = (name, index, center, size, color) => ({
  ddd: 0, ty: 4, nm: name, sr: 1, st: 0, ip: 0, op: 121, ind: index,
  ks: { a: constant([0, 0]), p: constant(center), s: constant([100, 100]), r: constant(0), o: constant(100) },
  shapes: [
    { ty: 'rc', nm: name, d: 1, p: constant([0, 0]), s: constant(size), r: constant(0) },
    { ty: 'fl', nm: name, c: constant(rgb(color)), o: constant(100), r: 1 },
  ],
});

const animation = {
  v: '5.7.4', fr: 30, ip: 0, op: 121, w: WIDTH, h: HEIGHT,
  nm: 'Signal field input companion', ddd: 0, assets: [],
  layers: Array.from({ length: frames[0].tiles.length }, (_, index) => {
    const tiles = frames.map((frame) => frame.tiles[index]);
    return {
      ddd: 0, ty: 4, nm: `Tile ${index + 1}`, sr: 1, st: 0, ip: 0, op: 121, ind: index + 1,
      ks: {
        a: constant([0, 0]),
        p: track(tiles.map((tile) => [tile.x, tile.y])),
        s: track(tiles.map((tile) => [tile.width * 5, tile.height])),
        r: track(tiles.map((tile) => [tile.rotation])),
        o: constant(100),
      },
      shapes: [
        { ty: 'rc', nm: 'Separate rectangular tile', d: 1, p: constant([0, 0]), s: constant([20, 100]), r: constant(3) },
        { ty: 'fl', nm: 'Input color', c: track(tiles.map((tile) => rgb(tile.color))), o: constant(100), r: 1 },
      ],
    };
  }).concat([
    fixedLayer('Straight rail', 12, [260, 151], [442, 2], '#263d39'),
    fixedLayer('Off-white background', 13, [260, 160], [520, 320], '#f5f0e7'),
  ]),
  meta: { g: 'KFLCHI001 original signal field geometry; host-controlled numeric input' },
};

const still = signalField(0.5);
const rectangles = still.tiles.map((tile) => `  <rect x="${(tile.x - tile.width / 2).toFixed(3)}" y="${(tile.y - tile.height / 2).toFixed(3)}" width="${tile.width.toFixed(3)}" height="${tile.height.toFixed(3)}" rx="3" fill="${tile.color}" transform="rotate(${tile.rotation.toFixed(3)} ${tile.x.toFixed(3)} ${tile.y.toFixed(3)})"/>`).join('\n');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="Separate angled tiles along a horizontal line">\n  <rect width="${WIDTH}" height="${HEIGHT}" fill="${still.background}"/>\n  <rect x="39" y="150" width="442" height="2" fill="${still.rail}"/>\n${rectangles}\n</svg>\n`;
writeFileSync(new URL('./signal-field.json', import.meta.url), JSON.stringify(animation));
writeFileSync(new URL('./still.svg', import.meta.url), svg);
console.log('signal field exports written');
