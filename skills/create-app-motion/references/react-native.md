# React Native recipes

These recipes assume `react-native-reanimated` 3 or later. Check `package.json` first and use the app's existing theme tokens and haptics wrapper.

## Reduce Motion

- For a one-shot tween, pass `reduceMotion: ReduceMotion.System` to `withTiming`/`withSpring`. The value jumps to its end, so the settled state still appears.
- For ambient or looping motion, read `useReducedMotion()` and do not start the loop at all.
- Never hide information behind motion. The still state must be complete.

## Lifecycle

Stop ambient loops when `AppState` is not `active`, and start them again when it returns. One-shot cues may still settle while backgrounded. The library's `native/useMotionPolicy.js` combines both signals as `{ foreground, ambient, tween }`.

## Continuous input on the UI thread

Put the visual model in plain functions with a `'worklet'` directive. Feed it a `SharedValue` from a gesture or the host's value, and compute each element in `useAnimatedStyle`. Keep the model free of clocks, storage, and network. Resolve and validate theme colors once, outside the worklet. Expo's Metro resolver does not include `.mjs` by default, so ship models as `.js` ES modules.

## Paced cycles and haptics

Drive the visual and the haptic pattern from the same phase source. Do not run a second timer for haptics. Stop both on interruption, backgrounding, and when the owning session ends. Make haptics independently switchable, and never let a cycle block the primary control.

## Interruption and undo

When the true state reverses (undo, failure, cancel), remove the success mark at once instead of playing it backwards. A retraction animation can read as a second success.

## Accessibility

Mark decorative motion `accessible={false}` with `importantForAccessibility="no-hide-descendants"`. The adjacent host text or control carries the label, value, and announcement. Use `accessibilityRole="adjustable"` with increment and decrement actions for continuous controls.

## What source checks cannot prove

A bundle, Babel worklet transform, or unit test proves syntax, imports, and model behavior. It does not prove frame rate, battery use, screen-reader order, or visual correctness. Record a development-build or TestFlight check on a device separately.
