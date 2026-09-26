---
name: ai-knowledge-explainer
description: End-to-end pipeline to research cutting-edge AI/LLM breakthroughs, papers, and systems architecture, and produce high-retention educational vertical videos (80–110s preferred, no scene cap, closing brand CTA) emphasizing intellectual curiosity, under-the-hood mental models, authentic academic/system diagrams, and thought-provoking technical discussions. Publishes to TikTok (<TIKTOK_HANDLE>), YouTube Shorts (<CHANNEL_NAME>), and Facebook Reels (<CHANNEL_NAME>) via Buffer with ZeroTTS voiceover (Tiến Đạt voice - energetic & crisp delivery) and accented Vietnamese captions.
version: 1.1.0
---

# AI Knowledge Explainer: Deep-Dive Paper & Architecture Video Pipeline

Use this skill when tasked with creating educational, high-intellect, or architecture breakdown short-form videos about **AI/LLM research breakthroughs, paper deep-dives, algorithm internals, and system engineering paradigms**—focusing on **"Why it works"**, **"Under-the-hood mental models"**, and **"Academic/engineering discussions"**, rather than FOMO product hype or GitHub stars.

## Core Rules & Invariants

1. **EDUCATIONAL & MENTAL MODEL FOCUS**:
   - Focus on **"Aha! Moments"**, demystifying complex computer science concepts (e.g. Memory-bound latency, FlashAttention, Discrete Diffusion, Test-Time Compute, KV-Cache).
   - Avoid cheap hype, clickbait claims, or star count obsession. Establish authority through precise technical accuracy, clear analogies, and elegant architectural visualization.
2. **MANDATORY AUTHENTIC RESEARCH DIAGRAM / SCREENSHOT**:
   - **Hard Requirement**: Every video **MUST include at least 1 genuine diagram or benchmark graphic** (`public/videos/<slug>/assets/screenshot.png`) extracted directly from the official paper (arXiv), project website, or official GitHub repository.
   - Code-rendered Remotion animations (token visualizers, data-flow arrows, memory blocks) should accompany and animate the concepts, but **can NEVER replace having at least 1 real authentic diagram**.
   - **STRICT BAN ON AI SLOP & GIBBERISH IMAGES**: NEVER use prompt-generated AI images to fake system architectures or hardware.
   - **STRICT BAN ON TRADEMARKED LOGOS**: Do not display trademarked commercial brand logos unless the paper was officially released by that entity.
3. **Multi-Platform Target**: Always publish simultaneously to all 3 platforms via Buffer (`all`):
   - TikTok (`<TIKTOK_HANDLE>`)
   - YouTube Shorts (`<CHANNEL_NAME>`)
   - Facebook Reels (`<CHANNEL_NAME>`)
4. **NO FALSE AI DISCLOSURE (`isAiGenerated: false`, omit `aiAssisted`)**:
   - Remotion motion graphics and educational diagrams do NOT require synthetic AI disclosures under YouTube, TikTok, and Meta policies.
   - Declaring `isAiGenerated: true` triggers warning banners that crush organic retention and feed distribution. Always keep `isAiGenerated: false` and omit `aiAssisted`.
5. **Duration & Scenes**: No scene-count limit and no 60s cap. **Prefer 80–110 seconds (~2400–3300 frames at 30fps) including the closing CTA** (see `AGENTS.md` → Duration & Scene Policy). Use the extra time for deeper explanation, not padding.
6. **Approved Voiceover Standard (ZeroTTS - Giọng Tiến Đạt `tiendat`)**: Use **ZeroTTS (Voice: `tiendat`)** (Nam trẻ, bình luận sôi nổi, năng lượng cao) running local ONNX inference on CPU. Delivers flawless bilingual pronunciation for technical jargon (`autoregressive`, `diffusion`, `memory-bound`, `token`, `sampler`, `lossless`, `benchmark`, `harness`, `agent`) without API rate limits.
7. **Mandatory Accented Captions**: Captions, text overlays, and YouTube titles **MUST strictly be in Vietnamese with proper diacritics (tiếng Việt có dấu)**.
8. **Discussion Question + Mandatory Closing CTA**: The last content scene may pose an open-ended technical inquiry prompting engineers and enthusiasts to debate in the comments (e.g. *"Theo bạn kiến trúc này có thay thế được NTP không? Comment chia sẻ góc nhìn nhé!"*), driving high-quality engagement and algorithm boosts. The video then always closes on the shared `BrandCtaScene` (`src/videos/shared/BrandCtaScene.tsx`) as the final sequence.
9. **Research Publication Recency (Within 2 Weeks)**: The research paper, arXiv preprint, or model breakthrough **MUST strictly be published within 2 weeks** prior to the video creation date (maximum 14 days old). Older research is disqualified.
10. **Center-Aligned Layout Standard (Zero Left Skew)**:
    - All scene content containers, cards, text, and mockups **MUST be centered horizontally** on the canvas (`left: 64px, right: 64px` or equal margins).
    - **Never skew the container to the left** (e.g. avoiding asymmetrical `left: 62, right: 160`).
11. **Vertical Component Proportions (Height >= +10%)**:
    - Remotion vertical videos (1080x1920, 9:16) require generous vertical proportions.
    - Increase the height and vertical padding of all cards and widgets by **at least 10%** (card paddings 26–36px).
    - **Screenshot & Mock Windows**: Mockup windows displaying paper screenshots/diagrams MUST have adequate vertical height (height at least **360–440px**), preventing squashed, thin, or horizontally stretched ratios.
12. **Contemporary Model Context & Timely Examples (Strictly Modern References)**:
    - When citing real-world models, benchmarks, or analogies, **ALWAYS use the latest contemporary frontier models of the current era** (e.g. in the current 2026 timeline: `GPT-6 Astra`, `DeepSeek-V4 Flash`, `DeepSeek-V4 Pro`, `Claude Fable 5.1`, `Gemma-4`, etc.).
    - **STRICT BAN ON OUTDATED MODEL REFERENCES**: Never use legacy models (e.g. `GPT-4o`, `DeepSeek-R1`, `Claude 3.5`, `o1-preview`) as the primary modern standard or state-of-the-art reference in script voiceovers or visual cards. Citing outdated models when explaining a cutting-edge paper breaks technical authority and creates anachronistic dissonance for viewers.
    - If a paper uses legacy models as comparative baselines, explicitly label them as historical baselines while focusing the narrative and discussion around the current frontier.
13. **MANDATORY SYSTEM DEDUPLICATION AUDIT (STRICT BAN ON REPEATS)**:
    - **Audit First Rule**: Before researching, proposing, or selecting any paper or topic, the agent **MUST first audit all existing videos already produced in this repository**:
      - Inspect `src/videos/` directory (`Get-ChildItem -Directory src/videos | Select-Object -ExpandProperty Name`).
      - Inspect registered compositions in `src/Composition.tsx`.
      - Run `node --strip-types scripts/generate-voiceover.ts --list` for a canonical list of all discovered configs.

    - **Strict Ban on Previously Covered Research / Papers**:
      - NEVER select, research, or produce a video about a paper, architecture, or model that already exists in this codebase (e.g. `declarative-attention`, `uno-discrete-diffusion`, `parason-parallel-reasoning`, `navier-stokes-solution`, `next-concept-prediction`, `headroom`, `deepseek-v4-flash`, `gpt-6-astra`, `airllm`, `tencentdb-memory`, etc.).
      - If a candidate paper or topic matches or overlaps with any existing folder in `src/videos/`, it is **IMMEDIATELY DISQUALIFIED**.
      - Always choose an entirely fresh, unrepresented paper strictly within the 2-week recency window (< 14 days old).

---

## The "Knowledge Deep-Dive" Narrative Framework (beats, not a scene cap)

Beats run in order; each may take one or several scenes. Whole video incl. CTA: **80–110s preferred**.

| Beat | Narrative Function | Visual Element |
| :--- | :--- | :--- |
| **The Bottleneck Paradox** | Pose a foundational question or counter-intuitive paradox in modern AI | Split comparison: AI high intelligence vs Physical bottleneck |
| **The Under-The-Hood Bottleneck** | Explain the root computer-science mechanism (e.g. Memory-bound GPU HBM, token latency) | Remotion animated mental model: Token-by-token vs Data transfer |
| **The Architecture Breakthrough** (1+ scenes) | Unveil the paper's core secret sauce & architectural novelty | **MANDATORY: Real diagram from paper/repo** + highlighted components |
| **Benchmark & Impact** (1+ scenes) | Hard quantitative proof (speedup, lossless accuracy, benchmark deltas), tradeoffs | Animated metric comparison cards & engineering tradeoffs |
| **Open Debate** | Question on the future trajectory / expert opinions | Discussion prompt `💬 BẠN NGHĨ GÌ VỀ CÔNG NGHỆ NÀY?` |
| **Closing CTA (mandatory, last)** | Ask viewers to follow / like / save | Shared `BrandCtaScene` (no props; brand comes from `src/brand.ts`) |

---

## 7-Step Production Workflow

### Step 1: System Deduplication Audit & Deep Research
1. **Audit Existing System Videos (Mandatory Deduplication)**:
   - Run:
     ```powershell
     Get-ChildItem -Directory src/videos | Select-Object -ExpandProperty Name
     ```
   - Cross-check candidate papers against existing folders in `src/videos/` and `src/Composition.tsx`. Any paper, architecture, or tool previously covered is **strictly disqualified**.
2. **Deep Research & Paper Analysis**:
   - Read the paper abstract, methodology, and experimental results on arXiv / project site (verified published within the last 14 days).
   - Identify:
     - **The Baseline Limitation**: What physical/algorithmic bottleneck is being addressed?
     - **The Core Innovation**: What is the mathematical or architectural mechanism?
     - **The Quantitative Win**: What are the speedup factors or accuracy margins?
3. **Diagram Gathering**:
   - Download the official architecture diagram or benchmark figure into `public/videos/<slug>/assets/screenshot.png`.

### Step 2: Scripting & Voiceover Config
Write `src/videos/<slug>/voiceover-config.ts` following the Knowledge Deep-Dive beats (any number of scenes). Size the script so the finished video (content + CTA) lands at **80–110s** (typically ~250–380 words), measured from real clips. **All referenced models MUST be contemporary frontier models** (e.g. `GPT-6 Astra`, `DeepSeek-V4 Flash/Pro`, `Claude Fable 5.1`, `Gemma-4`), strictly avoiding outdated models like GPT-4o or DeepSeek-R1.

### Step 3: Generate Voiceover & Sentence Cadence (ZeroTTS Tiến Đạt Standard)
1. **Tách câu chi tiết (Sentence-Level Splitting)**:
   - Trong `src/videos/<slug>/voiceover-config.ts`, **tuyệt đối KHÔNG gộp cả scene thành 1 khối text duy nhất** để tránh lỗi đọc dồn dập không có quãng nghỉ.
   - Tách kịch bản thành từng câu ngắn độc lập (ví dụ: `01a-hook`, `01b-hook`, `02a-bottleneck`, `02b-bottleneck`...).
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
   - Chèn khoảng nghỉ **10–14 frames** (~0.35s – 0.5s ở 30fps) giữa 2 câu trong scene.
   - Chèn khoảng nghỉ **15–22 frames** (~0.5s – 0.7s) sau các câu hỏi tò mò hoặc cú lật/reveal kiến trúc.
   - Bù đệm scene tail `transitionFrames + desiredPauseFrames` (ít nhất 18–22 frames) tránh visual transition nuốt mất khoảng nghỉ câu cuối.
   - Căn chỉnh `captions.json` chính xác theo từng câu thoại.

### Step 4: Remotion Scene Construction
1. Create `scenes/IntroScene.tsx`: The Bottleneck Paradox.
2. Create `scenes/ProblemScene.tsx`: The Under-The-Hood Bottleneck (Animated mental model).
3. Create `scenes/ArchitectureScene.tsx`: Authentic paper diagram showcase with window shell.
4. Create `scenes/BenchmarkScene.tsx`: Lossless proof & comparative speedup cards.
5. Create `scenes/DebateScene.tsx` (optional): thought-provoking open question. Add more scenes whenever a concept needs room.
6. Assemble in `<CompositionName>.tsx` using `TransitionSeries`, ending with the shared `BrandCtaScene` (`BRAND_CTA_FRAMES`). Target 80–110s total (~2400–3300f).

### Step 5: Lint & QA Stills
1. Register in `src/Composition.tsx`.
2. Run targeted lint check (0 errors):
```powershell
npx eslint src/videos/<slug> src/Composition.tsx
```
*(Strictly avoid repo-wide `npm run lint` or `eslint src` to prevent slow multi-minute scans and timeouts).*
3. Render QA stills:
```powershell
npx remotion still src/index.ts <Slug>-Short-VI out/videos/<slug>/qa/frame-20s.png --scale=0.25 --frame=600
```
4. Verify safe margins (top 86px, bottom 180px, right 170px for TikTok UI) and readability.

### Step 6: Render & Cloudinary Upload
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
Poll `scripts/verify-buffer-posts.ts` until `status: "sent"` and return live links.

