// Drive the signal field from a Reanimated shared value (for example a gesture), on the UI thread.
// The host still owns the value's meaning, its label and its accessibility announcement.
import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { DEFAULT_THEME, HEIGHT, TILE_COUNT, WIDTH, clampUnit, signalTile } from '../examples/signal-field/model.js';

function Tile({ value, index, scale, theme }) {
  const style = useAnimatedStyle(() => {
    const tile = signalTile(clampUnit(value.value), index, theme);
    return {
      left: (tile.x - tile.width / 2) * scale,
      top: (tile.y - tile.height / 2) * scale,
      width: tile.width * scale,
      height: tile.height * scale,
      backgroundColor: tile.color,
      transform: [{ rotate: `${tile.rotation}deg` }],
    };
  });
  return <Animated.View style={[{ position: 'absolute', borderRadius: 3 * scale }, style]} />;
}

/** `value` is a SharedValue<number> in 0–1. Pass `theme` from resolveTheme(); memoize it. */
export function SignalFieldReanimated({ value, size = 300, theme = DEFAULT_THEME }) {
  const scale = size / WIDTH;
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants"
      style={{ width: size, height: HEIGHT * scale, backgroundColor: theme.background, overflow: 'hidden' }}>
      <View style={{ position: 'absolute', left: 39 * scale, top: 150 * scale, width: 442 * scale, height: 2 * scale, backgroundColor: theme.rail }} />
      {Array.from({ length: TILE_COUNT }, (_, index) => (
        <Tile key={index} value={value} index={index} scale={scale} theme={theme} />
      ))}
    </View>
  );
}
