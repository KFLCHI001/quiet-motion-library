# Verification

Checked on 24 September 2026, before the first public commit:

- `python tools/build_library.py` regenerated both vector exports.
- `python tools/validate.py` passed: valid SVG and Lottie structure, one-shot timing, final-frame geometry parity, no image assets, and a local licensed preview player.
- `node tools/token-bind.test.mjs` passed: light and dark colors, unchanged raw template, static/Lottie color parity, and invalid-color rejection.
- The browser preview displayed both settled designs after one playback. Its Reduce Motion switch showed the complete static fallbacks. The bookmark appeared as a small inline mark beside saved-state text.
- The portable skill passed the skill-creator `quick_validate.py` structural check.

These checks prove the included browser example and exports. A host app still needs its own semantic trigger, renderer, accessibility, device, and product acceptance checks.

## Character scene addition

- `node --check examples/character-scene/motion.js` and `node examples/character-scene/motion.test.mjs` passed. The behavior test exercised all five selections, queued pointer cancellation, reduced motion, hidden-page state, and static fallback after a failed SVG load.
- `python -m py_compile examples/character-scene/render_scene.py` passed. Rendering with locally installed CairoSVG 2.9.0, Pillow 12.2.0, and FFmpeg 8.1.1 produced stable SHA-256 hashes on a second run. The source loop closed exactly; source last-to-first mean RGB difference was 0.063/255 and encoded last-to-first difference was 0.421/255. These numbers do not prove a perceptually seamless loop.
- `ffprobe` reported H.264/yuv420p, 720×480, 24 fps, 144 frames, six seconds, 79,933 bytes. `ffmpeg` decoded the whole file without error. The local HTTP server returned the scene page, controller, SVG, video test page, and MP4 with expected content types.
- A fresh visual browser pass of the revised interactive page and manual MP4 replay remains open because the browser control surface was unavailable during this addition. The prior source lab had a browser proof, but its in-app browser crashed on a video replay. Native playback, looping, and device performance remain unverified.

## Signal field and portable skill update

- `node examples/signal-field/build.mjs`, `python examples/signal-field/package_dotlottie.py`, and `node examples/signal-field/model.test.mjs` passed. The model test covered clamping, nonfinite input, deterministic output, and reversal. `node --check` passed for the JavaScript modules; Python compilation and JSX parsing passed for the packaging and React Native sample.
- The generated still SVG contains the background, straight rail, and eleven separate tiles. The Lottie JSON has thirteen vector layers and no image assets. The dotLottie v2 ZIP has a manifest and the exact generated Lottie JSON, stored uncompressed so the package is byte-identical across zlib builds. Sizes: still SVG 1,674 B; Lottie JSON 17,537 B; dotLottie 17,866 B. The browser Lottie page loaded and rendered thirteen paths without a script error.
- A local headless Chrome pass at desktop and 390-pixel width showed the browser artwork. Input 50 → 95 → 10 changed the first tile's height 129.42 → 199.81 → 66.61 pixels. Keyboard ArrowLeft changed 95 to 94. With JavaScript disabled, the still SVG remained visible. Reduced Motion removed the color transition. The hidden page schedules no new animation frame and the visibility handler repaints when visible; background lifecycle was inspected in source, not measured on a device.
- A local `dotlottie-web` 0.80 browser test loaded the generated dotLottie package and displayed distinct canvas pixels after frame scrubs to both ends. This establishes browser compatibility with that test runtime only. The test used a local harness; its unrelated labels and media were not copied into this repository.
- The public source and publication record compares the rendered example with the private local source-study storyboard and checks the flow against Apple's factual public State of Mind guide. The supplied private recording, its frames, and the local orb/flow artifacts are absent. The skill passed the `skill-creator` structural validator. Existing cue, token, and character behavior checks passed again.

The React Native adapter is a source sample. No Expo build, device interaction, screen-reader pass, native Lottie/dotLottie playback, native bundle-size measurement, or founder acceptance has been run. The Lottie companion is a three-sample approximation; the pure model is the exact live-input route.

A fresh independent read-only review found no concrete code, private-media, or licensing blocker in this addition. It confirmed that the new example, manifest, README, and portable skill must publish together so the public skill link resolves. Rights ownership and private-source exclusion remain documented author attestations; native acceptance remains open.

## Native layer, reproducibility and skill update

Checked on 24 September 2026 on Windows 11, Node 24.15.0, Python 3.14.

- **Metro fix.** Expo's default Metro `sourceExts` in a private Expo app checkout are `js, jsx, json, ts, tsx`. The React Native sample's `import './model.mjs'` would therefore not resolve. The model is now `model.js`, with a root `package.json` setting `"type": "module"`. The regenerated Lottie JSON, still SVG, and dotLottie were byte-identical after the change.
- **Theme input.** `signalField(value, theme)` and `resolveTheme()` added. Tests cover custom colors, geometry unchanged by theme, invalid-color rejection, and single-tile parity.
- **Native adapters.** `native/KeptCue.jsx`, `native/SignalFieldReanimated.jsx`, `native/useMotionPolicy.js`. `tools/check-native.mjs` bundled all four React Native entries with esbuild 0.25 using Metro-style extensions. Babel with `babel-preset-expo` and `react-native-worklets/plugin` from a private Expo app checkout (Reanimated 4.5.1) produced 5 worklets in `model.js` and 1 in each adapter. `native/motion-policy.test.mjs` passed.
- **Reproducible build.** `tools/build_library.py` wrote CRLF on Windows, so exports differed from the committed LF files. It now writes with `newline=""`. `npm run build` followed by `git diff` showed no export changes. `.github/workflows/check.yml` repeats that diff and runs `npm test` on every push to `main` and every pull request. The workflow has not yet run on GitHub.
- **Character scene browser pass** (Claude desktop browser pane, local `http.server`). All five states selected and updated the status text. Look followed the pointer. Reduce Motion left 0 running animations after selecting Confirm. At 375 px width the page had no horizontal scroll. No console errors. **Defect found and fixed:** `button:hover:not(:disabled)` outranked `button[aria-pressed="true"]`, so a selected button under the pointer showed a pale fill with white text and an unreadable label. After the fix the hovered selected button computed `rgb(47, 99, 82)` with white text. `motion.test.mjs` passed again.
- **Signal field after the rename.** The browser served `preview.mjs` and `model.js` with HTTP 200, the still SVG remained visible, and the imported model returned first-tile heights 129.42, 199.81 and 66.61 for inputs 0.5, 0.95 and 0.1. Those match Node and the original pass. Live redraw was not observed because the hidden pane issues no animation frames.
- **MP4 replay: still not verified.** The pane reported `document.hidden: true` and kept the video paused at 0.00 s after `play()`. An earlier attempt reported 148 decoded frames and 0 dropped, but it did not show continuous playback or the loop seam. A visible browser or device pass remains open.
- **Skill.** `create-app-motion` now opens with a gate that names the interaction first. It adds `references/routes.md`, `references/react-native.md`, `references/verification-record.md`, and four `evals/evals.json` cases. skill-creator's `quick_validate.py` passed. The evals have not yet been run against a model.

Still open: native development-build and device runs of every adapter and Lottie file (Skottie, `lottie-react-native`); screen-reader order; MP4 replay in a visible browser; the first GitHub Actions run.

## Paced cycle, stage step and quiet policy

- `models/paced-cycle.js`: `pacedPattern`, `pacedPhase` (level 0–1 from elapsed ms, with optional holds) and `pacedEvents` (segment starts crossed between two times, capped so a resume after backgrounding yields at most one cue). `models/stage-step.js`: `stageSet`, `stagePose`, `focusScale` and `settleIndex`, for continuous, interruptible stage browsing. `models/models.test.mjs` passed. It covers boundaries, holds, determinism, single-fire crossings, an hour-long gap and exhale-at-peak alignment.
- `native/usePacedCycle.js` computes both the level and the cues in one `useFrameCallback`. Under Reanimated 4.5.1's worklet plugin, `paced-cycle.js` compiled to 3 worklets and `stage-step.js` to 3. A missing `'worklet'` on `pacedEvents` was caught and fixed before commit. It would have failed on the UI thread.
- `motionPolicy` gained `quiet` (removes ambient and `celebrate`, keeps `tween`) and `celebrate`. Tests passed.
- Browser behaviour was measured in a private consuming app, which uses these models. In real-time headless Edge, cue events coincided with ring minima and maxima (0.850 and 1.600) at 8, 4,017 and 8,001 ms. Native and device runs have not been done.
