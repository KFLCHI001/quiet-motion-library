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
- The generated still SVG contains the background, straight rail, and eleven separate tiles. The Lottie JSON has thirteen vector layers and no image assets. The dotLottie v2 ZIP has a manifest and the exact generated Lottie JSON. Sizes: still SVG 1,674 B; Lottie JSON 17,537 B; dotLottie 2,777 B. The browser Lottie page loaded and rendered thirteen paths without a script error.
- A local headless Chrome pass at desktop and 390-pixel width showed the browser artwork. Input 50 → 95 → 10 changed the first tile's height 129.42 → 199.81 → 66.61 pixels. Keyboard ArrowLeft changed 95 to 94. With JavaScript disabled, the still SVG remained visible. Reduced Motion removed the color transition. The hidden page schedules no new animation frame and the visibility handler repaints when visible; background lifecycle was inspected in source, not measured on a device.
- A local `dotlottie-web` 0.80 browser test loaded the generated dotLottie package and displayed distinct canvas pixels after frame scrubs to both ends. This establishes browser compatibility with that test runtime only. The test used a local harness; its unrelated labels and media were not copied into this repository.
- The public source and publication record compares the rendered example with the private local source-study storyboard and checks the flow against Apple's factual public State of Mind guide. The supplied private recording, its frames, and the local orb/flow artifacts are absent. The skill passed the `skill-creator` structural validator. Existing cue, token, and character behavior checks passed again.

The React Native adapter is a source sample. No Expo build, device interaction, screen-reader pass, native Lottie/dotLottie playback, native bundle-size measurement, or founder acceptance has been run. The Lottie companion is a three-sample approximation; the pure model is the exact live-input route.

A fresh independent read-only review found no concrete code, private-media, or licensing blocker in this addition. It confirmed that the new example, manifest, README, and portable skill must publish together so the public skill link resolves. Rights ownership and private-source exclusion remain documented author attestations; native acceptance remains open.
