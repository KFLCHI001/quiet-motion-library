# Quiet Motion Library

Two original one-shot vector cues, one layered character scene, and one numeric-input field. The cues include editable SVG source, Lottie JSON, and complete static fallbacks. The scene shows how named SVG parts respond to several states. The field shows how a pure model can drive a browser or native renderer from the host app's number.

| Example | Use | Motion | Files |
| --- | --- | --- | --- |
| [Bookmark saved](assets/bookmark-kept/) | Small acknowledgment beside a host interface's successful save status | 5 frames at 30 fps (167 ms) | SVG source and still, Lottie JSON, color binder |
| [Review draft](assets/review-draft/) | Transition from a processing frame to a draft that needs human review | 9 frames at 30 fps (300 ms) | SVG source and still, Lottie JSON |
| [Character scene](examples/character-scene/) | Explore a five-state character and small pointer-linked depth scene | Interruptible state changes, quiet idle loop; optional six-second video render | Single layered SVG, browser controller, still poster, render script, MP4 test |
| [Signal field](examples/signal-field/) | Explore a generic numeric input with no health or product meaning | Direct, reversible changes to separate tiles | Pure model, browser control, still SVG, React Native sample, optional Lottie/dotLottie companions |

These examples are visual cues. The host application owns the state transition, wording, accessibility announcement, and next action. Show the saved cue only after a real save succeeds; show the draft cue only when the draft is actually ready. A partial or failed operation should use its own state. Motion must never block the next action or imply that content was verified.

## Preview and edit

From the repository root:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/preview/` for the one-shot cues, `http://127.0.0.1:8000/examples/character-scene/` for the character, or `http://127.0.0.1:8000/examples/signal-field/` for continuous input. The cue preview has Replay, Settled state, sample colors, and a Reduce Motion switch. It uses a local copy of `lottie-web` 5.13.0 with its [own MIT notice](preview/vendor/LICENSE.md). The examples use no CDN, account, or analytics.

The named groups in each `source.svg` are editable in a vector editor. `tools/build_library.py` defines matching geometry, colors, and keyframes; update both when changing the design, then regenerate the exports. The bookmark's raw Lottie uses placeholder colors. Bind it and its static SVG to the host theme's `accent` and `line` hex colors with [tokens.mjs](assets/bookmark-kept/tokens.mjs) before display.

The [character scene guide](examples/character-scene/README.md) explains its single SVG source, five-state controller, still fallback, optional MP4 render, and reproduction commands. The scene page needs the local HTTP server because it loads that SVG as editable DOM. Its optional [video test](examples/character-scene/video.html) starts only when a viewer presses Play. The video is a framed, opaque sample; it cannot substitute for interactive states.

The [signal field guide](examples/signal-field/README.md) explains its numeric model, browser and React Native renderers, static fallback, and optional host-scrubbed Lottie exports. Its [source and publication record](examples/signal-field/SOURCE-AND-PUBLICATION.md) names the factual Apple reference and the visual changes that keep this public example distinct. No private reference media was copied.

```sh
python tools/build_library.py
python tools/validate.py
node tools/token-bind.test.mjs
node examples/character-scene/motion.test.mjs
node examples/signal-field/build.mjs
python examples/signal-field/package_dotlottie.py
node examples/signal-field/model.test.mjs
```

For a new codebase, use the portable [Create app motion skill](skills/create-app-motion/SKILL.md). Copy that skill folder into your agent's skills directory, then ask it to adapt one real state or input in your app. It guides source inspection, route choice, original art, still and reduced motion behavior, and target-renderer checks. These examples are starting points, not universal interaction patterns. Browser playback and video decoding do not establish acceptance in a native renderer or on a device.

## Licensing and attribution

- `assets/**/*.svg`, `assets/**/*.lottie.json`, and `examples/character-scene/scene.svg`, `scene-poster.png`, and `scene-loop.mp4`: **Creative Commons Attribution 4.0 International (CC BY 4.0)**, © 2026 KFLCHI001. See [full CC BY 4.0 text](LICENSE-CC-BY-4.0.txt). Credit: “Quiet Motion Library artwork by KFLCHI001, CC BY 4.0,” link to this repository and the license, and indicate changes when applicable.
- `examples/signal-field/still.svg`, `signal-field.json`, and `signal-field.lottie`: **CC BY 4.0**, © 2026 KFLCHI001, with the same credit and change notice.
- `tools/`, `skills/`, `preview/index.html`, `assets/bookmark-kept/tokens.mjs`, `examples/character-scene/` HTML, JavaScript, Python and render requirements, `examples/signal-field/` HTML, JavaScript, JSX, Python and documentation, repository documentation, and configuration: **MIT**, © 2026 KFLCHI001. See [full MIT text](LICENSE-MIT.txt).
- `preview/vendor/lottie.min.js`: upstream **MIT** under its [separate notice](preview/vendor/LICENSE.md).

The [asset manifest](ASSET-MANIFEST.md) records provenance and intended meaning. No product logo, screenshot, private text, third-party source image, or downloaded community animation is included.
