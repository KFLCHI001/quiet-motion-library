---
name: create-app-motion
description: Adapt original, state-driven app motion to an existing codebase with a source model, accessible still state, and renderer-specific checks. Use for a named app interaction that needs a finite cue, an interactive scene, or continuous input; not for generic decoration, marketing video, or motion with no product state behind it.
---

# Create app motion

Create motion that truthfully reflects an existing product state. The host app remains the source of truth; artwork is an optional presentation. Inspect the target codebase before choosing a visual or renderer.

## Gate: name the interaction first

Before any design or asset work, write one sentence naming the exact interaction: the screen, the user action or value, and the true state the motion reflects. Example: "On the packing list, when an item's state changes to packed, a mark settles beside its label; undo removes it at once."

Stop and ask instead of proceeding when the request is only "make it feel alive", "add a mascot", or "animate the app", or when the feature is not in the app's current release scope. Say that no motion is the right answer when existing feedback already does the job.

## Steps

1. Inspect the app's relevant control, state transition, theme roles, accessibility behavior, installed motion libraries, and existing feedback. Identify the exact success condition and any pending, partial, failed, stale, undo, or revisit states. If the animation would duplicate useful feedback, shrink its role or omit it.
2. Write a brief with the cue's job, placement, trigger or numeric input, meaning limit, settled appearance, theme binding, and Reduce Motion behavior. Keep private or regulated content out of reusable art. If a reference app inspired the work, record its provenance and compare the public result for distinctive geometry, palette, copy, and flow before sharing.
3. Choose the smallest suitable route with [the route table](references/routes.md). Prefer libraries the app already installs. In every route, provide a complete still presentation.
4. Keep labels, controls, announcements, haptics, and persistence in the host interface. Trigger a success cue only after the operation succeeds; drive continuous art from the current host value. Do not use animation completion as a prerequisite for navigation or the next action. For React Native, follow [the recipes](references/react-native.md).
5. Preview the rendered motion and static asset. Check reduced motion, playback failure, replay, theme changes, rapid reversal or interruption, hidden-screen behavior, and accessibility order. For video, decode the complete file and inspect the loop seam and poster. Verify the native renderer and device separately when integrated; browser and source checks do not establish native acceptance.
6. Record the result with [the verification record](references/verification-record.md): sources and rights, exact workflow and settings, cost, editable source, preview, static fallback, file sizes, and exactly where it was tested. Do not redistribute captured app visuals or other people's animations without rights.

Optional reference implementations in the [Quiet Motion Library](https://github.com/KFLCHI001/quiet-motion-library): `assets/` and `preview/` show finite cues; `examples/character-scene/` shows a multi-state SVG rig; `examples/signal-field/` shows a pure numeric model; `native/` shows Reanimated adapters and a motion-policy hook. This skill works without cloning those examples. Adapt the *method* to the target app; create artwork and copy that fit its own context and preserve its release permissions.
