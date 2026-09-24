// Copy this adapter into an Expo/React Native app, or map the pure model to its renderer.
// It uses only React and React Native; the host provides its real numeric input.
import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, AppState, Pressable, Text, View } from 'react-native';
import { HEIGHT, WIDTH, signalField } from './model.js';

export function SignalFieldView({ value, size = 300, active = true }) {
  const [settledValue, setSettledValue] = useState(value);
  useEffect(() => { if (active) setSettledValue(value); }, [active, value]);
  const field = signalField(active ? value : settledValue);
  const scale = size / WIDTH;
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants"
      style={{ width: size, height: HEIGHT * scale, backgroundColor: field.background, overflow: 'hidden' }}>
      <View style={{ position: 'absolute', left: 39 * scale, top: 150 * scale, width: 442 * scale, height: 2 * scale, backgroundColor: field.rail }} />
      {field.tiles.map((tile, index) => (
        <View key={index} style={{ position: 'absolute', left: (tile.x - tile.width / 2) * scale,
          top: (tile.y - tile.height / 2) * scale, width: tile.width * scale,
          height: tile.height * scale, borderRadius: 3 * scale, backgroundColor: tile.color,
          transform: [{ rotate: `${tile.rotation}deg` }] }} />
      ))}
    </View>
  );
}

export function SignalFieldDemo() {
  const [value, setValue] = useState(0.5);
  const [foreground, setForeground] = useState(AppState.currentState !== 'background' && AppState.currentState !== 'inactive');
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const app = AppState.addEventListener('change', (next) => setForeground(next === 'active'));
    AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);
    const motion = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducedMotion);
    return () => { app.remove(); motion.remove(); };
  }, []);
  const adjust = (delta) => setValue((previous) => Math.max(0, Math.min(1, Math.round((previous + delta) * 10) / 10)));
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text>Signal level: {Math.round(value * 100)}</Text>
      <View accessible accessibilityRole="adjustable" accessibilityLabel="Signal level"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'increment') adjust(0.1);
          if (event.nativeEvent.actionName === 'decrement') adjust(-0.1);
        }}>
        <SignalFieldView value={value} active={foreground} />
      </View>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Pressable accessibilityRole="button" onPress={() => adjust(-0.1)}><Text>Decrease</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={() => adjust(0.1)}><Text>Increase</Text></Pressable>
      </View>
      <Text>{reducedMotion ? 'Still state' : 'Input-driven state'}; {foreground ? 'active' : 'paused'}.</Text>
    </View>
  );
}
