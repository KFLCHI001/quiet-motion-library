# Playing transparent mascot loops

No single transparent video format plays everywhere. Export several with `tools/mascot/export.mjs` and pick per platform.

| Target | Format | Player | Notes |
| --- | --- | --- | --- |
| Chromium, Firefox | WebM VP9 with alpha | `<video>` | Some Chromium webviews decode alpha WebM but composite it blank; draw frames to a `<canvas>` if so. |
| Safari, iOS | HEVC with alpha (`.mov`, `hvc1`) | `<video>` / AVPlayer / `expo-video` | Encode on macOS (`hevc_videotoolbox` with `-alpha_quality`); libx265 in common Windows builds cannot encode alpha. ffmpeg on any platform can decode it for checks. |
| Android | Stacked-alpha H.264 MP4 (color top, alpha below) | A shader-based player, for example `expo-transparent-video` in Expo apps | Plays with standard hardware decoders; the player recombines the halves. |
| Any browser | Stacked-alpha MP4 | `tools/mascot/stacked-player.html` (canvas) | Portable fallback; costs CPU per frame, so keep it small. |
| React Native via vector | Lottie JSON | `lottie-react-native` or Skottie | Frame-swap Lottie from aligned stills; no video decoding. |

In an Expo app, branch on `Platform.OS`: HEVC-with-alpha through `expo-video` on iOS, and the stacked MP4 through a transparent-video component on Android. Bundle local files with `require()` or serve them from a CDN you control. Always keep a static poster (`*-poster.png`) for Reduce Motion, loading, and playback failure, and pause playback when the view is hidden.

Generated clips often carry an audio track even when the prompt asked for silence. The export tool drops audio; check other pipelines do too.

Verify the exact file in the exact player on a device before adoption. Browser playback proves browser playback only.
