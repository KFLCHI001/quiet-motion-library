import assert from 'node:assert/strict';
import { clampUnit, signalField, TILE_COUNT } from './model.mjs';

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
console.log('signal field model: PASS');
