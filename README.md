# Remotion vertical short-video pipeline

Produces 1080×1920 short videos with Remotion, voices them locally with ZeroTTS (voice `tiendat`), and publishes to TikTok, YouTube Shorts and Facebook Reels through Cloudinary + Buffer.

Project rules for AI agents live in `AGENTS.md`; step-by-step skills live in `.agents/skills/` (Antigravity) and `.claude/skills/` (Claude Code).

## 1. Brand setup (do this first)

1. Edit `src/brand.ts`: brand name, handle, tagline, accent colors. The closing CTA scene reads from it.
2. Replace the placeholders `<TIKTOK_HANDLE>` and `<CHANNEL_NAME>` in `AGENTS.md`, `.agents/rules/social_publishing.md` and the skill files:
   ```bash
   grep -rln "<TIKTOK_HANDLE>\|<CHANNEL_NAME>" AGENTS.md .agents .claude skills
   ```
3. Copy `.env.example` to `.env` and fill in Buffer + Cloudinary keys. List your Buffer channel IDs with
   `node --strip-types --env-file=.env scripts/get-buffer-channels.ts`.

## 2. Install

Requirements: Node.js 22+, Python 3.10+ (Windows paths are assumed by the voiceover script).

```powershell
npm install
python -m venv ZeroTTS/.venv
ZeroTTS/.venv/Scripts/pip install -e ZeroTTS
```

ZeroTTS is vendored from https://github.com/zeroweight-ai/ZeroTTS (upstream commit `3897333`); small local fixes are recorded in `ZeroTTS/LOCAL_CHANGES.patch`. Model weights download from Hugging Face on first run.

## 3. Layout

```text
src/brand.ts                         Brand name/handle/colors
src/Composition.tsx                  Registers every composition
src/videos/<slug>/                   One folder per video (scenes/, timeline.ts, voiceover-config.ts)
src/videos/shared/BrandCtaScene.tsx  Mandatory closing CTA (follow / like / save)
public/videos/<slug>/                Voiceover clips + real screenshots for that video
public/fonts, public/sfx             Shared font and click/key sounds
out/videos/<slug>/<slug>.mp4         Final render (git-ignored)
```

`src/videos/paperclip/` (composition `Paperclip`, ~101s) is the reference example. Copy its structure, then delete it once you have your own videos.

## 4. Make a video

```powershell
npm run dev                                                                         # Remotion Studio
node --strip-types --env-file=.env scripts/generate-voiceover.ts <slug>             # ZeroTTS, one mp3 per sentence
npx eslint src/videos/<slug> src/Composition.tsx
npx remotion render src/index.ts <CompositionId> out/videos/<slug>/<slug>.mp4 --codec=h264 --crf=18 --audio-codec=aac --pixel-format=yuv420p
```

## 5. Publish

```powershell
node --strip-types --env-file=.env scripts/upload-to-cloudinary.ts out/videos/<slug>/<slug>.mp4 <slug>-YYYY-MM-DD
node --strip-types --env-file=.env scripts/publish-to-buffer.ts '<cloudinary-url>' '<caption tiếng Việt có dấu>' all '<youtube-title>'
node --strip-types --env-file=.env scripts/verify-buffer-posts.ts <post-id> [post-id...]
```

Use single quotes around captions so `$` and other shell characters are not expanded. A run is complete only when every post reports `sent` with an `externalLink`; if one platform fails, retry only that platform (`tiktok`, `youtube` or `facebook`).
