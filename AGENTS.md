# Project Conventions: Social Video Production & Multi-Platform Publishing

This repository produces vertical short-form videos with Remotion and publishes them simultaneously across 3 platforms:
1. **TikTok** (`<TIKTOK_HANDLE>`)
2. **YouTube Shorts** (`<CHANNEL_NAME>`)
3. **Facebook Reels** (`<CHANNEL_NAME>`)

> Brand setup: fill in `src/brand.ts` (name, handle, tagline, colors) and replace the `<TIKTOK_HANDLE>` / `<CHANNEL_NAME>` placeholders in this file, `.agents/rules/social_publishing.md` and the skills under `.agents/skills/` and `.claude/skills/`.

## Multi-Platform Publishing Rules
- Whenever instructed to publish or post a video, **always target all 3 platforms** unless explicitly told otherwise.
- The publishing script `scripts/publish-to-buffer.ts` defaults to target `all`, pushing to TikTok, YouTube Shorts, and Facebook Reels in a single command.
- Always include `BUFFER_FACEBOOK_CHANNEL_ID` alongside `BUFFER_TIKTOK_CHANNEL_ID` and `BUFFER_YOUTUBE_CHANNEL_ID` in `.env`.
- **Duration & Scene Count**: No fixed scene count and no 60-second cap. **Preferred total duration is 80–110 seconds (~2400–3300 frames at 30fps), including the closing CTA scene.** Use as many scenes as the story needs; derive the final frame count from measured voiceover clips + pauses + transitions (see "Duration & Scene Policy" below).
- **MANDATORY CAPTION RULE**: Post caption and YouTube title **MUST be in Vietnamese with proper diacritics (tiếng Việt có dấu)**. Never post unaccented Vietnamese or pure English captions.
- **NO FALSE AI DISCLOSURE (`isAiGenerated: false`, omit `aiAssisted`)**:
  - Remotion tech videos are stylized motion graphics, code animations, and UI mockups. Under YouTube, TikTok, and Meta official policies, stylized animations and motion graphics do NOT constitute synthetic realism or deepfakes and do NOT require AI disclosure.
  - Setting `isAiGenerated: true` or `aiAssisted: true` triggers prominent warning banners ("Altered or synthetic content" / "AI-generated") across YouTube Shorts, TikTok, and Facebook Reels. Viewers perceive this as "AI slop", swipe away in the first 1–2 seconds, destroy completion/retention rates, and cause recommendation algorithms to throttle reach.
  - Keep `isAiGenerated: false` and omit `aiAssisted` (or `false`) for all stylized Remotion videos. Only set to `true` if the video contains photorealistic synthetic footage of real humans or real-world events that never happened.
- Verify published posts using `scripts/verify-buffer-posts.ts` until `status: "sent"` and return live links for all 3 platforms.
- Helpers: `scripts/get-buffer-channels.ts` / `scripts/check-buffer-channels.ts` list the Buffer channel IDs for `.env`; `scripts/share-buffer-posts-now.ts <post-id...>` pushes queued posts live.

## Duration & Scene Policy
- **No scene-count limit**: Scene frameworks in skills are narrative guides, not caps. Add, merge, or split scenes freely (e.g. 6–10 content scenes) as long as each scene carries a distinct idea.
- **Preferred duration: 80–110 seconds** (~2400–3300 frames at 30fps) for the whole video **including** the closing CTA scene. Shorter or longer is acceptable only when the user asks for it or the content genuinely cannot fill/fit the window — say so in the report.
- Frame counts always come from measured audio: `sum(sentence clips) + inter-sentence pauses + scene tails − transition overlaps + CTA scene`. Never pad with silence or slow the voice to reach the target; add substance instead.
- After render, confirm the final length with `ffprobe` and report the exact duration. If Buffer/a platform rejects the length for one channel, report that channel's error rather than silently re-cutting the video.

## Mandatory Closing CTA (Every Video)
- **Every video MUST end with the shared CTA scene** `BrandCtaScene` from `src/videos/shared/BrandCtaScene.tsx` (length `BRAND_CTA_FRAMES`, ~10s): channel card → Follow → ❤️ → 🔖, voiceover and click SFX built in.
- It takes no props. Brand name, handle, tagline and accent colors come from `src/brand.ts`; the voiceover is brand-neutral, so changing the brand needs no regeneration.
- Append it as the **last** `TransitionSeries.Sequence` after the final content scene, joined with a normal transition (e.g. `fade()`, 10f). Account for the transition overlap in the total frame count. See `src/videos/paperclip/PaperclipShort.tsx`.
- Do not add a second CTA of your own. A content scene may end with a discussion question, but the video still closes on `BrandCtaScene`.
- If the CTA voiceover files are missing (`public/videos/brand-cta/voiceover/*.mp3`) or you change its text in `src/videos/shared/voiceover-config.ts`, regenerate with `node --strip-types --env-file=.env scripts/generate-voiceover.ts brand-cta`, then update the `VO` timings (and `BRAND_CTA_FRAMES` / beat times `T`) in `BrandCtaScene.tsx` from ffprobe.

## Reference Video
- `src/videos/paperclip/` (composition `Paperclip`, ~101s) is the reference implementation: per-sentence `voiceover-config.ts`, measured `timeline.ts`, one file per scene in `scenes/`, shared helpers in `shared.tsx`, real repo screenshots in `public/videos/paperclip/assets/`, closing `BrandCtaScene`. Copy its structure for new videos; delete it once you have your own.

## Visual Asset Standards: Anti-AI Slop & Anti-Trademark Rules
- **STRICT BAN ON AI SLOP & GIBBERISH IMAGES**:
  - **NEVER use prompt-generated AI images** to fake software interfaces, terminal screens, app dashboards, or scanning hands.
  - AI image generators consistently produce deformed anatomy (melting fingers, mutated hands) and gibberish pseudo-text (`screnvmoshot`, `Textute Faint`, `ACQUIRING 3D MESN`...). Modern platform algorithms (YouTube/TikTok 2025–2026 inauthentic content filters) classify these patterns as low-quality AI slop and throttle distribution, while human viewers immediately swipe away due to poor authenticity.
- **MANDATORY REAL SCREENSHOT RULE**:
  - Every video **MUST feature at least 1 genuine screenshot/asset** (`public/videos/<slug>/assets/screenshot.png`) extracted directly from the repository's README, `docs/`, or official releases.
  - Code-rendered mockups (Terminal, IDE, browser tabs) can supplement or animate workflows, but can NEVER completely replace having at least 1 real authentic screenshot.
- **VISUAL ASSET HIERARCHY**:
  1. **Priority 1 (Mandatory - Real Assets)**: Genuine screenshots, architecture diagrams, and demo GIFs extracted directly from the repository's README, `docs/`, or official releases.
  2. **Priority 2 (Complementary - Remotion Code Mockups)**: High-fidelity, pure code-rendered mockups (VS Code editor, Terminal CLI with typing animations, browser windows, vector cards) following `references/mockup-templates.md`.
- **STRICT BAN ON TRADEMARKED LOGOS (IP INFRINGEMENT)**:
  - **NEVER display commercial brand logos** (e.g. Nike Swoosh, Apple, Adidas, etc.) in demo objects, 3D meshes, textures, or mockup screens unless the repository is officially published by that brand.
  - TikTok, YouTube Shorts, and Facebook Reels run automated computer-vision filters for trademark and copyright infringement. High-visibility logos trigger automatic distribution suppression, demonetization, or shadow-banning.
  - Always use **unbranded, generic objects** (e.g. generic unbranded sneaker, neutral 3D shapes) and vector-drawn elements.

## Voiceover Standard (Approved ZeroTTS - Giọng Tiến Đạt `tiendat`)
- **Standard Engine**: Use **ZeroTTS (Giọng Tiến Đạt - `tiendat`)** (Nam trẻ, bình luận sôi nổi, năng lượng cao) for bilingual Vietnamese + English content.
  - **Engine**: ZeroTTS local ONNX inference on CPU (`ZeroTTS/.venv/Scripts/python.exe ZeroTTS/batch_tts.py`).
  - **Voice**: `tiendat` (Nam trẻ, bình luận, sôi nổi, năng lượng cao, nhịp điệu nhanh và cuốn hút).
  - **Tốc độ & Phong cách tự nhiên**: ZeroTTS phát âm từ mượn công nghệ tiếng Anh (`harness`, `agent`, `model`, `pool`, `github`, `workflow`, `token`, `benchmark`...) và tiếng Việt có thanh điệu hoàn toàn tự nhiên, chuẩn hóa số/ngày tháng tự động bằng `normalize_vi_text`. Tốc độ nói tự nhiên, dứt khoát và giàu năng lượng, phù hợp định dạng short-form video thu hút người xem.
  - **Hiệu năng & Không giới hạn**: Chạy trực tiếp qua ONNX Runtime CPU (~0.6x realtime, TTFF ~170ms), 100% offline không phụ thuộc API key và không giới hạn quota.
  - **Độ dài kịch bản & Target Duration**: Không giới hạn số từ cố định. Viết kịch bản đủ nội dung để video hoàn thiện (kể cả CTA cuối) rơi vào **80–110 giây** (thường ~250–380 từ phần nội dung chính, tùy nhịp đọc). Luôn tính số frame từ tổng thời lượng clip thoại đo bằng ffprobe cộng khoảng nghỉ, không ước lượng từ số chữ.
  - Tự động tích hợp làm engine mặc định trong `scripts/generate-voiceover.ts`.

## Sentence Cadence & Pause Standard (Khắc Phục Lỗi Giọng Tiến Đạt Thiếu Quãng Nghỉ)
- **Vấn đề cốt lõi (Root Cause)**:
  - Khi gộp cả scene thành một khối văn bản dài (30–50 từ) trong 1 file audio duy nhất, ZeroTTS sẽ đọc liên tục một mạch với độ trễ giữa các câu gần như bằng 0 (`inter-sentence gap ~0ms`). Người xem cảm thấy dồn dập, ngợp thở và không kịp tiếp thu ý đồ kỹ thuật.
- **Quy tắc bắt buộc khi soạn kịch bản & timeline**:
  1. **Tách thoại chi tiết theo từng câu độc lập**: Trong `src/videos/<slug>/voiceover-config.ts`, **tuyệt đối KHÔNG gộp cả scene vào 1 ID text duy nhất**. Phải tách từng câu thành các mục riêng biệt đặt tên theo scene (ví dụ: `01a-hook`, `01b-hook`, `02a-problem`, `02b-problem`...). ZeroTTS sẽ sinh từng file `.mp3` riêng cho từng câu.
  2. **Đo đạc thời lượng chính xác bằng ffprobe**: Dùng `ffprobe` đo đạc thời lượng thực tế của từng clip mp3; không bao giờ ước lượng thời lượng từ số chữ.
  3. **Chèn khoảng nghỉ im lặng tường minh (Explicit Timeline Pauses)**: Trên timeline Remotion, xếp các thẻ `<Audio>` theo `<Sequence from={...}>` với:
     - **Khoảng nghỉ thông thường giữa 2 câu**: Từ **10–14 frame im lặng** (~0.35s – 0.5s ở 30fps).
     - **Khoảng nghỉ sau câu hỏi hoặc cú twist/reveal quan trọng**: Từ **15–22 frame im lặng** (~0.5s – 0.7s) để người xem kịp ngấm thông điệp.
  4. **Bù trừ frame chuyển cảnh (Scene Tail Compensation)**: Scene tail phải được cộng thêm `transitionFrames + desiredPauseFrames` (ít nhất 16–22 frames). Nếu không, hiệu ứng chuyển cảnh visual (`TransitionSeries.Transition`) sẽ nuốt mất khoảng nghỉ của câu thoại cuối scene.
  5. **Caption đồng bộ chuẩn xác**: `captions.json` phải căn đúng `startMs` và `endMs` của từng câu thoại thực tế. Tuyệt đối không để caption hiển thị đè lên các khoảng nghỉ im lặng.
  6. **Kiểm chứng bằng FFmpeg Silence Detection**: Sau khi render MP4, chạy kiểm tra `silencedetect=noise=-30dB:d=0.2` để xác nhận video hoàn thiện có các quãng nghỉ tự nhiên (~0.4s – 0.7s).

## Layout & Component Sizing Standards (Centered & Enhanced Height)
- **Center Alignment (No Left Skew)**:
  - All scene content containers, cards, mockups, and text containers MUST be centered horizontally on the canvas (`left: 64px, right: 64px` or equal left/right margins).
  - Do NOT skew or offset the main layout container to the left (e.g. `left: 62, right: 160`) as this makes the video visually unbalanced.
- **Generous Vertical Proportion (Height >= +10%)**:
  - Vertical 9:16 videos (1080x1920) require prominent, tall components to fill vertical screen real estate cleanly.
  - Component heights and vertical paddings MUST be increased by at least 10% (card paddings 26–36px, gap 18–26px).
  - **Screenshot & Mock Windows**: Mockup windows containing screenshots/diagrams MUST have adequate vertical height (height at least 360–440px) to prevent horizontally stretched or squashed aspect ratios.

## Research Publication Recency (Within 2 Weeks)
- For research and educational videos, the publication date of the paper, model, or technical breakthrough **MUST strictly be within 2 weeks** prior to the video creation date (strictly fresh within 14 days).

## Contemporary Model References & Zero Anachronism
- When citing real-world models, benchmarks, or analogies in scripts and visual cards, **ALWAYS use contemporary state-of-the-art frontier models** matching the current era (e.g. in the current 2026 timeline: `GPT-6 Astra`, `DeepSeek-V4 Flash`, `DeepSeek-V4 Pro`, `Claude Fable 5.1`, `Gemma-4`, etc.).
- **STRICT BAN ON OUTDATED MODEL REFERENCES**: Never reference legacy models (such as `GPT-4o`, `DeepSeek-R1`, `Claude 3.5 Sonnet`, `o1-preview`) as the state-of-the-art baseline or active benchmark when presenting fresh research, as this creates anachronistic dissonance and damages credibility.

## Targeted Linting & Fast Validation Standards (Strictly No Repo-Wide Scans)
- **STRICT BAN ON REPO-WIDE LINT (`npm run lint` / `eslint src` / global `tsc`)**:
  - The repository contains dozens of video compositions with hundreds of scene files. Running `npm run lint` or `eslint src` triggers full repo-wide scans and heavy TypeScript compiler passes, taking several minutes, causing background task timeouts, and failing on unrelated legacy videos.
- **MANDATORY TARGETED LINT RULE**:
  - The agent **MUST strictly lint ONLY the target video directory and modified entry points**:
    ```powershell
    npx eslint src/videos/<slug> src/Composition.tsx
    ```
  - This executes instantly in 2–5 seconds, ensuring complete code hygiene (0 errors, 0 warnings) for the active composition without blocking.

## Mandatory System Deduplication Audit (Strict Ban on Repeats)
- **Audit Existing System Videos First**:
  - Before proposing, researching, or starting a video for any paper, tool, or architecture, the agent **MUST first audit all existing videos already produced in this repository**:
    ```powershell
    Get-ChildItem -Directory src/videos | Select-Object -ExpandProperty Name
    ```
  - Check against existing folders in `src/videos/` and registered compositions in `src/Composition.tsx`.
  - Use `node --strip-types scripts/generate-voiceover.ts --list` for a quick canonical list of all discovered voiceover configs.
- **STRICT BAN ON REPEATING PREVIOUSLY COVERED RESEARCH / TOOLS**:
  - NEVER select, research, or produce a video on a topic, paper, or tool that has already been covered in this repository.
  - If a topic matches or overlaps with an existing video folder in `src/videos/`, it is **IMMEDIATELY DISQUALIFIED**.
  - Always pick a completely fresh, unrepresented breakthrough.
