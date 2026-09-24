---
name: create-app-motion
description: Adapt original, state-driven app motion to an existing codebase with a source model, accessible still state, and renderer-specific checks. Use for finite cues, interactive scenes, or continuous input; not for generic decoration or video production.
---

# Create app motion

Create motion that truthfully reflects an existing product state. The host app remains the source of truth; artwork is an optional presentation. Inspect the target codebase before choosing a visual or renderer.

1. Inspect the app's relevant control, state transition, theme roles, accessibility behavior, and existing feedback. Identify the exact success condition and any pending, partial, failed, stale, or revisit states. If the animation would duplicate useful feedback, shrink its role or omit it.
2. Write a brief with the cue's job, placement, trigger or numeric input, meaning limit, settled appearance, theme binding, and Reduce Motion behavior. Keep private or regulated content out of reusable art. If a reference app inspired the work, record its provenance and compare the public result for distinctive geometry, palette, copy, and flow before sharing.
3. Choose the smallest suitable route. A finite success cue can use a one-shot Lottie and settled SVG. A character with several interruptible states needs named layers and a controller. Continuous input should have a deterministic, renderer-independent model that the host can drive forward or backward. Use a timeline companion only when the target renderer can scrub it reliably; a rendered video cannot follow arbitrary input. In every route, provide a complete still presentation.
4. Keep labels, controls, announcements, haptics, and persistence in the host interface. Trigger a success cue only after the operation succeeds; drive continuous art from the current host value. Do not use animation completion as a prerequisite for navigation or the next action.
5. Preview the rendered motion and static asset. Check reduced motion, playback failure, replay, theme changes, rapid reversal or interruption, hidden-screen behavior, and accessibility order. For video, decode the complete file and inspect the loop seam and poster. Verify the native renderer and device separately when integrated; browser and source checks do not establish native acceptance.
6. Record original sources, any third-party dependencies, file-level licenses, and what the cue does and does not mean. Do not redistribute captured app visuals or other people's animations without rights.

Optional reference implementations in the [Quiet Motion Library](https://github.com/KFLCHI001/quiet-motion-library): `assets/` and `preview/` show finite cues; `examples/character-scene/` shows a multi-state SVG rig; `examples/signal-field/` shows a pure numeric model, browser control, optional Lottie companion, and Expo/React Native View adapter. This skill works without cloning those examples. Adapt the *method* to the target app; create artwork and copy that fit its own context and preserve its release permissions.
