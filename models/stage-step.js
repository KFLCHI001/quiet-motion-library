// Browse an ordered set of stages with a continuous position (from a swipe,
// buttons or a slider). Every stage's pose derives from position alone, so a
// gesture can stop, reverse or be interrupted at any point.

/**
 * `sizes` are relative display sizes, one per stage, e.g. [0.2, 0.35, 1].
 * Returns frozen layout data; call once per stage set.
 */
export function stageSet(sizes, { spacing = 1, minScale = 0.12 } = {}) {
  if (!Array.isArray(sizes) || sizes.length < 1) throw new TypeError('stageSet needs at least one size');
  const max = Math.max(...sizes);
  if (!(max > 0) || sizes.some((s) => !Number.isFinite(s) || s <= 0)) throw new TypeError('stage sizes must be positive');
  return Object.freeze({
    count: sizes.length,
    spacing,
    scales: Object.freeze(sizes.map((s) => Math.max(minScale, s / max))),
  });
}

export function clampPosition(position, set) {
  'worklet';
  const n = Number(position);
  return Number.isFinite(n) ? Math.min(set.count - 1, Math.max(0, n)) : 0;
}

/**
 * Pose for stage `index` at continuous `position`.
 * - `offset`: signed distance from the focus, in stage widths (for x translation)
 * - `opacity`: 1 in focus, fading to 0 one stage away (crossfade)
 * - `scale`: the stage's own relative size, easing up slightly as it arrives
 */
export function stagePose(index, position, set) {
  'worklet';
  const p = clampPosition(position, set);
  const distance = index - p;
  const away = Math.min(1, Math.abs(distance));
  const arrive = 1 - away;
  return {
    offset: distance * set.spacing,
    opacity: arrive,
    scale: set.scales[index] * (0.92 + 0.08 * arrive),
    focused: away < 0.5,
  };
}

/** Continuous size of "the thing in focus", interpolated between neighbouring stages. */
export function focusScale(position, set) {
  'worklet';
  const p = clampPosition(position, set);
  const low = Math.floor(p);
  const high = Math.min(set.count - 1, low + 1);
  const t = p - low;
  return set.scales[low] + (set.scales[high] - set.scales[low]) * t;
}

/** Where a released gesture should settle: nearest stage, nudged by velocity (stages/s). */
export function settleIndex(position, velocity, set, flick = 0.35) {
  const p = clampPosition(position, set);
  const nudge = Math.abs(velocity) > flick ? Math.sign(velocity) * 0.5 : 0;
  return Math.min(set.count - 1, Math.max(0, Math.round(p + nudge)));
}
