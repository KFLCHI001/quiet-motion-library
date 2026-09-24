# Questions to ask at each stage

Ask only the questions whose answers change what you do next, and offer a sensible default for each. Batch a stage's questions into one prompt. Confirm cost before every paid step.

## 1. Start

- Is there an existing character (upload or link), or are we creating one from a description?
- If creating: a working name, and a one-sentence description (species or form, mood, what it is for)?
- Is there a website, brand guide or existing app to take cues from?
- One character, or several at once?
- Budget cap for this session, and cheapest-model-first unless told otherwise?

## 2. Style

- Which style: flat, cartoon, kawaii or cute, pastel, soft 3D or clay, watercolor, sketch, line art, pixel art? Offer two or three that suit the brief and say which route each suits (flat → Lottie; soft 3D → video).
- Should it be a sibling of an existing character? If so, use that image as the style reference.
- Generate two variants per style and let the person pick before any animation spend.

## 3. Character card

Write the answers into [the character card](../templates/character.json) and reuse it in every prompt.

- Personality in three words, and what the character must never seem (for example scary, sarcastic, preachy).
- Brand colors to echo, and colors to avoid.
- Distinguishing details that must stay constant (markings, accessories, proportions).
- Anything the image cannot show but prompts should respect (audience, tone, cultural or religious sensitivities).
- Generate front, side and back angles now? They improve consistency across later poses (about one image each).

## 4. Action

For each action:

- Name (short, character-specific; suggest five to ten from the personality, such as a soft welcome, a contented sway, a curious side step).
- Kind: still pose, idle loop, or one-shot reaction?
- Pose-image prompt: the still the motion starts from.
- Animation prompt: only the motion wanted, ending with "nothing else appears or moves".
- Loop? If yes, the same image is used as first and last frame.
- Duration (shortest that reads; 4–5 s for idles) and quality tier (turbo first).
- Also make a transparent sticker from the pose?
- Show the estimated cost and remaining budget; ask to proceed.

## 5. Review

- Watch the contact sheet and the loop seam. Keep, re-roll once with a new seed and a prompt that omits the unwanted action, or change route?

## 6. Export

- Target platforms: web, iOS, Android, React Native/Expo, Flutter? This decides the formats.
- Display sizes (for example 480, 240 and 128 px) so each device downloads only what it needs.
- Bundle files in the app, or host them? Hosting needs a CDN you control and a plan for broken links.
- Is a static poster and a Reduce Motion behavior agreed for every placement?
