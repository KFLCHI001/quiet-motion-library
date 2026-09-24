# Routes and costs for generated mascot motion

Measured on 24 September 2026 with one original test character (a small lamb) in two styles, flat vector and soft clay. Prices change; check the vendor before spending.

## What was tried

| Attempt | Tool | Cost | Result |
| --- | --- | --- | --- |
| Reference stills, both styles | ChatGPT app image generation (paid plan), transparent background | $0 extra | Consistent character across styles from one follow-up prompt |
| Clay idle, 5s 480p | fal `minimax/h3-max-turbo/image-to-video`, first = last frame | ~$0.13 | Calm breathing, blink, head tilt; clean loop; 265 KB WebM after keying |
| Flat idle ×3 (three prompts, one new seed) | same | ~$0.39 | Every run added a sneeze with droplets; prompt changes did not remove it |
| Clay idle, square input | Google Flow (Veo), subscription credits | 10 credits | Square image stretched to 16:9 over the clip; loop broke |
| Clay idle, 16:9 padded input | same | 10 credits | Proportions held; first/last frame mean difference < 1/255; 550 KB WebM |
| Eyes-closed edit of flat still | OpenAI `gpt-image-2.5-sunburst` edit, medium | ~$0.02 | Aligned within 1 px of the original |
| Flat idle Lottie with blinks | local keyframes (`lottie-idle.mjs`) | $0 | 4s, 30 fps, clean loop; 506 KB with two embedded 512 px PNGs |
| Second character (a dove), designed by editing the lamb stills | OpenAI `gpt-image-2.5-sunburst` edit ×8 | ~$0.24 | First round read as chicks (head tuft, stubby body); naming dove anatomy (smooth crestless head, tapered wings and tail) fixed it |
| Dove clay idle, 5s 480p | fal H3 Max Turbo | ~$0.13 | Floating feathers appeared although the prompt said "no feathers falling" |
| Dove clay idle re-roll, seed 11 | same | ~$0.13 | Prompt described only breathing and a blink, "nothing else appears"; clean loop |
| Dove flat Lottie with blinks | local keyframes | ~$0.02 edit | 4s, 302 KB; blink frame aligned within 1 px |

## Free and included allowances

- ChatGPT and Gemini/Flow subscriptions include image and video generation with unpublished or credit-based limits; outputs must be downloaded by hand and prompts are not recorded automatically.
- fal's MiniMax H3 Max offered five free generations a day for signed-in users, but the free runs were text-to-video only. Reference-image animation used paid turbo runs.
- Google AI Pro listed 1,000 monthly credits; one Veo 3.1 Lite clip cost 10.

## Recommendation

- **Easiest good result:** image-to-video on a padded chroma frame with first = last frame, turbo tier first. Works best for soft 3D styles.
- **Cheapest practical:** frame-swap Lottie from aligned image edits. Best for flat styles and gentle idles; about two cents per extra expression.
- **Cheapest outright:** subscription image generation plus local Lottie keyframes; costs nothing extra but every image is a manual download.
- **For 10–20 screens:** do not animate each screen with whole-image swaps or separate video clips. Build the character once as named parts (head, ears, eye and mouth states, body, legs, tail), vectorize them, rig once (layered SVG/Skia, Rive, or dotLottie), and reuse the rig. Expect under $5 of image generation plus rigging time; files drop to tens of kilobytes.

## Sources

- fal H3 Max pricing and free tier: https://fal.ai/minimax-h3-max
- fal H3 Max Turbo image-to-video API: https://fal.ai/models/minimax/h3-max-turbo/image-to-video/api
- OpenAI GPT Image 2.5: https://developers.openai.com/api/docs/models/gpt-image-2.5-flare
- Google AI plans: https://gemini.google/subscriptions/
