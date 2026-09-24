// Drive a paced cycle from one UI-thread frame clock. `level` (0–1) feeds animated
// styles; `onCue(segment)` runs on the JS thread at each segment start, e.g. for haptics.
// Requires react-native-reanimated 3+. Pass `active=false` to stop both at once.
import { useEffect } from 'react';
import { runOnJS, useFrameCallback, useSharedValue } from 'react-native-reanimated';
import { pacedEvents, pacedPhase } from '../models/paced-cycle.js';

export function usePacedCycle({ active, pattern, onCue }) {
  const level = useSharedValue(0);
  const elapsed = useSharedValue(-1);
  const frame = useFrameCallback((info) => {
    const previous = elapsed.value;
    const next = previous < 0 ? 0 : previous + (info.timeSincePreviousFrame ?? 0);
    elapsed.value = next;
    level.value = pacedPhase(next, pattern).level;
    const events = pacedEvents(previous, next, pattern, 1);
    if (events.length && onCue) runOnJS(onCue)(events[0].segment);
  }, false);
  useEffect(() => {
    // Restarting begins a fresh cycle at the empty state with an inhale cue.
    elapsed.value = -1;
    level.value = 0;
    frame.setActive(Boolean(active));
    return () => frame.setActive(false);
  }, [active, pattern, frame, elapsed, level]);
  return level;
}
