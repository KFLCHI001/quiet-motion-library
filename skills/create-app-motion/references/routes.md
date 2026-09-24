# Choosing a motion route

Pick by the job, then by what the app already installs. A new runtime needs a reason that the installed ones cannot meet.

| Job | First route | Consider instead | Avoid |
| --- | --- | --- | --- |
| Tap feedback, transitions, sheets, progress, small success marks | The platform's animation library (React Native Reanimated, SwiftUI, Compose, CSS/WAAPI) | A one-shot Lottie only when a designer's authored path cannot be rebuilt simply | Video; state machines |
| Short authored illustration beat (onboarding, empty state) | Vector Lottie JSON plus settled SVG | dotLottie when you need bundled themes | Raster frame sequences presented as "Lottie" |
| Continuous value (slider, gesture, timer, level) | A pure, deterministic model driven by the host value, rendered natively | A scrubbed Lottie timeline only after testing interpolation in the target renderer | Rendered video; anything with its own clock |
| Paced cycle (breathing, pacing) | A pure phase model (0–1) that drives both the visual and haptics | — | Separate timers for visuals and haptics that can drift |
| Character or graphic with several interruptible states | Named layers (SVG/Skia) plus a small controller | dotLottie state machines or Rive, compared in a native build | One fixed clip per state stitched together |
| Cinematic scene | Video for marketing or one bounded, opaque placement with a poster | — | Using video for interactive state |

Renderer notes:

- Lottie on React Native: `lottie-react-native`, or Skottie through `@shopify/react-native-skia` if Skia is already installed. Effect support differs between renderers; verify the exact file in the exact renderer.
- dotLottie is a compressed container. Compression does not make raster frames scalable or editable.
- Rive and dotLottie state machines add an authoring tool and a native runtime. Check the current plan pricing and export terms before committing.
- A browser proof (`lottie-web`, `dotlottie-web`) establishes browser playback only.
