# Asset use and provenance

The artwork was authored as simple vector geometry for this library. No stock image, captured interface, downloaded animation, logo, font, or third-party artwork was incorporated. The examples contain no user data.

| Asset | Visual and meaning | Source and fallback | Limit |
| --- | --- | --- | --- |
| `bookmark-kept` | One bookmark silhouette that settles beside a host interface's saved-state text | Named SVG group; 24×24 Lottie composition; settled SVG; runtime `accent` and `line` binding | Display only after a real successful save. Do not use it as the sole status or accessibility announcement. |
| `review-draft` | Frame, blank paper, placeholder lines, and folded corner | Named SVG groups; 240×240 Lottie composition; settled SVG | Indicates that a draft is ready for human review. It does not certify the contents or imply a save. |

The bookmark animation is 167 ms and the draft animation is 300 ms. Both play once. The complete settled SVG serves Reduce Motion, revisit, and playback failure. The host interface's actions remain available during motion.

## Rights record

- The SVG and Lottie art are original work attributed to KFLCHI001 and released under [CC BY 4.0](LICENSE-CC-BY-4.0.txt). The generic geometry draws on no copied source art.
- The generator, validator, token binder, preview page, and skill are attributed to KFLCHI001 and released under [MIT](LICENSE-MIT.txt).
- The vendored preview player is `lottie-web` 5.13.0. Its upstream [MIT notice](preview/vendor/LICENSE.md) applies to that file. It is preview tooling, not part of the artwork.

Product teams must verify the semantic trigger, theme colors, accessibility behavior, renderer support, and rights of any material they add when adapting these examples.
