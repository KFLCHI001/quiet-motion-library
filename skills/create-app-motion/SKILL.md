---
name: create-app-motion
description: Design and verify a small original vector animation for a real state change in an existing app, with an editable source and complete static fallback. Use when adapting motion to a codebase; not for generic decoration or video production.
---

# Create app motion

Create a small motion asset that truthfully reflects an existing product state. The app remains the source of truth; the animation is an optional presentation of that state.

1. Inspect the app's relevant control, state transition, theme roles, accessibility behavior, and existing feedback. Identify the exact success condition and any pending, partial, failed, stale, or revisit states. If the animation would duplicate useful feedback, shrink its role or omit it.
2. Write a brief with the cue's job, placement, trigger, meaning limit, motion duration, settled appearance, theme binding, and Reduce Motion behavior. Keep private or regulated content out of reusable art.
3. Author original vector geometry in named, editable SVG groups. For a finite cue, export one-shot Lottie JSON and a settled SVG from the same geometry. For a character with several interruptible states, keep one layered source and an explicit state controller. A rendered video is useful only when interaction is unnecessary. In every route, provide a complete still presentation.
4. Keep labels, controls, announcements, haptics, and persistence in the host interface. Animate only after the current operation has actually reached the brief's successful state. Do not use animation completion as a prerequisite for navigation or the next action.
5. Preview the rendered motion and static asset. Check reduced motion, playback failure, replay, theme changes, interruption, hidden-page behavior, and accessibility order. For video, decode the complete file and inspect the loop seam and poster. Verify the native renderer and device separately when integrated; a browser preview establishes only browser behavior.
6. Record original sources, any third-party dependencies, file-level licenses, and what the cue does and does not mean. Do not redistribute captured app visuals or other people's animations without rights.

This repository's `assets/`, `tools/`, and `preview/` show finite cues. `examples/character-scene/` shows a multi-state SVG rig and a separately rendered loop. Adapt their geometry and timing to the target app; preserve its existing product and release permissions.
