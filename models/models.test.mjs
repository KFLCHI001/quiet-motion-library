import assert from 'node:assert/strict';
import { pacedEvents, pacedPattern, pacedPhase } from './paced-cycle.js';
import { focusScale, settleIndex, stagePose, stageSet } from './stage-step.js';

// Paced cycle: 4 s in / 4 s out.
const box = pacedPattern();
assert.equal(box.total, 8000);
assert.deepEqual(pacedPhase(0, box), { cycle: 0, segment: 'inhale', index: 0, progress: 0, level: 0 });
assert.ok(Math.abs(pacedPhase(2000, box).level - 0.5) < 1e-12);
assert.ok(Math.abs(pacedPhase(4000, box).level - 1) < 1e-12, 'full at exhale start');
assert.equal(pacedPhase(8000, box).cycle, 1);
assert.equal(pacedPhase(-5, box).level, 0);
assert.equal(pacedPhase(NaN, box).segment, 'inhale');
assert.deepEqual(pacedPhase(123456, box), pacedPhase(123456, box), 'deterministic');
// Holds
const sq = pacedPattern({ inhale: 4000, holdIn: 7000, exhale: 8000 });
assert.equal(pacedPhase(6000, sq).segment, 'holdIn');
assert.equal(pacedPhase(6000, sq).level, 1);
assert.equal(pacedPhase(19000, sq).cycle, 1);
assert.throws(() => pacedPattern({ inhale: 0 }), TypeError);
assert.throws(() => pacedPattern({ exhale: -1 }), TypeError);
// Events: start, each crossing, no burst after a long gap
assert.deepEqual(pacedEvents(-1, 16, box), [{ at: 0, segment: 'inhale', cycle: 0 }]);
assert.deepEqual(pacedEvents(3990, 4010, box), [{ at: 4000, segment: 'exhale', cycle: 0 }]);
assert.deepEqual(pacedEvents(4000, 4016, box), [], 'boundary fires once');
assert.equal(pacedEvents(0, 3_600_000, box, 1).length, 1, 'an hour in background yields one cue');
assert.equal(pacedEvents(0, 3_600_000, box, 1)[0].at, 3_600_000);
assert.deepEqual(pacedEvents(10, 5, box), []);
// Level and events agree: every exhale event is at the peak.
for (const e of pacedEvents(0, 40000, box, 20).filter((e) => e.segment === 'exhale')) {
  assert.ok(pacedPhase(e.at, box).level > 0.999);
}

// Stage step
const set = stageSet([2, 10, 51]);
assert.equal(set.scales[2], 1);
assert.equal(stagePose(1, 1, set).opacity, 1);
assert.equal(stagePose(0, 1, set).opacity, 0);
assert.equal(stagePose(1, 1.5, set).opacity, 0.5);
assert.equal(stagePose(2, 1.5, set).opacity, 0.5);
assert.equal(stagePose(2, 1.5, set).offset, 0.5);
assert.ok(stagePose(1, 1.25, set).focused && !stagePose(2, 1.25, set).focused);
assert.equal(stagePose(0, -3, set).opacity, 1, 'clamped');
assert.ok(focusScale(0.5, set) > set.scales[0] && focusScale(0.5, set) < set.scales[1]);
for (let p = 0; p < 2; p += 0.1) assert.ok(focusScale(p + 0.1, set) >= focusScale(p, set), 'monotonic sizes grow monotonically');
assert.equal(settleIndex(1.3, 0, set), 1);
assert.equal(settleIndex(1.3, 1, set), 2, 'flick forward');
assert.equal(settleIndex(1.3, -1, set), 1);
assert.equal(settleIndex(0.1, -5, set), 0);
assert.throws(() => stageSet([]), TypeError);
assert.throws(() => stageSet([1, 0]), TypeError);
console.log('paced cycle and stage step models: PASS');
