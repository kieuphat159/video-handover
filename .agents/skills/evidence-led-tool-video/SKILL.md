---
name: evidence-led-tool-video
description: Create evidence-led Vietnamese vertical videos about repositories and software tools using authentic screenshots, a six-beat documentary narrative, sentence-segmented voiceover with real pauses, and balanced technical claims. Use when a user wants a repo/tool explainer that should avoid repetitive FOMO, star-count, or paradigm-shift formulas.
---

# Evidence-led Tool Video

Create a polished repo or tool explainer that earns attention through a real question, visible product evidence, and a clear technical mental model. Do not default to star counters, creator prestige, “thời đại X đã hết”, exaggerated multipliers, or the standard five-scene FOMO arc.

Follow repository-level `AGENTS.md` instructions first. Preserve user choices about duration, tone, voice, and publishing.

## Outcome

Deliver a 1080×1920 Remotion composition with:

- a coherent documentary-style story rather than a feature list;
- at least one genuine screenshot from the official repository or documentation;
- Vietnamese text rendered with a locally bundled font that fully supports diacritics;
- voiceover split at sentence boundaries, with silence placed explicitly on the timeline;
- caption JSON aligned to the actual audio clips and silent gaps;
- claims traceable to primary sources;
- a verified H.264/AAC render when the user asks for a finished video.

Publishing is a separate authorization boundary. Only upload or post when the user explicitly asks. When publishing is authorized in this repository, use the existing three-platform publishing workflow and verify every post reaches a terminal status.

## Research and asset provenance

Before researching the topic, audit `src/videos/`, `src/Composition.tsx`, and the voiceover config list to prevent duplicates.

Use the official repository, README, docs, releases, source tree, and official website as primary sources. Separate shipped functionality from beta, planned, PRO-only, or platform-specific behavior. Avoid unsupported benchmarks and inferred claims.

Download authentic UI evidence into:

```text
public/videos/<slug>/assets/screenshot.png
```

Additional official images may use descriptive names such as `summary.png`, `settings.png`, or `architecture.png`. Record provenance in code labels or production notes. Never generate fake application interfaces with an image model. Code-rendered diagrams may explain a workflow but cannot replace the real screenshot.

## Narrative beats

Use this sequence as a strong default, adapting it when the topic needs a different emphasis:

1. **The question** — open with a concrete user concern or unresolved consequence.
2. **The boundary** — reveal the product’s governing principle or constraint.
3. **The listener** — show the real interface performing the core action.
4. **Inside the box** — explain the architecture or processing path in plain language.
5. **The outcome** — show the useful artifact produced for the user.
6. **The verdict** — state the real value and tradeoff (no CTA of your own).
7. **Closing CTA (mandatory, last)** — the shared `BrandCtaScene` from `src/videos/shared/BrandCtaScene.tsx` (no props; brand name/handle come from `src/brand.ts`).

Beats may span several scenes; there is no scene-count limit.

The hook should create curiosity without inventing urgency. The verdict should sound credible even to a skeptical technical viewer. Prefer “đây là quyền chọn ranh giới dữ liệu” over “cỗ máy 100x”.

## Voiceover with real sentence cadence

Use the repository’s approved ZeroTTS voice unless the user chooses another voice. Do not synthesize a whole scene as one continuous audio file when sentence cadence matters.

1. Split each visual scene into individual spoken sentences.
2. Give every sentence a stable ID grouped by scene, for example `03a-listen`, `03b-listen`, `03c-listen`.
3. Generate each sentence as a separate MP3.
4. Measure every clip with ffprobe; never estimate final timing from word count.
5. Place clips using Remotion `<Sequence>` elements and explicit `from` frames.
6. At 30 fps, start with 10–14 silent frames between sentences. Use a longer gap after a question or major reveal when it improves comprehension.
7. Account for transition overlap. The scene tail must be at least `transitionFrames + desiredPauseFrames`; otherwise the visual transition silently removes the intended audio pause.
8. Do not increase playback speed merely to hit a duration target.

Premount audio sequences. Keep the gap genuinely empty—do not stretch the preceding waveform or leave the next caption visible during silence.

Validate the result with FFmpeg `silencedetect`. For this narration style, detected pauses around 0.4–0.7 seconds generally feel deliberate without becoming sluggish; adjust by listening and by sentence function rather than enforcing one universal value.

## Caption timing

Store captions in `public/videos/<slug>/captions.json` using the Remotion `Caption` shape:

```json
{"text":"Một câu có dấu.","startMs":0,"endMs":1800,"timestampMs":null,"confidence":null,"pageBreakAfter":true}
```

Use the actual absolute start and end of each sentence clip. Leave the silent interval absent from the caption timeline. Recalculate downstream caption timestamps whenever a scene duration, transition, clip, or pause changes.

Keep caption cards above platform controls, with a generous right margin. Vietnamese must retain proper diacritics in source JSON and rendered output.

## Vietnamese typography

Bundle an open-source Vietnamese font locally rather than relying on the renderer’s system fonts. Be Vietnam Pro is a suitable default. Include the weights the design actually uses and define them with `@font-face`.

Apply the bundled family to the scene root and caption layer. Map heavy CSS weights to a real bundled heavy face; avoid accidental browser synthesis. Render a half-scale QA still containing difficult glyphs such as `ă â ê ô ơ ư đ` and stacked diacritics before the full export.

If CSS is bundled by Remotion, use a path that the bundler can resolve. Confirm success with an actual still render; lint alone cannot detect a broken font URL.

## Visual language

Use a centered editorial layout with equal left and right margins. Build each frame around one dominant idea. Real screenshots should be tall enough to remain legible in 9:16 and may use restrained pan or zoom.

A dark “technical dossier” treatment works well for privacy, infrastructure, and developer tools: quiet grid, one signal color, one warning color, compact evidence labels, and high-contrast typography. Treat this as a direction, not a mandatory theme; adapt the palette to the subject while keeping the evidence-led hierarchy.

Avoid decorative logos, meaningless stat cards, fake terminals, and dense feature grids. Never show commercial trademarks unrelated to the repository.

## Duration policy

Do not silently force every video into the same duration.

- Default target: **80–110 seconds including the closing CTA** (repository rule in `AGENTS.md`). Only go shorter or longer when the user asks or the content genuinely requires it, and say so.
- Derive the final duration from measured sentence clips, pauses, scene tails, and transitions; update both the composition and registered metadata.

Flag meaningful platform eligibility tradeoffs before publishing if current project rules or platform behavior conflict with the chosen length.

## Validation and delivery

Run only targeted lint for the active video directory and modified composition entry point. Render at least one representative still per scene and inspect typography, screenshot legibility, caption safe zones, and visual balance.

Before delivery or upload:

1. render the final H.264/AAC MP4;
2. verify duration, resolution, frame rate, pixel format, and both streams with ffprobe;
3. decode the complete video and audio streams;
4. run silence detection to confirm sentence pauses exist in the encoded output;
5. report the local output path and exact duration.

If publishing is explicitly requested, upload the verified file, publish only to the requested destinations, and poll the returned post IDs until each is `sent` or `error`. Retry only failed platforms so successful posts are never duplicated.
