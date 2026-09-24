# Quiet Motion Library

Two original vector motion examples for small, factual interface state changes. Each includes editable SVG source, one-shot Lottie JSON, and a complete static fallback. The [browser preview](preview/) lets you compare playback and settled states.

| Example | Use | Duration | Files |
| --- | --- | --- | --- |
| [Bookmark saved](assets/bookmark-kept/) | Small acknowledgment beside a host interface's successful save status | 5 frames at 30 fps (167 ms) | SVG source and still, Lottie JSON, color binder |
| [Review draft](assets/review-draft/) | Transition from a processing frame to a draft that needs human review | 9 frames at 30 fps (300 ms) | SVG source and still, Lottie JSON |

These examples are visual cues. The host application owns the state transition, wording, accessibility announcement, and next action. Show the saved cue only after a real save succeeds; show the draft cue only when the draft is actually ready. A partial or failed operation should use its own state. Motion must never block the next action or imply that content was verified.

## Preview and edit

From the repository root:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/preview/`. The preview has Replay, Settled state, sample colors for the bookmark, and a Reduce Motion switch. It uses a local copy of `lottie-web` 5.13.0 with its [own MIT notice](preview/vendor/LICENSE.md). It does not use a CDN, account, or analytics.

The named groups in each `source.svg` are editable in a vector editor. `tools/build_library.py` defines matching geometry, colors, and keyframes; update both when changing the design, then regenerate the exports. The bookmark's raw Lottie uses placeholder colors. Bind it and its static SVG to the host theme's `accent` and `line` hex colors with [tokens.mjs](assets/bookmark-kept/tokens.mjs) before display.

```sh
python tools/build_library.py
python tools/validate.py
node tools/token-bind.test.mjs
```

For a new codebase, see the portable [Create app motion skill](skills/create-app-motion/SKILL.md). It guides an agent through choosing a truthful state, authoring a small original animation, and checking the static and reduced motion experiences. The examples here are starting points, not universal interaction patterns. Browser playback does not establish acceptance in a native renderer or on a device.

## Licensing and attribution

- `assets/**/*.svg` and `assets/**/*.lottie.json`: **Creative Commons Attribution 4.0 International (CC BY 4.0)**, © 2026 KFLCHI001. See [full CC BY 4.0 text](LICENSE-CC-BY-4.0.txt). Credit: “Quiet Motion Library artwork by KFLCHI001, CC BY 4.0,” link to this repository and the license, and indicate changes when applicable.
- `tools/`, `skills/`, `preview/index.html`, `assets/bookmark-kept/tokens.mjs`, repository documentation, and configuration: **MIT**, © 2026 KFLCHI001. See [full MIT text](LICENSE-MIT.txt).
- `preview/vendor/lottie.min.js`: upstream **MIT** under its [separate notice](preview/vendor/LICENSE.md).

The [asset manifest](ASSET-MANIFEST.md) records provenance and intended meaning. No product logo, screenshot, private text, source image, or downloaded community animation is included.
