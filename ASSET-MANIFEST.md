# Asset use and provenance

The artwork was authored as simple vector geometry for this library. No stock image, captured interface, downloaded animation, logo, font, or third-party artwork was incorporated. The examples contain no user data.

| Asset | Visual and meaning | Source and fallback | Limit |
| --- | --- | --- | --- |
| `bookmark-kept` | One bookmark silhouette that settles beside a host interface's saved-state text | Named SVG group; 24×24 Lottie composition; settled SVG; runtime `accent` and `line` binding | Display only after a real successful save. Do not use it as the sole status or accessibility announcement. |
| `review-draft` | Frame, blank paper, placeholder lines, and folded corner | Named SVG groups; 240×240 Lottie composition; settled SVG | Indicates that a draft is ready for human review. It does not certify the contents or imply a save. |
| `character-scene` | Original leaf-haired character in a three-plane landscape, with idle, look, listen, confirm, and rest states | One named-layer SVG; browser state controller; SVG still fallback; poster and optional local MP4 render | An interaction technique sample. Its expressions and loop carry no product claim. Do not treat browser or decoder checks as native acceptance. |
| `signal-field` | Eleven separate angled tiles along a straight rail respond to a generic unit value | Original pure geometry model; browser and React Native View adapters; generated still SVG; optional Lottie JSON and dotLottie package | No health or sentiment meaning. The host owns the input, accessible label, and any status. Companion timelines are approximate and require renderer testing. |

The bookmark animation is 167 ms and the draft animation is 300 ms. Both play once. The complete settled SVG serves Reduce Motion, revisit, and playback failure. The host interface's actions remain available during motion.

## Rights record

- The SVG and Lottie art, character SVG, poster, and rendered MP4 are original work attributed to KFLCHI001 and released under [CC BY 4.0](LICENSE-CC-BY-4.0.txt). The character and landscape were adapted from an original local motion study; no linked reference art, product mark, or external media was copied. The poster and MP4 derive from the same SVG.
- The signal field's generated SVG, Lottie JSON, and dotLottie package are original tile geometry attributed to KFLCHI001 and released under CC BY 4.0. Its [source record](examples/signal-field/SOURCE-AND-PUBLICATION.md) documents the Apple reference, distinct public design, and exclusion of private media.
- The generator, validator, token binder, preview and scene pages, scene controller and render script, and skill are attributed to KFLCHI001 and released under [MIT](LICENSE-MIT.txt).
- The vendored preview player is `lottie-web` 5.13.0. Its upstream [MIT notice](preview/vendor/LICENSE.md) applies to that file. It is preview tooling, not part of the artwork.

Product teams must verify the semantic trigger, theme colors, accessibility behavior, renderer support, and rights of any material they add when adapting these examples.
