# Prompt patterns

Patterns that keep one character consistent from concept to animated action. Fill the placeholders from the [character card](../templates/character.json).

## 1. Ideas from a purpose

Ask what the mascot is for, then propose six distinct concepts before any image spend:

> Suggest six different mascot concepts for {purpose}. For each: a one- or two-word name, the creature or object, one sentence on appearance with one distinctive color detail, and one small signature behavior that fits the product. Vary the species; avoid clichés the audience would find cheap.

A good concept reads like: *a soft white dove with a pale gold breast marking and folded wings; it closes its eyes for one quiet breath before each reading.* The signature behavior later becomes the first action.

## 2. Description refinement as a suggestion

Rewrite the description to be more specific about silhouette, materials and one signature behavior, **without changing the character or the chosen style**. Show the result beside the original with *use* and *try another*; never overwrite silently.

## 3. First image

> {description} {style descriptor}. Full body, standing, three-quarter view, centered with generous padding, on a flat solid {background} background. No text, no props unless described.

Pick {background} as a color that is absent from the character (blue or green for a white or cream character, magenta for a green one). A flat contrasting ground mattes cleanly for stills and doubles as the chroma key for video. Generate at least two candidates and let the person choose; offer an edit pass on the chosen one.

## 4. Character card extraction

From the chosen image, record a style card: species or form, proportions, materials and finish, the four or five dominant colors (hex), and the details that must never change. Append those details to every later prompt as a **preservation clause**:

> … while preserving the {constant 1}, {constant 2}, {constant 3} and {constant 4}.

## 5. Angles

Generate side profile, back and three-quarter back views from the front reference, each with the preservation clause. Check them: models often return a near-copy of the front for side and three-quarter views. Keep only views that genuinely show the new angle.

## 6. Action suggestions

> Suggest six short action names (two or three words) for {name}, who is {personality}. Favor small, characterful motions that suit {purpose}; include at least one idle and one greeting.

Refresh for more. For each chosen action write a pair:

- **Pose-image prompt:** `{name} {pose, gesture and expression} while preserving {constants}.`
- **Animation prompt:** `{motion verbs, one or two beats}, then ease back to the {starting} pose.` Loop on by default. Describe only wanted motion; add "nothing else appears or moves" for video models prone to inventing effects.

## 7. Cost prompt

Before every paid call, state the item count, unit cost, total and remaining budget, and wait for a yes. Batching several actions into one confirmation is fine.
