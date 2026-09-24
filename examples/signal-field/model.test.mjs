import assert from 'node:assert/strict';
import { clampUnit, DEFAULT_THEME, resolveTheme, signalField, signalTile, TILE_COUNT } from './model.js';

assert.equal(clampUnit(-3), 0);
assert.equal(clampUnit(3), 1);
assert.equal(clampUnit(NaN), 0);
for (const input of [0, 0.1, 0.9, 0.25, 1, 0.01, 0.5]) {
  const field = signalField(input);
  assert.equal(field.input, input);
  assert.equal(field.tiles.length, TILE_COUNT);
  assert.equal(field.motif.length, 3);
  for (const tile of field.tiles) {
    for (const key of ['x', 'y', 'width', 'height', 'rotation']) assert.ok(Number.isFinite(tile[key]), key);
    assert.match(tile.color, /^#[0-9a-f]{6}$/);
  }
  assert.deepEqual(field, signalField(input));
}
assert.notDeepEqual(signalField(0).tiles, signalField(1).tiles);
const beforeReversal = signalField(0.25);
signalField(0.9);
assert.deepEqual(signalField(0.25), beforeReversal); // reversal is stateless

const dark = resolveTheme({ background: '#1d2321', rail: '#d9cfc2', low: '#6e8f86', high: '#c9b27a' });
const themed = signalField(0.5, dark);
assert.equal(themed.background, '#1d2321');
assert.equal(themed.rail, '#d9cfc2');
assert.notEqual(themed.tiles[0].color, signalField(0.5).tiles[0].color);
assert.deepEqual(themed.tiles.map(({ color, ...shape }) => shape),
  signalField(0.5).tiles.map(({ color, ...shape }) => shape), 'theme changes color only');
assert.deepEqual(resolveTheme({}), DEFAULT_THEME);
assert.throws(() => resolveTheme({ low: 'red' }), TypeError);
assert.deepEqual(signalTile(0.5, 4), signalField(0.5).tiles[4]);
console.log('signal field model: PASS');
