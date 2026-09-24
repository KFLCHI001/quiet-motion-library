# Native adapters

React Native sources for apps that already install `react-native-reanimated` 3 or later. They add no animation runtime, SVG library, or Lottie player.

| File | Job |
| --- | --- |
| `KeptCue.jsx` | 167 ms one-shot mark beside host status text. Set `kept` only after a real save. Undo or failure removes it at once. `ReduceMotion.System` settles it immediately. |
| `SignalFieldReanimated.jsx` | The signal field driven by a `SharedValue` in 0–1, computed per tile on the UI thread from `examples/signal-field/model.js`. |
| `useMotionPolicy.js` | Combines Reduce Motion and `AppState` into `{ foreground, ambient, tween }`. Ambient loops run only in the foreground with motion allowed. |
| `motion-policy.js` | The pure decision behind the hook, tested in Node. |

All visuals are decorative (`accessible={false}`). The host keeps the label, value, announcement, haptics, and persistence. Pass colors from the host theme; do not hard-code the sample palette.

## What has been checked

`npm test` bundles these files with Expo's default Metro extensions and runs the policy test. Reanimated 4.5.1's `react-native-worklets/plugin` compiles the model's five functions and each animated style to worklets. No development build, device, frame-rate, or screen-reader check has run yet. Record one with the skill's [verification record](../skills/create-app-motion/references/verification-record.md) before adopting an adapter.

MIT, © 2026 KFLCHI001. See [LICENSE-MIT.txt](../LICENSE-MIT.txt).
