# Layered character scene

An original leaf-haired character and three landscape planes. The browser sample has five interruptible states: Idle, Look, Listen, Confirm, and Rest. It uses named SVG groups plus CSS and a small JavaScript controller. The optional six-second MP4 is a separate rendered loop of the same art; it has no interactive states.

## Try the browser rig

From the repository root, run `python -m http.server 8000 --bind 127.0.0.1` and open `http://127.0.0.1:8000/examples/character-scene/`. Choose a state; move a mouse or pen over the scene in Look mode. Confirm waves once. The Reduce Motion control makes each state settle immediately and turns off ambient motion and pointer depth. When the page is hidden, animation pauses.

`scene.svg` is the single art source. The page loads its named groups into the DOM so CSS can control them. If the load or script fails, the same SVG remains visible as a still and the state controls stay disabled. Opening `index.html` directly with `file://` may show only this still because browser fetch rules vary; use the local HTTP server for the interactive proof.

Run `node examples/character-scene/motion.test.mjs` from the repository root to check all five state selections, interruption of queued pointer motion, Reduce Motion behavior, hidden-page state, and the failed-load fallback. This is a controller test; inspect the page visually in a browser as well.

The browser controller is a demonstration. In a host app, map states to actual product events and use native text, controls, accessibility feedback, and lifecycle handling. Importing `scene.svg` as one image would not expose its named parts for state changes. Use grouped draw primitives, separately exported parts, or a suitable rig if the target renderer cannot address SVG groups.

## Render and test the optional video

The checked-in `scene-poster.png` and `scene-loop.mp4` are generated from `scene.svg` by `render_scene.py`. Rendering is optional. It requires Python with the versions in `requirements-render.txt` and FFmpeg on `PATH`:

```sh
python -m pip install -r examples/character-scene/requirements-render.txt
python examples/character-scene/render_scene.py
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate,nb_frames,pix_fmt -of json examples/character-scene/scene-loop.mp4
ffmpeg -v error -i examples/character-scene/scene-loop.mp4 -f null -
```

Open `http://127.0.0.1:8000/examples/character-scene/video.html` to test playback or looping manually. The file is 720×480 H.264/yuv420p, 24 fps, six seconds, and opaque. The script checks mathematical loop closure and reports decoded first/last frame differences. The poster remains available when video playback fails. A browser test and an FFmpeg decode do not establish playback, battery, memory, or loop quality in a native app.

## Tailor it

- Edit the named groups in `scene.svg`; keep group IDs used by `motion.js` or update the selectors together.
- Adjust poses and timings in `index.html` CSS, and state meaning, pointer limits, and cancellation in `motion.js`. Keep a readable still state and the next action available.
- Re-render the optional video after art changes. Its motion is procedural in `render_scene.py` and does not encode the five interactive poses.
- Preserve source and rights notes for any artwork or dependencies you add. This example uses no linked reference art, downloaded character, product mark, or external media.

The art and rendered media are [CC BY 4.0](../../LICENSE-CC-BY-4.0.txt); the HTML, JavaScript, Python, and this guide are [MIT](../../LICENSE-MIT.txt), all attributed to KFLCHI001. See the repository [asset manifest](../../ASSET-MANIFEST.md) for file scope and provenance.
