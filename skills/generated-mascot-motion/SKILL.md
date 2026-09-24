---
name: generated-mascot-motion
description: Produce looping idle motion for an AI-generated mascot still, choosing between an easy AI-video route (image-to-video on a chroma background, keyed to transparent WebM) and a cheapest-practical Lottie route (image-edit frame swaps plus keyframed transforms). Use when a team has a mascot image and wants low-cost idle or reaction loops to evaluate; not for interactive multi-state characters (see create-app-motion) or for deciding where a mascot belongs in a product.
---

# Generated mascot motion

Turn one approved mascot still into short, seamless loops cheaply, record what each attempt cost, and keep the result reproducible. This is an evaluation workflow: it produces candidates for a person to judge, not shippable product decisions.

## Gate: character and placement

Before generating anything, confirm in one sentence who approved the character concept and what the loops are for (marketing test, design review, a named screen). If the request is "add a mascot to the app", stop and ask for the product decision first. Keep every run inside a stated budget and log it.

## Choose a route

Read [routes and costs](references/routes-and-costs.md). In short:

| Route | Best for | Typical cost per loop | Trade-off |
| --- | --- | --- | --- |
| **Easy: image-to-video** | Soft 3D / clay / painterly styles, organic motion | ~$0.13 (5s, 480p turbo model) or subscription credits | Model may invent actions (sneezes, mouths, particles); raster; 250–550 KB WebM |
| **Cheapest practical: frame-swap Lottie** | Flat / vector styles, gentle idles with blinks | ~$0.02 for one image edit; transforms are free | No true limb or ear motion; embedded rasters make 170–500 KB JSON |
| Rigged vector (later) | Many screens, many states, smallest files | Parts generation <$5, plus rigging time | Needs part separation, vectorizing and a rig (SVG/Skia, Rive or dotLottie) |

Start with the cheapest model tier and escalate only after a person rejects the output.

## Easy route: image-to-video loop

1. Get a transparent PNG/WebP of the mascot (an image model with transparent-background output avoids a matting step).
2. Composite it on a flat chroma green (`#00B140`) **at the output aspect ratio**. Video models stretch a square image to fill 16:9, so pad instead:
   `ffmpeg -f lavfi -i color=c=0x00B140:s=1280x720 -i mascot.png -filter_complex "[1]scale=-1:680[m];[0][m]overlay=(W-w)/2:(H-h)/2:format=auto" -frames:v 1 mascot-green.png`
3. Generate with the **same image as first and last frame** so the clip closes as a loop: `node tools/mascot/idle-loop.mjs mascot-green.png out.mp4 "<prompt>"` (fal queue API; needs `FAL_KEY`). Prompt for small, calm actions and describe only what should happen, ending with "nothing else appears or moves", a static camera and an unchanged background. Naming an unwanted action ("no sneezing", "no feathers") can prime the model to add it.
4. Key and encode: `ffmpeg -i out.mp4 -vf "chromakey=0x00B140:0.13:0.06,despill=type=green" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 32 -an out.webm`. Crop pillarboxing first if the model added it.
5. Check: a contact sheet over a dark background (fringe), first-versus-last frame difference (loop seam), and every invented action. If an invented action appears, re-roll once with a new seed and a prompt that omits the action entirely; if it persists, change the image or route.

Transparent WebM does not display reliably everywhere: some Chromium-based webviews decode the frames but composite the video blank. For review pages, draw frames to a `<canvas>` with `drawImage` on each animation frame. For iOS alpha video, WebM is not native; plan HEVC-with-alpha (encode on macOS), a PNG sequence, or the Lottie route.

## Cheapest practical route: frame-swap Lottie

1. Start from the transparent still, downscaled to the display size (512 px is plenty for most screens).
2. Make each expression change as an **edit of the same image** (for example eyes closed) so the frames align. `node tools/mascot/edit-frame.mjs mascot.png blink.png "<edit prompt>"` (OpenAI images edit; needs `OPENAI_API_KEY`). Verify alignment by comparing alpha bounding boxes; within 1–2 px is fine.
3. Build: `node tools/mascot/lottie-idle.mjs mascot.png idle.json 512 blink.png`. Breathing, a slight bob and a small tilt are keyframed; the blink layer is shown for four frames twice per loop with hold keyframes.
4. Preview in `lottie-web`, seek to a blink frame, and check file size. Compress the PNGs before embedding if size matters.

## Record

Keep a spend ledger beside the outputs (date, item, model, cost) and a contact sheet per attempt. Note rights for every source image. Browser playback proves browser playback only; test the exact file in the target renderer and on a device before adoption, with a static fallback and Reduce Motion behavior.
