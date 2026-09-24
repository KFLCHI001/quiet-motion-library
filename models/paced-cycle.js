// A paced cycle (breathing, pacing) derived from elapsed time alone.
// Visuals and haptics read the same function, so they cannot drift apart.
// No clock, storage or I/O; the host supplies elapsed milliseconds.

/** Validate a pattern once, off the animation path. Holds are optional. */
export function pacedPattern({ inhale = 4000, holdIn = 0, exhale = 4000, holdOut = 0 } = {}) {
  const segments = [
    ['inhale', inhale], ['holdIn', holdIn], ['exhale', exhale], ['holdOut', holdOut],
  ].filter(([, ms]) => ms > 0);
  for (const [name, ms] of [['inhale', inhale], ['exhale', exhale], ['holdIn', holdIn], ['holdOut', holdOut]]) {
    if (!Number.isFinite(ms) || ms < 0) throw new TypeError(`paced pattern ${name} must be a non-negative number of ms`);
  }
  if (inhale <= 0 || exhale <= 0) throw new TypeError('paced pattern needs inhale and exhale');
  const names = segments.map(([name]) => name);
  const durations = segments.map(([, ms]) => ms);
  const starts = [];
  let total = 0;
  for (const ms of durations) { starts.push(total); total += ms; }
  return Object.freeze({ names, durations, starts, total });
}

function easeInOutSine(t) {
  'worklet';
  return 0.5 - Math.cos(Math.PI * t) / 2;
}

/**
 * State at `elapsedMs`. `level` is 0 (empty) to 1 (full): it rises on inhale,
 * holds, falls on exhale. Negative or nonfinite time reads as the start.
 */
export function pacedPhase(elapsedMs, pattern) {
  'worklet';
  const time = Number.isFinite(elapsedMs) && elapsedMs > 0 ? elapsedMs : 0;
  const cycle = Math.floor(time / pattern.total);
  const within = time - cycle * pattern.total;
  let index = pattern.starts.length - 1;
  for (let i = 0; i < pattern.starts.length; i += 1) {
    if (within < pattern.starts[i] + pattern.durations[i]) { index = i; break; }
  }
  const name = pattern.names[index];
  const progress = (within - pattern.starts[index]) / pattern.durations[index];
  const eased = easeInOutSine(progress);
  let level = 0;
  if (name === 'inhale') level = eased;
  else if (name === 'holdIn') level = 1;
  else if (name === 'exhale') level = 1 - eased;
  return { cycle, segment: name, index, progress, level };
}

/**
 * Segment starts crossed in the half-open interval (fromMs, toMs]. A host haptic
 * loop calls this each frame with its previous and current elapsed time, then plays
 * one cue per event. Large gaps (e.g. after backgrounding) return at most `limit`
 * events so a resume never fires a burst.
 */
export function pacedEvents(fromMs, toMs, pattern, limit = 1) {
  'worklet';
  if (!(toMs > fromMs) || toMs < 0) return [];
  // Only the latest events matter; skip long gaps without iterating them.
  const from = Math.max(fromMs, toMs - pattern.total * 2);
  const events = [];
  for (let cycle = Math.max(0, Math.floor(from / pattern.total)); cycle * pattern.total <= toMs; cycle += 1) {
    for (let i = 0; i < pattern.starts.length; i += 1) {
      const at = cycle * pattern.total + pattern.starts[i];
      if (at > toMs) break;
      if (at > from) events.push({ at, segment: pattern.names[i], cycle });
    }
  }
  return events.slice(-limit);
}
