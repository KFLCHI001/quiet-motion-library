import assert from 'node:assert/strict';
import { motionPolicy } from './motion-policy.js';

assert.deepEqual(motionPolicy(), { foreground: true, ambient: true, tween: true, celebrate: true });
assert.deepEqual(motionPolicy({ reduceMotion: true }), { foreground: true, ambient: false, tween: false, celebrate: false });
assert.deepEqual(motionPolicy({ quiet: true }), { foreground: true, ambient: false, tween: true, celebrate: false });
for (const appState of ['background', 'inactive', 'unknown']) {
  assert.equal(motionPolicy({ appState }).ambient, false, appState);
  assert.equal(motionPolicy({ appState }).tween, true, 'settled cues still apply off screen');
}
console.log('motion policy: PASS');
