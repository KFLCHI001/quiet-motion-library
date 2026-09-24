// A one-shot acknowledgment beside host status text. Reanimated 3+ only; no SVG or Lottie runtime.
// Set `kept` only after the real save succeeds. The host owns the words and the announcement.
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const DURATION_MS = 167; // matches assets/bookmark-kept (5 frames at 30 fps)

export function KeptCue({ kept, accent, line, size = 16 }) {
  const progress = useSharedValue(kept ? 1 : 0);
  useEffect(() => {
    // ReduceMotion.System jumps to the settled value when the user asks for less motion.
    progress.value = kept
      ? withTiming(1, { duration: DURATION_MS, easing: Easing.bezier(0.23, 1, 0.32, 1), reduceMotion: ReduceMotion.System })
      : 0; // undo or failure removes the mark at once; never animate a retraction as success
  }, [kept, progress]);
  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * -size * 0.25 }, { scale: 0.9 + progress.value * 0.1 }],
  }));
  // Decorative: the adjacent host text carries meaning for assistive technology.
  return (
    <Animated.View accessible={false} importantForAccessibility="no-hide-descendants" style={[{ width: size, height: size }, style]}>
      <View style={{
        width: size * 0.62, height: size, marginHorizontal: size * 0.19, backgroundColor: accent,
        borderColor: line, borderWidth: 1, borderTopLeftRadius: 2, borderTopRightRadius: 2,
      }} />
    </Animated.View>
  );
}
