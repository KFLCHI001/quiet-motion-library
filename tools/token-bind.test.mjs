import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { bindBookmarkLottie, bindBookmarkStill } from '../assets/bookmark-kept/tokens.mjs';

const root = new URL('../assets/bookmark-kept/', import.meta.url);
const raw = JSON.parse(await readFile(new URL('motion.lottie.json', root), 'utf8'));
const svg = await readFile(new URL('still.svg', root), 'utf8');
const light = { accent: '#506E59', line: '#E4DAC6' };
const dark = { accent: '#B6A8E8', line: '#51483B' };

const lightAnimation = bindBookmarkLottie(raw, light);
const darkAnimation = bindBookmarkLottie(raw, dark);
const paint = animation => animation.layers[0].shapes.filter(shape => shape.ty === 'fl' || shape.ty === 'st').map(shape => shape.c.k);

assert.equal(raw.w, 24);
assert.equal(raw.op / raw.fr, 5 / 30);
assert.notDeepEqual(paint(lightAnimation), paint(darkAnimation));
assert.notDeepEqual(paint(raw), paint(lightAnimation), 'binding must leave the source template untouched');
assert.deepEqual(bindBookmarkLottie(raw, light), lightAnimation, 'same tokens should produce stable output');
assert.match(bindBookmarkStill(svg, light), /fill="#506E59" stroke="#E4DAC6"/);
assert.match(bindBookmarkStill(svg, dark), /fill="#B6A8E8" stroke="#51483B"/);
assert.throws(() => bindBookmarkLottie(raw, { accent: 'gold', line: '#51483B' }), TypeError);
console.log('PASS Bookmark token binding: light/dark colors, stable template, static parity, invalid-token guard');
