# Signal field

An original, generic demonstration of continuous input driving geometry, color, and a small motif. The input is a unit value from 0 to 1. It has no health, sentiment, or product meaning in this library.

## Integration contract

`signalField(value)` in `model.mjs` returns the same deterministic rectangles for the same input. It clamps nonfinite or out-of-range values and has no clock, storage, network, or telemetry. A host owns the actual input, label, value announcement, persistence decision, and meaning. Use `tiles` for the large view or `motif` for a smaller indicator. Do not treat the art as the sole status.

`index.html` is a browser proof with a keyboard and assistive-technology range input. The SVG is hidden from accessibility because the adjacent label and numeric value carry the meaning. `still.svg` is shown before JavaScript runs, on script failure, and as an asset fallback. Pointer updates are coalesced to one `requestAnimationFrame`; hidden pages request no new frames and repaint when visible. Reduced Motion removes the color transition; the field always settles directly to the selected value. There is no idle loop.

`react-native-example.jsx` maps the same model to core React Native `View`s. The demo's buttons and adjustable accessibility action change the number in 10% steps; replace those with the host app's real control. This uses React and React Native only, which matches the existing Expo app stacks that motivated the example. It has no bundled animation or UI dependency. Its `AppState` listener and Reduce Motion query are examples of lifecycle and accessibility handling. Since the view schedules no animation, it holds a complete still state when inactive or when Reduce Motion is enabled. No native build, device, screen-reader, or performance acceptance has been run for this adapter.

## Optional Lottie companion

`signal-field.json` and `signal-field.lottie` are generated from the model at inputs 0, 0.5, and 1. They are timeline samples, not a state machine. A host may scrub frames 0–120 from its own value (for example `frame = Math.round(value * 120)`), but should test the chosen renderer on a device before adopting them. [The local Lottie test page](lottie.html) uses the repository's licensed preview player. Intermediate timeline interpolation is an approximation of the direct model, not exact geometry parity. Reverse, interrupt, and hidden-screen behavior remain host responsibilities. The model/View route is the first choice for live input.

## Reproduce

From the repository root:

```sh
node examples/signal-field/build.mjs
python examples/signal-field/package_dotlottie.py
node examples/signal-field/model.test.mjs
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/examples/signal-field/`. The browser preview imports only local files. The static SVG and both Lottie formats are original outputs from `model.mjs`.
