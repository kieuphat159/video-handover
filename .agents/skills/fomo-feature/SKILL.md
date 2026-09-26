---
name: fomo-feature
description: End-to-end pipeline to research a repository or AI tool and create a viral vertical video (80–110s preferred, no scene cap, closing brand CTA) emphasizing paradigm shifts ("Thời đại X đã hết, bây giờ là Y"), creator/owner reputation, and breakthrough features—WITHOUT mentioning stars. MUST include at least 1 real UI screenshot from repo/docs (alongside simulated Remotion mockups). Publishes to TikTok, YouTube Shorts, and Facebook Reels via Buffer with ZeroTTS voiceover (Tiến Đạt voice, energetic & fast-paced) and Vietnamese accented captions.
version: 1.2.0
---

# FOMO Feature: Paradigm Shifts & UI Showcase Video Pipeline

Use this skill when tasked with creating a short-form social video for a repository or tool focusing on **game-changing features, creator prestige, and "era shift" psychological hooks**, featuring **at least 1 real UI screenshot**, with **NO mention of GitHub stars**.

## Core Rules & Invariants

1. **NO STARS ALLOWED**: Never mention GitHub stars, star counts, or star growth velocity in the video visuals, captions, or voiceovers. FOMO is driven strictly by **paradigm shift** ("thời đại X đã hết, giờ là Y"), **creator authority**, and **10x feature breakthroughs**.
2. **MANDATORY AT LEAST 1 REAL SCREENSHOT**:
   - **Hard Requirement**: Every video **MUST include at least 1 genuine screenshot** (`public/videos/<slug>/assets/screenshot.png`) extracted directly from the repository's README, `docs/`, releases, or live demo.
   - Simulated Remotion code mockups (Terminal CLI, VS Code IDE, browser tabs) can accompany or enrich the presentation, but **can NEVER replace having at least 1 real screenshot**. Authenticity is paramount for viewer retention.
   - **STRICT BAN ON AI SLOP & GIBBERISH IMAGES**: NEVER use prompt-generated AI images to fake software interfaces, terminal screens, or scanning hands. Generative AI images with garbled text (`screnvmoshot`, `Textute Faint`...) or deformed hands trigger 2025–2026 YouTube/TikTok inauthentic content & AI slop suppression algorithms, and cause viewer swipe-aways.
   - **STRICT BAN ON TRADEMARKED LOGOS (IP INFRINGEMENT)**: NEVER display real commercial logos (e.g. Nike Swoosh, Apple, Adidas) on demo objects, 3D meshes, textures, or mockup screens. Automated trademark filters immediately restrict reach, demonetize, or shadow-ban the video. Always use unbranded, generic objects.
3. **Multi-Platform Target**: Always publish simultaneously to all 3 platforms via Buffer (`all`):
   - TikTok (`<TIKTOK_HANDLE>`)
   - YouTube Shorts (`<CHANNEL_NAME>`)
   - Facebook Reels (`<CHANNEL_NAME>`)
4. **NO FALSE AI DISCLOSURE (`isAiGenerated: false`, omit `aiAssisted`)**:
   - Stylized Remotion motion-graphics, vector graphics, code editors, and UI mockups do NOT require AI disclosure under official YouTube, TikTok, and Meta policies.
   - Declaring `isAiGenerated: true` or `aiAssisted: true` triggers warning banners ("Altered or synthetic content" / "AI-generated") across all 3 platforms. Viewers perceive this as low-effort AI slop, swipe away within 1–2 seconds, destroy viewer retention, and cause algorithms to throttle reach.
   - Always set `isAiGenerated: false` and omit `aiAssisted`. Only set to `true` if the video depicts realistic footage of real people or events that never occurred.
5. **Duration & Scenes**: No scene-count limit and no 60s cap. **Prefer 80–110 seconds (~2400–3300 frames at 30fps) including the closing CTA.** Frame counts come from measured voiceover clips; fill the time with real substance (more features, setup, tradeoffs), never with padding or slowed voice.
6. **Approved Voiceover Standard (ZeroTTS - Giọng Tiến Đạt `tiendat`)**: Use **ZeroTTS (Voice: `tiendat`)** (Nam trẻ, bình luận sôi nổi, năng lượng cao) running local ONNX inference on CPU. Natively pronounces mixed English tech terms (`harness`, `agent`, `model`, `pool`, `github`, `token`, `benchmark`) with natural Vietnamese prosody and zero API rate limits.
7. **Mandatory Accented Captions**: Captions and YouTube titles **MUST strictly be in Vietnamese with proper diacritics (tiếng Việt có dấu)**.
8. **Conversion CTA**: Every video ends with the shared `BrandCtaScene` (`src/videos/shared/BrandCtaScene.tsx`) — one reusable closing scene asking viewers to follow, like and save the channel. Import it directly into the video's `<Slug>Short.tsx` as the final `TransitionSeries.Sequence` instead of writing a bespoke `OutroScene.tsx` CTA. It takes no props: brand name, handle and colors come from `src/brand.ts`.
9. **Center-Aligned Layout Standard (Zero Left Skew)**: All scene content containers, cards, text, and mockups MUST be centered horizontally on the canvas (`left: 64px, right: 64px` or equal margins). Never skew container to the left.
10. **Vertical Component Proportions (Height >= +10%)**: Vertical 9:16 videos (1080x1920) require generous vertical proportions. Increase the height and vertical padding of all cards and widgets by at least 10% (card paddings 26–36px). Mockup windows displaying screenshots MUST have height at least 360–440px to prevent squashed or horizontally stretched ratios.
11. **Contemporary Model Context & Timely Examples (Strictly Modern References)**:
    - When citing real-world models, benchmarks, or analogies, **ALWAYS use contemporary state-of-the-art frontier models** matching the current era (e.g. in the current 2026 timeline: `GPT-6 Astra`, `DeepSeek-V4 Flash`, `DeepSeek-V4 Pro`, `Claude Fable 5.1`, `Gemma-4`, etc.).
    - **STRICT BAN ON OUTDATED MODEL REFERENCES**: Never reference legacy models (such as `GPT-4o`, `DeepSeek-R1`, `Claude 3.5 Sonnet`, `o1-preview`) as the active state-of-the-art benchmark, as this breaks technical credibility and creates anachronistic dissonance.
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

## The "Paradigm Shift" Narrative Framework (beats, not a scene cap)

Use these beats in order. Any beat may span several scenes (e.g. two UI scenes, a setup/usage scene, a comparison scene); there is no fixed scene count or per-scene duration. Target **80–110s total including the CTA** (see `AGENTS.md` → Duration & Scene Policy).

| Beat | Narrative Function | Visual Element |
| :--- | :--- | :--- |
| **The Era Shift** | *"Thời đại X đã hết, bây giờ là thời của Y!"* | Split comparison banner or bold declaration card |
| **The Authority** | Creator pedigree, engineering team lineage & core pain point solved | Creator avatar / Org badge / Engineering lineage |
| **The Breakthrough UI** | Live demonstration of the core superpower & architecture | **MANDATORY: Real screenshot from repo** (plus optional simulated UI) |
| **The 10x Impact** | Detailed workflow upgrade: speed, zero boilerplate, integrations (MCP, etc.) | Animated workflow nodes or live execution demo |
| *(optional)* **Setup / Tradeoffs / Use cases** | How to get started, limits, who it is for | Terminal mockup, comparison cards |
| **Closing CTA (mandatory, last)** | Ask viewers to follow / like / save | Shared `BrandCtaScene` (`BRAND_CTA_FRAMES`) |

---

## UI Simulation & Screenshot Best Practices

### A. Real Screenshot Extraction
1. Inspect repo README for images:
   ```powershell
   # Search for image links in README
   Select-String -Path "README.md" -Pattern "https?://[^\s)]+\.(png|jpg|jpeg|webp|gif)"
   ```
2. Download asset into `public/videos/<slug>/assets/screenshot.png`.
3. Wrap inside a modern window frame with rounded corners (`borderRadius: 24`), subtle border (`1px solid rgba(255,255,255,0.15)`), window control dots (🔴 🟡 🟢), and zoom/pan interpolation:
   ```tsx
   import {Img, staticFile, interpolate, useCurrentFrame} from 'remotion';

   const frame = useCurrentFrame();
   const scale = interpolate(frame, [0, 150], [1.0, 1.08]);

   <div style={{borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)'}}>
     <Img src={staticFile('videos/<slug>/assets/screenshot.png')} style={{transform: `scale(${scale})`, width: '100%'}} />
   </div>
   ```

### B. Simulated Remotion Mockups (When no real screenshot is available)
If no high-res image exists, build a simulated UI component:
- **Terminal CLI Mockup**: Window header with title, command prompt `$ <repo-cli> run --workflow`, green success logs typing in letter-by-letter using `interpolate(frame, [10, 40], [0, text.length])`.
- **IDE / Code Editor Mockup**: VS Code style tab bar with active file `agent.config.ts`, line numbers, syntax colored tokens (blue keywords, green strings, orange functions).
- **Dashboard Mockup**: Floating card widgets showing live metric gauges, toggle switches, and real-time processing statuses.

*(See `references/mockup-templates.md` for full copy-paste components).*

### C. Strict Ban on AI-Generated Images & Trademarks
- **NEVER use AI image generation models** to fake UI screens, device mockups, software interfaces, or hands holding phones. AI images introduce gibberish text and anatomical distortions that trigger automated "AI slop / inauthentic content" downranking filters and cause viewers to instantly swipe away.
- **NEVER include real commercial brand logos** (e.g. Nike Swoosh, Apple, Adidas, etc.) in demo objects, 3D meshes, textures, or mockups. Automated computer vision trademark filters will immediately penalize, demonetize, or shadow-ban the video. Always use unbranded, generic 3D objects and vector illustrations.

---

## 7-Step Production Workflow

### Step 1: Research Without Stars
1. Scan repo README and commit history for:
   - **What old technology does this replace?** (e.g. "Thay thế hoàn toàn Docker phức tạp", "Tạm biệt thời kỳ prompt thủ công", "Không còn phải dựng database vector riêng").
   - **Who built it?** Author bio, organization (e.g. Anthropic alumni, Tencent AI Lab, Meta research, Linux kernel maintainer).
   - **The Killer Feature**: What is the single feature that makes a developer say "Tôi cần cái này ngay lập tức"?
   - **UI Assets**: Check `docs/`, `assets/`, `images/`, or releases for screenshots or architecture diagrams.

### Step 2: Scripting & Voiceover Config
Write `src/videos/<slug>/voiceover-config.ts` following the "Paradigm Shift" formula.
- **Script Length**: Write substantive, information-dense scripts sized so the finished video (content + CTA) lands at **80–110 seconds** — typically ~250–380 words for the content scenes. Measure clips with ffprobe and add or trim substance to hit the window; no fixed word count or scene count.
- *Strictly avoid any mention of star counts or GitHub ranking.*

### Step 3: Generate Voiceover & Sentence Cadence (ZeroTTS Tiến Đạt Standard)
1. **Tách câu độc lập (Sentence-Level Splitting)**:
   - Trong `src/videos/<slug>/voiceover-config.ts`, **tuyệt đối KHÔNG gộp cả scene thành 1 khối text duy nhất**. ZeroTTS đọc một mạch không ngắt nghỉ giữa các câu.
   - Chia nhỏ kịch bản thành từng câu ngắn độc lập (ví dụ: `01a-hook`, `01b-hook`, `02a-authority`, `02b-authority`...).
2. **Chạy sinh voiceover**:
   ```powershell
   node --strip-types --env-file=.env scripts/generate-voiceover.ts <slug>
   ```
   *Tự động sinh từng file `.mp3` riêng biệt cho từng câu với giọng Tiến Đạt (`tiendat`).*
3. **Đo đạc chính xác bằng ffprobe**:
   ```powershell
   ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 public\videos\<slug>\voiceover\01a-hook.mp3
   ```
4. **Căn chỉnh Timeline & Chèn khoảng nghỉ tường minh**:
   - Chèn khoảng nghỉ **10–14 frames** (~0.35s – 0.5s ở 30fps) giữa 2 câu thoại trong scene.
   - Chèn khoảng nghỉ **15–20 frames** (~0.5s – 0.7s) sau các câu hỏi hoặc điểm nhấn quan trọng.
   - Cộng đệm scene tail `transitionFrames + desiredPauseFrames` (ít nhất 18–22 frames) để visual transition không nuốt mất khoảng nghỉ câu cuối.
   - Đồng bộ `captions.json` căn đúng `startMs` và `endMs` của từng câu thoại thực tế.

### Step 4: Implement Scenes & UI Showcase
1. Build `scenes/IntroScene.tsx` focusing on the era shift ("Thời đại X đã hết").
2. Build `scenes/AuthorityScene.tsx` spotlighting author/organization reputation.
3. Build `scenes/UiScene.tsx` presenting the **MANDATORY real screenshot** (e.g. `public/videos/<slug>/assets/screenshot.png`) inside a polished modern window frame.
4. Build `scenes/ImpactScene.tsx` showing the 10x workflow upgrade. Add further scenes (setup walkthrough, use cases, tradeoffs, comparison) whenever they add substance.
5. Do NOT build a bespoke `scenes/OutroScene.tsx` CTA. Import the shared `BrandCtaScene` from `src/videos/shared/BrandCtaScene.tsx` and use it as the closing sequence (no props; brand comes from `src/brand.ts`).
6. Assemble in `<CompositionName>.tsx` using `TransitionSeries`, ending with `BrandCtaScene` (`BRAND_CTA_FRAMES`). Target 80–110s total (~2400–3300f) including the CTA.

### Step 5: Lint & QA
1. Register in `src/Composition.tsx`.
2. Run targeted lint check (ensure 0 errors):
```powershell
npx eslint src/videos/<slug> src/Composition.tsx
```
*(Strictly run targeted lint on the active video directory and modified entry points. Do NOT run repo-wide `npm run lint` or `eslint src` to avoid slow multi-minute scans and timeouts).*
3. Render stills:
   ```powershell
   npx remotion still src/index.ts <Slug>-Short-VI out/videos/<slug>/qa/frame-20s.png --scale=0.25 --frame=600
   ```
4. Check visual clarity of the UI screenshot / mockup component.

### Step 6: Render & Upload
1. Render full video:
   ```powershell
   npx remotion render src/index.ts <Slug>-Short-VI out/videos/<slug>/<slug>.mp4 --codec=h264 --crf=18 --audio-codec=aac --pixel-format=yuv420p
   ```
2. Upload to Cloudinary:
   ```powershell
   node --strip-types --env-file=.env scripts/upload-to-cloudinary.ts out/videos/<slug>/<slug>.mp4 <slug>-YYYY-MM-DD
   ```

### Step 7: Multi-Platform Publishing
Publish to TikTok, YouTube Shorts, and Facebook Reels with an accented Vietnamese caption:
```powershell
node --strip-types --env-file=.env scripts/publish-to-buffer.ts "<cloudinary-url>" "<caption>" all "<youtube-title>"
```
- **Crucial**: Ensure `scripts/publish-to-buffer.ts` sets `isAiGenerated: false` and omits `aiAssisted`. Motion graphics do not require synthetic content declarations, and declaring them causes platforms to attach warning labels that crush organic reach.
- Poll with `scripts/verify-buffer-posts.ts` until `status: "sent"` and return live links.

