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
