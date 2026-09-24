// Pure motion decision shared by the React Native hook and tests. No React import.
// `quiet` is a host flag for sensitive contexts (e.g. a paused or ended journey):
// it removes ambient and celebratory motion without changing any information shown.
export function motionPolicy({ reduceMotion = false, appState = 'active', quiet = false } = {}) {
  const foreground = appState === 'active';
  return {
    foreground,
    // Ambient or looping motion runs only when visible, allowed and not quiet.
    ambient: foreground && !reduceMotion && !quiet,
    // One-shot cues still show their settled state; they skip the tween under Reduce Motion.
    tween: !reduceMotion,
    // Growth, arrival or success flourishes. Never in quiet contexts.
    celebrate: !reduceMotion && !quiet,
  };
}
