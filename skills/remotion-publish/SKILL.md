---
name: remotion-publish
description: Organize, create, render, and publish Remotion vertical videos to TikTok, YouTube Shorts, and Facebook Reels through Cloudinary and Buffer in this repository. Use for end-to-end social video requests that include publishing; do not publish when the user only asks for an export or platform-compatible format.
---

# Remotion social publishing

Deliver a verified local MP4 and, when explicitly authorized, live TikTok, YouTube Shorts, and Facebook Reels links. Use the repository scripts instead of recreating API requests.

## Authorization boundary

- Treat “export for TikTok/Shorts/Reels” as a render-only request.
- Treat “publish”, “upload”, “đăng”, or an explicit end-to-end instruction naming the destination accounts as authorization to mutate those accounts.
- Publishing authorization covers Cloudinary upload and Buffer post creation for the requested asset only. It does not authorize deleting unrelated posts or changing account settings.

## Project layout

Use one slug consistently and keep generated artifacts out of `src/`:

```text
src/videos/<slug>/
  <CompositionName>.tsx
  voiceover-config.ts
  scenes/
public/videos/<slug>/voiceover/
out/videos/<slug>/
  <slug>.mp4
  qa/
```

Register the production composition in `src/Composition.tsx`. Scene-only compositions may be grouped in a `Folder`. Remove abandoned compositions, source folders, voiceovers, and QA renders when the user asks to clean a test video.

## End-to-end workflow

1. Verify time-sensitive claims from the primary source before writing the hook. Record the checked value/date in the video when relevant.
2. Plan as many scenes as the story needs (no scene cap) for a 1080×1920, 30fps composition. **Prefer 80–110 seconds total including the closing CTA** (`AGENTS.md` → Duration & Scene Policy). The **last sequence must be the shared `BrandCtaScene`** (`src/videos/shared/BrandCtaScene.tsx`, `BRAND_CTA_FRAMES`), with repo props for repo videos. Keep important content clear of platform UI, especially the bottom and right edges.
3. Implement each scene in its own file. Use Remotion frame-driven animations and a concise Vietnamese voiceover/caption script.
   - **BẮT BUỘC Tách Thoại Từng Câu (Sentence-Level Splitting)**: Trong `src/videos/<slug>/voiceover-config.ts`, không gộp cả scene vào 1 block text. Phải tách thành từng câu độc lập (`01a-hook`, `01b-hook`...).
   - **Chèn Quãng Nghỉ Tường Minh (Explicit Timeline Pauses)**: Giữa các câu thoại trên timeline, chèn khoảng nghỉ im lặng 10–14 frames (~0.35s–0.5s) và 15–20 frames sau các câu hỏi/twist lớn. Bù đệm scene tail 18–22 frames tránh transition nuốt âm.
4. Sinh voiceover tự động cho slug:

   ```powershell
   node --strip-types --env-file=.env scripts/generate-voiceover.ts <slug>
   ```

   *By default, the script uses the approved **ZeroTTS (Giọng Tiến Đạt - `tiendat` - Nam trẻ, bình luận sôi nổi, năng lượng cao)** engine via local ONNX CPU inference, ensuring natural English pronunciation for technical terms without API quota constraints.*

5. Run targeted lint (`npx eslint src/videos/<slug> src/Composition.tsx` — strictly avoid repo-wide `npm run lint`), list compositions, and render representative stills into `out/videos/<slug>/qa/`. Inspect every scene before the full render.
6. Render the final H.264/AAC file:

   ```powershell
   npx remotion render src/index.ts <CompositionId> out/videos/<slug>/<slug>.mp4 --codec=h264 --crf=18 --audio-codec=aac --pixel-format=yuv420p
   ```

7. Check duration, dimensions, video/audio streams, and decode the file before uploading.
8. Upload to Cloudinary with a dated public ID and capture the final printed HTTPS URL:

   ```powershell
   node --strip-types --env-file=.env scripts/upload-to-cloudinary.ts out/videos/<slug>/<slug>.mp4 <slug>-YYYY-MM-DD
   ```

9. Publish through Buffer to all 3 channels simultaneously. The script defaults to `all` channels and `shareNow`:

   ```powershell
   node --strip-types --env-file=.env scripts/publish-to-buffer.ts "<cloudinary-url>" "<caption>" all "<youtube-title>"
   ```

   **Mandatory Rule**: The caption and YouTube title **MUST be in Vietnamese with proper diacritics (tiếng Việt có dấu)**. The caption must fit platform limits and include 3–5 relevant hashtags. The script supplies:
   - YouTube's required title, category (28 - Science & Tech), AI disclosure, audience, and privacy metadata.
   - Facebook Reels metadata (`type: "reel"`).
   - TikTok thumbnail offset metadata.
   To schedule instead, pass `addToQueue` as the final argument or set `BUFFER_SHARE_MODE=addToQueue`.

10. Capture every Buffer post ID and verify it with:

    ```powershell
    node --strip-types --env-file=.env scripts/verify-buffer-posts.ts <post-id> [post-id...]
    ```

    For `shareNow`, poll until each post becomes `sent` or `error`. Return each `externalLink`; `scheduled`, `sending`, or `sharedNow=true` alone is not proof that publishing finished.


## Failure and retry rules

- If one or two platforms succeed and another fails, retry only the failed target (`tiktok`, `youtube`, or `facebook`). Never rerun `all` or `both`, because that duplicates the successful posts.
- YouTube creation requires `metadata.youtube.title` and `categoryId`; category `28` is Science & Technology.
- Facebook creation requires `metadata.facebook.type: "reel"` for vertical video formats.
- If an existing queued post must go live now, use `scripts/share-buffer-posts-now.ts <post-id...>` and verify the same IDs afterward. Prefer this over deleting and recreating posts.
- Do not expose `.env` values. It is safe to report channel IDs, Buffer post IDs, public media URLs, and final social links.
- Stop retrying if Buffer reports a platform policy, authentication, disconnected-channel, or daily-limit error; report the exact error and preserve successful posts.

## Required environment variables

The scripts expect `ELEVENLABS_API_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `BUFFER_API_KEY`, `BUFFER_TIKTOK_CHANNEL_ID`, `BUFFER_YOUTUBE_CHANNEL_ID`, and `BUFFER_FACEBOOK_CHANNEL_ID` in `.env`.
