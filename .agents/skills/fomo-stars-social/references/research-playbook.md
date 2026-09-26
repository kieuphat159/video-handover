# FOMO Research Playbook for Social Videos

Follow this systematic guide to extract viral elements, credible statistics, and FOMO triggers from any GitHub repository or tech announcement.

---

## 1. Quantitative FOMO Data (GitHub API)

Call `https://api.github.com/repos/<owner>/<repo>` to extract:

| Metric | API Field | FOMO Angle / Hook Pattern |
| :--- | :--- | :--- |
| **Total Stars** | `stargazers_count` | *"Gần XX.000 sao GitHub và đang tăng chóng mặt mỗi ngày!"* |
| **Growth Velocity** | `created_at` vs Current Date | *"XX.000 sao chỉ trong vỏn vẹn 30 ngày!"* |
| **Forks & Community** | `forks_count` | *"Hơn X.000 lập trình viên đã fork về thử nghiệm!"* |
| **Parent Organization** | `owner.login` | *"Tập đoàn Tencent / Google / Meta vừa chính thức mở mã nguồn..."* |
| **License / Freedom** | `license.spdx_id` | *"100% mã nguồn mở hoàn toàn miễn phí!"* |

---

## 2. Qualitative Breakthroughs (README & Paper)

Scan the README for:
1. **The Unfair Advantage**: What makes this fundamentally different from existing tools?
   - *Example*: "Không phải flat vector — mà là phân tầng 4 lớp L0 đến L3 và Mermaid canvas offloading!"
2. **Hard Benchmarks & Proof Points**:
   - Token reduction percentage: `-61.38% tokens`
   - Task completion rate: `+51.52% pass rate`
   - Accuracy improvement: `48% → 76% accuracy`
   - Benchmark names: `SWE-bench`, `WideSearch`, `HumanEval`
3. **Ecosystem & Interoperability**:
   - Which tools or agents can use it immediately? (e.g. *OpenClaw, Hermes, Claude Code, Copilot, LangChain*)

---

## 3. The Psychological Script Formula (beats, no fixed timing)

Beats run in this order; each may take one or several scenes. Whole video incl. CTA: **80–110s preferred** (see `AGENTS.md`).

1. **The Hook**: High-status creator/org + explosive metric (Stars) + bold claim.
2. **The Pain**: Agitate a daily frustration that viewers hate (e.g. AI amnesia, burned tokens, repetitive prompting).
3. **The Breakthrough**: Reveal the core pillars that solve this pain — give each important pillar room to breathe.
4. **The Proof**: Concrete data, benchmarks, or side-by-side comparison; optionally setup steps and use cases.
5. **The Closing CTA (mandatory, last)**: The shared `BrandCtaScene` — follow / like / save the channel (no comment trigger word).
