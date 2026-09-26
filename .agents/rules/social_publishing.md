---
description: Rules for video creation and social media publishing across TikTok, YouTube Shorts, and Facebook Reels
globs: ["scripts/**", "src/videos/**"]
---

# Social Media Publishing Rules

## Target Channels
Whenever a request asks to publish, upload, or post a video to social media without specifying a single channel, **ALWAYS publish to all 3 channels simultaneously**:

1. **TikTok**: `<TIKTOK_HANDLE>` (Channel ID: `BUFFER_TIKTOK_CHANNEL_ID`)
2. **YouTube Shorts**: `<CHANNEL_NAME>` (Channel ID: `BUFFER_YOUTUBE_CHANNEL_ID`)
3. **Facebook Reels**: `<CHANNEL_NAME>` (Channel ID: `BUFFER_FACEBOOK_CHANNEL_ID`)

## Publishing Command
Use `scripts/publish-to-buffer.ts` with target `all`:

```powershell
node --strip-types --env-file=.env scripts/publish-to-buffer.ts "<cloudinary-url>" "<caption>" all "<youtube-title>"
```

- Target `all` automatically configures:
  - YouTube: metadata with `categoryId: "28"`, `isAiGenerated: false` (strictly `false` for Remotion motion graphics; disclosure is only required for realistic video/audio depicting real people/events), `privacy: "public"`, and `title`.
  - Facebook: metadata with `type: "reel"`.
  - TikTok: asset with `thumbnailOffset: 1000`.
  - Buffer: omit `aiAssisted` (or set `false`). Do NOT set `aiAssisted: true` as it forces AI-generated warning labels on TikTok and Reels, tanking retention and algorithmic distribution.

## Visual Asset Standards: Anti-AI Slop & Anti-Trademark Rules
- **Strict Ban on Generative AI Images for UI**:
  - NEVER use prompt-generated AI images to fake software UI, terminal windows, code editors, or scanning hands.
  - AI image generators output distorted anatomy (melting hands/fingers) and gibberish pseudo-text (`screnvmoshot`, `Textute Faint`...) that are immediately flagged by YouTube and TikTok's 2025–2026 AI slop and inauthentic content detection models. Human viewers also detect the fake artifacts and swipe away immediately.
- **MANDATORY REAL SCREENSHOT RULE**:
  - Every video **MUST feature at least 1 genuine screenshot/asset** (`public/videos/<slug>/assets/screenshot.png`) extracted directly from the repository's README, `docs/`, or official releases.
  - Code-rendered mockups (Terminal, IDE, browser tabs) can supplement or animate workflows, but can NEVER completely replace having at least 1 real authentic screenshot.
- **Visual Asset Hierarchy**:
  1. **Priority 1 (Mandatory - Real Assets)**: Genuine screenshots, architecture diagrams, or demo GIFs from the official repo (README, `docs/`, releases).
  2. **Priority 2 (Complementary - Remotion Code Mockups)**: Clean code-rendered mockups using Remotion vector/CSS components (Terminal CLI, VS Code editor, browser frames, animated flowcharts) per `references/mockup-templates.md`.
- **Strict Ban on Trademarked Logos (IP Infringement)**:
  - NEVER display real commercial logos (e.g. Nike Swoosh, Apple, Adidas) on 3D meshes, demo models, textures, or mockup screens unless the repo is officially from that company.
  - Social media platforms employ automated computer-vision trademark filters that automatically restrict distribution, demonetize, or shadow-ban videos containing prominent trademarked logos. Always use generic, unbranded objects.

## Mandatory Caption Rule
- **Caption and YouTube Title MUST strictly be in Vietnamese with full diacritics (tiếng Việt có dấu)**.
- Never publish unsigned Vietnamese (tieng Viet khong dau) or English captions. Include relevant hashtags (e.g. `#AIAgent #Tech #OpenSource`).

## Voiceover Standards (Approved ZeroTTS - Giọng Tiến Đạt `tiendat`)
- **Standard Engine**: Use **ZeroTTS (Giọng Tiến Đạt - `tiendat`)** (Nam trẻ, bình luận sôi nổi, năng lượng cao) for all bilingual Vietnamese + English videos.
- **Inference & Execution**: Runs locally via ONNX Runtime on CPU through `ZeroTTS/.venv/Scripts/python.exe ZeroTTS/batch_tts.py` (~0.6x realtime, TTFF ~170ms), 100% offline, zero API costs, zero rate limits.
- **Voice Profile**: `tiendat` — Nam trẻ, nhịp điệu nhanh, dứt khoát, sôi nổi và giàu năng lượng, chuyên cho review/bình luận công nghệ.
- **Bilingual & Natural Pronunciation**: Natively handles mixed English tech jargon (`harness`, `agent`, `model`, `pool`, `github`, `token`, `benchmark`) and Vietnamese tone contours without awkward phonetics. Dates, times, and numbers are automatically expanded by `normalize_vi_text`.
- **Script Density & Target Duration**: Write scripts with ~180–220 words so that the final video duration **tightly hugs 56.0 – 59.5 seconds (~1680 – 1785 frames at 30fps)**.
- Default engine in `scripts/generate-voiceover.ts` (`--engine=zerotts --voice=tiendat`).

## Video Constraints
- **Aspect Ratio**: 9:16 portrait (`1080x1920`).
- **Framerate**: 30 fps.
- **Duration**: **MUST tightly target 56.0 – 59.5 seconds (~1680 – 1785 frames)**, strictly under the 60.0-second hard limit (< 1800 frames) so that YouTube recognizes it as a Short and TikTok/Reels do not truncate it.
- **Safe Zones**: Keep captions above `bottom: 180px` and inset from right edge by at least `right: 180px` to prevent overlap with native UI buttons.

## Verification
Always capture the generated Buffer post IDs and poll with:
```powershell
node --strip-types --env-file=.env scripts/verify-buffer-posts.ts <post-id...>
```
Report the live links for all 3 platforms (`TikTok`, `YouTube Shorts`, `Facebook Reels`).
