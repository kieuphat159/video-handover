---
name: fomo-stars-social
description: End-to-end automated pipeline to research viral tech repositories or AI tools (FOMO stars, contributors, breakthroughs, benchmarks), produce high-retention vertical 9:16 Remotion videos (80–110s preferred, no scene cap), ZeroTTS voiceover (Tiến Đạt voice - energetic male, perfect for mixed VN+EN tech terms), render H.264, host on Cloudinary, and publish simultaneously to TikTok (<TIKTOK_HANDLE>), YouTube Shorts (<CHANNEL_NAME>), and Facebook Reels (<CHANNEL_NAME>) via Buffer, closing on the shared follow/like/save brand CTA.
version: 1.2.0
---

# FOMO Stars Social Video Production & Multi-Platform Publishing

Use this skill whenever instructed to create, produce, and publish a viral short-form video about a GitHub repository, open-source AI project, or breakthrough developer tool with FOMO factors (stars, contributors, benchmarks), closing on the shared brand CTA.

## Core Rules & Invariants

1. **Multi-Platform Target**: Always publish simultaneously to all 3 platforms:
   - TikTok (`<TIKTOK_HANDLE>`)
   - YouTube Shorts (`<CHANNEL_NAME>`)
   - Facebook Reels (`<CHANNEL_NAME>`)
2. **Duration & Scenes**: No scene-count limit and no 60s cap. **Prefer 80–110 seconds (~2400–3300 frames at 30fps) including the closing CTA** (see `AGENTS.md` → Duration & Scene Policy). Fill the time with substance, never padding.
3. **Approved Voiceover Standard (ZeroTTS - Giọng Tiến Đạt `tiendat`)**: Always use **ZeroTTS (Giọng Tiến Đạt - `tiendat`)** (Nam trẻ, bình luận, sôi nổi, năng lượng cao) for all bilingual Vietnamese + English videos. Size the script so the finished video lands at 80–110s (typically ~250–380 words of content), measured from real clips. ZeroTTS runs 100% locally via ONNX on CPU, with zero API limits and flawless pronunciation of mixed English tech terms.
4. **Mandatory Accented Captions**: Post captions and YouTube titles **MUST strictly be in Vietnamese with full diacritics (tiếng Việt có dấu)**. Never publish unsigned Vietnamese or English captions.
5. **End-to-End Delivery**: Publish authorization covers Cloudinary upload, Buffer post creation (`all` channels, `shareNow`), and polling `scripts/verify-buffer-posts.ts` until `status: "sent"` with live links returned for all 3 platforms.
6. **CTA Standard**: Every video ends with the shared `BrandCtaScene` (`src/videos/shared/BrandCtaScene.tsx`), a single reusable closing scene asking viewers to follow, like and save the channel (brand from `src/brand.ts`). Do not write a bespoke comment-trigger `OutroScene.tsx` — import and configure the shared scene instead.
7. **Visual Asset Standards (Anti-AI Slop & Anti-Trademark)**:
   - Prioritize real screenshots/diagrams from the official repo or pure code-rendered Remotion mockups (Terminal CLI, VS Code editor, browser tabs).
   - **STRICT BAN ON AI-GENERATED UI IMAGES**: Never use prompt-generated AI images to fake app interfaces, code, or hands holding devices. Gibberish pseudo-text and deformed hands trigger automated AI slop/inauthentic content penalties and viewer swipe-aways.
   - **STRICT BAN ON TRADEMARKED LOGOS**: Never display real commercial logos (Nike Swoosh, Apple, Adidas) on 3D meshes, demo models, or textures. Automated vision filters will suppress video reach and flag for IP infringement. Use generic unbranded items.
8. **NO FALSE AI DISCLOSURE (`isAiGenerated: false`, omit `aiAssisted`)**:
   - Stylized Remotion animations, vector graphics, and code tutorials do NOT require AI disclosure under official YouTube, TikTok, and Meta policies.
   - Setting `isAiGenerated: true` or `aiAssisted: true` attaches warning labels ("Altered or synthetic content" / "AI-generated") across all 3 platforms, destroying viewer trust, cratering retention in the first 2 seconds, and throttling recommendation algorithms.
   - Always keep `isAiGenerated: false` and omit `aiAssisted`.
9. **Center-Aligned Layout Standard (Zero Left Skew)**: All scene content containers, cards, text, and mockups MUST be centered horizontally on the canvas (`left: 64px, right: 64px` or equal margins). Never skew container to the left.
10. **Vertical Component Proportions (Height >= +10%)**: Vertical 9:16 videos (1080x1920) require generous vertical proportions. Increase the height and vertical padding of all cards and widgets by at least 10% (card paddings 26–36px). Mockup windows displaying screenshots MUST have height at least 360–440px to prevent squashed or horizontally stretched ratios.
11. **Contemporary Model Context & Timely Examples (Strictly Modern References)**:
    - When citing real-world models, benchmarks, or analogies, **ALWAYS use contemporary state-of-the-art frontier models** matching the current era (e.g. in the current 2026 timeline: `GPT-6 Astra`, `DeepSeek-V4 Flash`, `DeepSeek-V4 Pro`, `Claude Fable 5.1`, `Gemma-4`, etc.).
    - **STRICT BAN ON OUTDATED MODEL REFERENCES**: Never reference legacy models (such as `GPT-4o`, `DeepSeek-R1`, `Claude 3.5 Sonnet`, `o1-preview`) as active benchmarks or modern standards, preventing anachronistic dissonance and maintaining technical authority.
12. **MANDATORY SYSTEM DEDUPLICATION AUDIT (STRICT BAN ON REPEATS)**:
    - **Audit First Rule**: Before proposing, researching, or starting a video, the agent **MUST first audit all existing videos already produced in this repository**:
       - Inspect `src/videos/` directory (`Get-ChildItem -Directory src/videos | Select-Object -ExpandProperty Name`).
       - Check `src/Composition.tsx`.
       - Run `node --strip-types scripts/generate-voiceover.ts --list` for a canonical list of all discovered configs.
    - **Strict Ban on Previously Covered Repos / Tools**:
      - NEVER select, research, or produce a video about a repository, tool, or architecture that already exists in this codebase (e.g. `tencentdb-memory`, `deepseek-harness`, `omarchy`, `next-concept-prediction`, etc.).
      - If a candidate tool or repo matches or overlaps with any existing folder in `src/videos/`, it is **IMMEDIATELY DISQUALIFIED**.
      - Always select a completely fresh, unrepresented repository or tool.

---

## Standard Directory & File Layout

Always use a consistent kebab-case `<slug>` (e.g. `tencentdb-memory`, `deepseek-harness`, `omarchy`):

```text
src/videos/<slug>/
  <CompositionName>.tsx       # Main transition series (all scenes + closing BrandCtaScene, exact frames)
  shared.tsx                  # Palette, SceneShell, CaptionBar, MiniBadge, StatRow
  voiceover-config.ts         # Scene IDs, Vietnamese script, tempo/speed
  scenes/
    IntroScene.tsx            # Scene 1: Animated star counter + Organization/Author badge
    ProblemScene.tsx          # Scene 2: Pain points / AI memory loss / token burn
    FeaturesScene.tsx         # Scene 3: Solution pillars / 4 memory types / core architecture
    BenchmarkScene.tsx        # Scene 4: Concrete before/after metrics (-61% tokens, +51% success)
    # Scene 5 uses the shared src/videos/shared/BrandCtaScene.tsx (no bespoke OutroScene.tsx)
public/videos/<slug>/voiceover/
  01-hook.mp3
  02-problem.mp3
  03-features.mp3
  04-benchmark.mp3
  05-cta.mp3
out/videos/<slug>/
  <slug>.mp4                  # Rendered H.264/AAC output (1080x1920, 30fps)
  qa/                         # 5 representative stills (frame-00, 09s, 20s, 30s, 45s)
```

---

## 7-Step End-to-End Workflow

### Step 1: FOMO Data Gathering & Fact Verification

Query primary sources before drafting the script:
1. **GitHub API**: `https://api.github.com/repos/<owner>/<repo>`
   - `stargazers_count` (exact stars count to animate)
   - `forks_count`
   - `created_at` (growth velocity, e.g. "26.000 stars chỉ trong vài tháng")
   - `owner` / organization (e.g. TencentCloud, NousResearch, Meta)
2. **README / Paper / Benchmarks**:
   - Primary pain points solved
   - Breakthrough benchmarks (e.g. -61% token, +51% pass rate, SWE-bench, PersonaMem)
   - Architecture pillars (e.g. 4 memory assets: Chat, Skill, Wiki, Graph)
   - Compatibility (e.g. OpenClaw, Hermes, LangChain, Claude Code)
3. **Verify exact numbers**: Record verified numbers in constants (`const VERIFIED_STARS = ...`) to prevent hallucinated claims.

### Step 2: Narrative Beats & High-Retention Scripting

Craft the Vietnamese voiceover in `src/videos/<slug>/voiceover-config.ts`. The beats below are an order, not a cap: split a beat across several scenes (e.g. 2 feature scenes, a setup scene, a use-case scene) whenever it adds substance. Size the script so the video lands at **80–110s including the CTA**:

| Beat | Purpose | Visual Highlight | Spoken Tone |
| :--- | :--- | :--- | :--- |
| **Hook** | Shocking metric & creator | Animated counter `0 → X.XXX ★`, Org badge | Tò mò, kích thích |
| **Problem** | Agitate daily pain point | Pain points list with warning icons, token burn | Đồng cảm, cảnh báo |
| **Features** (1+ scenes) | Reveal the unfair advantage | 4 structured cards/pillars, architecture diagram | Khai sáng, ấn tượng |
| **Benchmark / Setup / Use cases** (1+ scenes) | Hard proof & before/after | Metric comparison table with delta badges | Uy tín, thuyết phục |
| **Closing CTA (mandatory, last)** | Follow / like / save the channel | Shared `BrandCtaScene`: channel card → Follow → ❤️ → 🔖 | Thúc đẩy hành động |

### Step 3: Voiceover Generation & Sentence Cadence (ZeroTTS Tiến Đạt Standard)

1. **Sentence-Level Splitting (BẮT BUỘC để tránh dồn dập)**:
   - Trong `src/videos/<slug>/voiceover-config.ts`, **tuyệt đối KHÔNG gộp cả scene thành 1 khối text duy nhất**. ZeroTTS sẽ đọc một mạch không nghỉ giữa các câu.
   - Phải tách kịch bản thành từng câu ngắn độc lập đánh mã theo scene:
     ```ts
     scenes: [
       { id: "01a-hook", text: "Câu mở đầu gây sốc." },
       { id: "01b-hook", text: "Câu nối thứ hai." },
       { id: "02a-problem", text: "Câu mô tả vấn đề..." },
     ]
     ```
2. **Chạy sinh voiceover tự động**:
   ```powershell
   node --strip-types --env-file=.env scripts/generate-voiceover.ts <slug>
   ```
   *Tự động sinh từng file `.mp3` riêng biệt cho từng câu với giọng Tiến Đạt (`tiendat`).*
3. **Đo đạc thời lượng chính xác bằng ffprobe**:
   ```powershell
   ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 public\videos\<slug>\voiceover\01a-hook.mp3
   ```
4. **Căn chỉnh Timeline & Chèn khoảng nghỉ tường minh**:
   - Chèn khoảng nghỉ **10–14 frames** (~0.35s – 0.5s ở 30fps) giữa 2 câu thoại trong cùng một scene.
   - Chèn khoảng nghỉ **15–20 frames** (~0.5s – 0.7s) sau các câu hỏi hoặc điểm nút quan trọng.
   - Cộng đệm scene tail `transitionFrames + desiredPauseFrames` (ít nhất 18–22 frames) để visual transition không nuốt mất khoảng nghỉ câu cuối.
   - Đồng bộ `captions.json` theo đúng thời điểm phát của từng câu, để trống khoảng nghỉ.
   - Tổng thời lượng video (kể cả CTA cuối) ưu tiên **80–110s (~2400–3300 frames)**.


### Step 4: Register Compositions & Lint

1. Register in `src/Composition.tsx`:
   - Main composition: `<Composition id="<Slug>-Short-VI" component={<Slug>Short} durationInFrames={total} fps={30} width={1080} height={1920} />`
   - Scene compositions folder for Studio inspection.
2. Run targeted lint check (ensure 0 errors and 0 warnings):
   ```powershell
   npx eslint src/videos/<slug> src/Composition.tsx
   ```
   *(Strictly run targeted lint on the active video directory and modified entry points. Do NOT run repo-wide `npm run lint` or `eslint src` to avoid slow multi-minute scans and timeouts).*

### Step 5: Still QA & Full H.264 Render

1. Render representative QA stills:
   ```powershell
   New-Item -ItemType Directory -Force -Path "out\videos\<slug>\qa" | Out-Null
   npx remotion still src/index.ts <Slug>-Short-VI out/videos/<slug>/qa/frame-00.png --scale=0.25 --frame=0
   npx remotion still src/index.ts <Slug>-Short-VI out/videos/<slug>/qa/frame-09s.png --scale=0.25 --frame=270
   npx remotion still src/index.ts <Slug>-Short-VI out/videos/<slug>/qa/frame-20s.png --scale=0.25 --frame=600
   npx remotion still src/index.ts <Slug>-Short-VI out/videos/<slug>/qa/frame-30s.png --scale=0.25 --frame=900
   npx remotion still src/index.ts <Slug>-Short-VI out/videos/<slug>/qa/frame-45s.png --scale=0.25 --frame=1350
   ```
2. Inspect stills with `view_file` to verify text contrast, safe margins (right edge 170px clear for TikTok icons, bottom 180px clear for captions), and visual hierarchy.
3. Render final video:
   ```powershell
   npx remotion render src/index.ts <Slug>-Short-VI out/videos/<slug>/<slug>.mp4 --codec=h264 --crf=18 --audio-codec=aac --pixel-format=yuv420p
   ```

### Step 6: Cloudinary Upload

Upload with a dated/versioned public ID:
```powershell
node --strip-types --env-file=.env scripts/upload-to-cloudinary.ts out/videos/<slug>/<slug>.mp4 <slug>-YYYY-MM-DD
```
Capture the resulting HTTPS Cloudinary URL.

### Step 7: Multi-Platform Publishing & Polling

1. Publish simultaneously to all 3 channels:
   ```powershell
   node --strip-types --env-file=.env scripts/publish-to-buffer.ts "<cloudinary-url>" "<caption>" all "<youtube-title>"
   ```
   *Caption must include concise bullet points, a short CTA to follow the channel, and 3–5 viral hashtags.*
   *Ensure publishing payload keeps `isAiGenerated: false` and omits `aiAssisted` to avoid harmful AI warning labels.*
2. Capture the 3 Buffer post IDs from stdout.
3. Verify until all posts reach `status: "sent"`:
   ```powershell
   node --strip-types --env-file=.env scripts/verify-buffer-posts.ts <post-id-1> <post-id-2> <post-id-3>
   ```
   Poll with a 20–35s sleep if status is `sending`.
4. Report final live links for TikTok, YouTube Shorts, and Facebook Reels.


## Safe-Zone Layout Rules for 9:16 Vertical Video

To ensure platform UI elements (like, share, comment buttons, captions, audio marquee) do not obstruct critical content:
- **Top Safe Margin**: Keep header bars below `top: 86px`.
- **Bottom Safe Margin**: Keep caption boxes above `bottom: 180px`.
- **Right Safe Margin**: Leave at least `right: 170px` padding on caption cards to prevent overlapping with TikTok / Reels vertical interaction buttons.
- **Font Sizes**:
  - Big metric / star count: `100–120px` (bold 950)
  - Card titles: `38–44px` (bold 950)
  - Subheadings / list items: `26–30px` (bold 750)
  - Caption text: `32–34px` (bold 750)
  - Badges / meta: `21–24px` (bold 850)
