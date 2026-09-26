export {};
import {
  writeFileSync,
  readFileSync,
  mkdirSync,
  existsSync,
  copyFileSync,
  createWriteStream,
  readdirSync,
} from "fs";
import path from "path";
import { pathToFileURL } from "url";
import https from "https";
import { execFileSync, execSync } from "child_process";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

// ---------------------------------------------------------------------------
// Auto-discovery: scans src/videos/*/voiceover-config.ts at runtime.
// No manual imports or ALL_CONFIGS entries needed when adding new videos.
// ---------------------------------------------------------------------------

type VoiceoverConfig = {
  compositionId: string;
  voiceId?: string;
  speed?: number;
  googlePreset?: string;
  scenes: Array<{ id: string; text: string }>;
};

function isVoiceoverConfig(value: unknown): value is VoiceoverConfig {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v["compositionId"] === "string" &&
    Array.isArray(v["scenes"]) &&
    (v["scenes"] as unknown[]).length > 0
  );
}

async function discoverVoiceoverConfigs(): Promise<VoiceoverConfig[]> {
  const videosDir = path.resolve("src/videos");
  const entries = readdirSync(videosDir, { withFileTypes: true });
  const configs: VoiceoverConfig[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const configPath = path.join(videosDir, entry.name, "voiceover-config.ts");
    if (!existsSync(configPath)) continue;

    try {
      const mod = await import(pathToFileURL(configPath).href);
      // Pick the first exported value that matches VoiceoverConfig shape
      for (const value of Object.values(mod)) {
        if (isVoiceoverConfig(value)) {
          configs.push(value);
          break;
        }
      }
    } catch (err: any) {
      console.warn(
        `[discover] Skipping ${entry.name}/voiceover-config.ts: ${err.message}`,
      );
    }
  }

  // Sort alphabetically by compositionId for deterministic ordering
  configs.sort((a, b) => a.compositionId.localeCompare(b.compositionId));
  return configs;
}

try {
  process.loadEnvFile?.(".env");
} catch (error: any) {
  if (error?.code !== "ENOENT") throw error;
}

// ffmpeg: FFMPEG_PATH from .env, else the binary bundled with Remotion's compositor.
const FFMPEG_PATH =
  process.env.FFMPEG_PATH ||
  path.resolve("node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe");
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_MODEL_ID = "eleven_v3";
const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION;
const AZURE_SPEECH_VOICE =
  process.env.AZURE_SPEECH_VOICE || "en-US-EmmaMultilingualNeural";
const AZURE_SPEECH_RATE = process.env.AZURE_SPEECH_RATE || "+40%";
const AZURE_SPEECH_VOLUME = process.env.AZURE_SPEECH_VOLUME || "+60%";
const AZURE_OUTPUT_FORMAT = "audio-24khz-96kbitrate-mono-mp3";
const EDGE_SPEECH_VOICE =
  process.env.EDGE_SPEECH_VOICE || "en-US-EmmaMultilingualNeural";
const EDGE_SPEECH_RATE = process.env.EDGE_SPEECH_RATE || "+40%";
const EDGE_SPEECH_VOLUME = process.env.EDGE_SPEECH_VOLUME || "+60%";
const EDGE_SEGMENT_CROSSFADE_MS = Math.min(
  100,
  Math.max(0, Number(process.env.EDGE_SEGMENT_CROSSFADE_MS || 35)),
);

const DEFAULT_ENGLISH_TERMS = [
  "out of memory",
  "layer-wise inference",
  "block-wise",
  "prompt as code",
  "agent meta-harness",
  "self-healing harness",
  "harness",
  "pool",
  "Ruflo",
  "swarm",
  "Microsoft Office",
  "Unreal Engine",
  "Claude Desktop",
  "Claude Code",
  "Google Drive",
  "Google Photos",
  "Ruby on Rails",
  "Open Source",
  "open-source",
  "open source",
  "Git Hub",
  "GitHub",
  "Web UI",
  "WebSocket",
  "Nextcloud",
  "Vaultwarden",
  "Jellyfin",
  "Netflix",
  "1Password",
  "InkSphere",
  "Tiptap",
  "NestJS",
  "Turborepo",
  "ChatDock",
  "DeepTutor",
  "Living Book Engine",
  "Living Book",
  "LightRAG",
  "HKUDS",
  "Manim",
  "Browser Harness",
  "Camera to Blender",
  "AirLLM",
  "DeepSeek",
  "TencentDB",
  "AgentDB",
  "Headroom",
  "SmartCrusher",
  "CodeCompressor",
  "Kompress",
  "CCR",
  "Orca",
  "ADE",
  "Git Worktree",
  "Worktree",
  "Ghostty",
  "Design Mode",
  "Mobile Companion",
  "RuVector",
  "GreenSock",
  "SplitText",
  "MorphSVG",
  "ScrollSmoother",
  "ScrollTrigger",
  "TypeScript",
  "JavaScript",
  "React",
  "useGSAP",
  "Awwwards",
  "Webflow",
  "Omarchy",
  "Arch Linux",
  "Hyprland",
  "Omakase Computing",
  "OpenCode",
  "Antigravity",
  "Copilot",
  "Tokyo Night",
  "Neovim",
  "Terminal",
  "Colab",
  "Blender",
  "Gemini",
  "Tripo3D",
  "LiDAR",
  "Server",
  "asset",
  "render",
  "texture",
  "plugin",
  "framework",
  "workflow",
  "database",
  "VoiceStudio",
  "ElevenLabs",
  "CosyVoice",
  "OmniVoice",
  "WhisperX",
  "codebase",
  "module",
  "developer",
  "comment",
  "Follow",
  "setup",
  "template",
  "prompt",
  "model",
  "agent",
  "skill",
  "tool",
  "code",
  "test",
  "game",
  "email",
  "file",
  "link",
  "token",
  "tokens",
  "Colibrì",
  "Colibri",
];

const DEFAULT_ENGLISH_ACRONYMS = [
  "AI",
  "A I",
  "API",
  "SDK",
  "CLI",
  "C L I",
  "UI",
  "UX",
  "MCP",
  "CDP",
  "GPU",
  "CPU",
  "VRAM",
  "CUDA",
  "LLM",
  "TTS",
  "SSML",
  "IDE",
  "APK",
  "IDA",
  "CTF",
  "CI",
  "QA",
  "HD",
  "HTTP",
  "3D",
  "MoE",
  "NVMe",
  "SSD",
  "RTX",
  "LRU",
];



type SpeechLocale = "vi-VN" | "en-US";
type SpeechSegment = { locale: SpeechLocale; text: string };

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
}

export function stripLanguageMarkers(text: string): string {
  return text.replace(/\[\[\/?en\]\]/giu, "");
}

function appendSegment(
  segments: SpeechSegment[],
  locale: SpeechLocale,
  text: string,
) {
  if (!text) return;
  const previous = segments[segments.length - 1];
  if (previous?.locale === locale) {
    previous.text += text;
  } else {
    segments.push({ locale, text });
  }
}

function collectEnglishRanges(
  text: string,
): Array<{ start: number; end: number }> {
  const customTerms = (process.env.AZURE_ENGLISH_TERMS || "")
    .split("|")
    .map((term) => term.trim())
    .filter(Boolean);
  const wordTerms = [...new Set([...DEFAULT_ENGLISH_TERMS, ...customTerms])]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex);
  const acronymTerms = [...DEFAULT_ENGLISH_ACRONYMS]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex);
  const ranges: Array<{ start: number; end: number }> = [];

  const addMatches = (regex: RegExp) => {
    for (const match of text.matchAll(regex)) {
      const start = match.index;
      ranges.push({ start, end: start + match[0].length });
    }
  };

  if (wordTerms.length > 0) {
    addMatches(
      new RegExp(
        `(?<![\\p{L}\\p{N}])(?:${wordTerms.join("|")})(?![\\p{L}\\p{N}])`,
        "giu",
      ),
    );
  }
  if (acronymTerms.length > 0) {
    addMatches(
      new RegExp(
        `(?<![\\p{L}\\p{N}])(?:${acronymTerms.join("|")})(?![\\p{L}\\p{N}])`,
        "gu",
      ),
    );
  }

  ranges.sort((a, b) => a.start - b.start || b.end - a.end);
  const merged: Array<{ start: number; end: number }> = [];
  for (const range of ranges) {
    const previous = merged[merged.length - 1];
    if (!previous || range.start > previous.end) {
      merged.push({ ...range });
    } else {
      previous.end = Math.max(previous.end, range.end);
    }
  }
  return merged;
}

function appendAutoDetectedSegments(segments: SpeechSegment[], text: string) {
  const ranges = collectEnglishRanges(text);
  let cursor = 0;
  for (const range of ranges) {
    appendSegment(segments, "vi-VN", text.slice(cursor, range.start));
    appendSegment(segments, "en-US", text.slice(range.start, range.end));
    cursor = range.end;
  }
  appendSegment(segments, "vi-VN", text.slice(cursor));
}

export function segmentBilingualText(text: string): SpeechSegment[] {
  const segments: SpeechSegment[] = [];
  const explicitEnglish = /\[\[en\]\]([\s\S]*?)\[\[\/en\]\]/giu;
  let cursor = 0;

  for (const match of text.matchAll(explicitEnglish)) {
    const start = match.index;
    appendAutoDetectedSegments(segments, text.slice(cursor, start));
    appendSegment(segments, "en-US", match[1]);
    cursor = start + match[0].length;
  }
  appendAutoDetectedSegments(segments, text.slice(cursor));
  return segments;
}

export function normalizeSynthesisSegments(text: string): SpeechSegment[] {
  const normalized: SpeechSegment[] = [];
  let pendingPrefix = "";

  for (const segment of segmentBilingualText(text)) {
    if (!/[\p{L}\p{N}]/u.test(segment.text)) {
      const previous = normalized[normalized.length - 1];
      if (previous) previous.text += segment.text;
      else pendingPrefix += segment.text;
      continue;
    }

    const value = pendingPrefix + segment.text;
    pendingPrefix = "";
    appendSegment(normalized, segment.locale, value);
  }

  if (pendingPrefix && normalized.length > 0) {
    normalized[normalized.length - 1].text += pendingPrefix;
  }
  return normalized;
}

function buildBilingualSsml(
  text: string,
  voice: string,
  rate: string,
  volume: string,
): string {
  const body = buildBilingualSsmlBody(text);

  return [
    '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">',
    `<voice name="${escapeXml(voice)}">`,
    `<prosody rate="${escapeXml(rate)}" volume="${escapeXml(volume)}">`,
    body,
    "</prosody>",
    "</voice>",
    "</speak>",
  ].join("");
}

function buildBilingualSsmlBody(text: string): string {
  return segmentBilingualText(text)
    .map(
      (segment) =>
        `<lang xml:lang="${segment.locale}">${escapeXml(segment.text)}</lang>`,
    )
    .join("");
}

export function buildAzureSsml(text: string): string {
  return buildBilingualSsml(
    text,
    AZURE_SPEECH_VOICE,
    AZURE_SPEECH_RATE,
    AZURE_SPEECH_VOLUME,
  );
}

export function buildEdgeSsml(text: string): string {
  return buildBilingualSsml(
    text,
    EDGE_SPEECH_VOICE,
    EDGE_SPEECH_RATE,
    EDGE_SPEECH_VOLUME,
  );
}

export function buildEdgeSsmlBody(text: string): string {
  return buildBilingualSsmlBody(text);
}

function splitGoogleTTSChunks(text: string, maxLen: number = 180): string[] {
  if (text.length <= maxLen) return [text];
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if ((current ? current + " " + trimmed : trimmed).length <= maxLen) {
      current = current ? current + " " + trimmed : trimmed;
    } else {
      if (current) chunks.push(current);
      if (trimmed.length <= maxLen) {
        current = trimmed;
      } else {
        const words = trimmed.split(" ");
        current = "";
        for (const w of words) {
          if ((current ? current + " " + w : w).length <= maxLen) {
            current = current ? current + " " + w : w;
          } else {
            if (current) chunks.push(current);
            current = w;
          }
        }
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export const GOOGLE_PRESETS: Record<string, { filter: string; name: string }> =
  {
    g4: {
      name: "Nữ Trẻ Năng Động (Default)",
      filter: "asetrate=24000*1.06,aresample=24000,atempo=1.415,volume=1.6",
    },
    g5: {
      name: "Nam Trẻ Công Nghệ (Tech Reviewer)",
      filter: "asetrate=24000*0.92,aresample=24000,atempo=1.58,volume=1.6",
    },
    g6: {
      name: "Nam Trầm Uy Tín (Senior Architect)",
      filter: "asetrate=24000*0.84,aresample=24000,atempo=1.65,volume=1.6",
    },
    g7: {
      name: "Nữ MC Bản Tin Công Nghệ",
      filter: "asetrate=24000*1.02,aresample=24000,atempo=1.46,volume=1.6",
    },
    g8: {
      name: "Turbo Shorts Siêu Tốc",
      filter: "asetrate=24000*1.04,aresample=24000,atempo=1.586,volume=1.65",
    },
    g12: {
      name: "Nữ Tự Nhiên Điềm Tĩnh (1.2x Speed)",
      filter: "asetrate=24000*1.04,aresample=24000,atempo=1.154,volume=1.6",
    },
    g13: {
      name: "Nữ Trẻ Phân Tích (1.3x Speed)",
      filter: "asetrate=24000*1.05,aresample=24000,atempo=1.238,volume=1.6",
    },
  };

/**
 * Standard Approved Voice: Option G4 - G8 (Google TTS Engine)
 * Handles bilingual Vietnamese + English tech terms seamlessly without phonetic mangling.
 */
async function generateGoogleG4(
  text: string,
  outputPath: string,
  presetKey: string = "g4",
) {
  const preset = GOOGLE_PRESETS[presetKey] || GOOGLE_PRESETS.g4;
  const dir = outputPath.substring(0, outputPath.lastIndexOf("/"));
  mkdirSync(dir, { recursive: true });

  const tempDir = path.join(
    "temp_tts",
    Math.random().toString(36).substring(2, 9),
  );
  mkdirSync(tempDir, { recursive: true });

  const chunks = splitGoogleTTSChunks(text, 180);
  const chunkFiles: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i];
    const rawFile = path.join(tempDir, `raw_${i}.mp3`);
    chunkFiles.push(rawFile);

    const encoded = encodeURIComponent(chunkText);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=vi&client=tw-ob`;

    const fetchChunk = () =>
      new Promise<void>((resolve, reject) => {
        const fileStream = createWriteStream(rawFile);
        const req = https
          .get(
            url,
            {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              },
            },
            (res) => {
              if (res.statusCode !== 200) {
                return reject(
                  new Error(
                    `Google TTS returned HTTP status ${res.statusCode} for chunk "${chunkText}"`,
                  ),
                );
              }
              res.pipe(fileStream);
              fileStream.on("finish", () => {
                fileStream.close();
                resolve();
              });
            },
          );
        req.on("error", (err) => {
          try {
            fileStream.close();
          } catch {}
          reject(err);
        });
      });

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await fetchChunk();
        break;
      } catch (err: any) {
        if (attempt === 3) throw err;
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }

    if (i < chunks.length - 1) {
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  // Create concat list file
  const concatListPath = path.join(tempDir, "concat.txt");
  const concatContent = chunkFiles
    .map((f) => `file '${path.resolve(f).replace(/\\/g, "/")}'`)
    .join("\n");
  writeFileSync(concatListPath, concatContent, "utf8");

  // Apply chosen Google TTS preset audio filters
  const ffmpegDir = path.dirname(FFMPEG_PATH);
  execSync(
    `"${FFMPEG_PATH}" -y -f concat -safe 0 -i "${concatListPath}" -af "${preset.filter}" "${outputPath}"`,
    {
      stdio: "pipe",
      env: {
        ...process.env,
        PATH: `${ffmpegDir};${process.env.PATH}`,
      },
    },
  );

  console.log(
    `  -> Saved via Google TTS [Preset: ${presetKey} - ${preset.name}] (${outputPath}) [Chunks: ${chunks.length}]`,
  );
}

class AzureSpeechRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "AzureSpeechRequestError";
    this.status = status;
  }
}

async function generateWithAzureSpeech(text: string, outputPath: string) {
  if (!AZURE_SPEECH_KEY || !AZURE_SPEECH_REGION) {
    throw new Error("Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION");
  }
  if (!/^[a-z0-9-]+$/i.test(AZURE_SPEECH_REGION)) {
    throw new Error(`Invalid AZURE_SPEECH_REGION: ${AZURE_SPEECH_REGION}`);
  }

  const endpoint = `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": AZURE_OUTPUT_FORMAT,
      "User-Agent": "remotion-social-video",
    },
    body: buildAzureSsml(text),
  });

  if (!response.ok) {
    const details = (await response.text()).trim().slice(0, 500);
    throw new AzureSpeechRequestError(
      response.status,
      `Azure Speech HTTP ${response.status}${details ? `: ${details}` : ""}`,
    );
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  if (audioBuffer.length === 0) {
    throw new Error("Azure Speech returned an empty audio file");
  }

  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, audioBuffer);
  console.log(
    `  -> Saved via Azure Speech [Voice: ${AZURE_SPEECH_VOICE}, Rate: ${AZURE_SPEECH_RATE}] (${audioBuffer.length} bytes)`,
  );
}

export async function generateWithEdgeSsml(text: string, outputPath: string) {
  const tts = new MsEdgeTTS();
  const tempDir = path.join(
    "temp_tts",
    `edge-ssml-${Math.random().toString(36).substring(2, 9)}`,
  );
  mkdirSync(tempDir, { recursive: true });
  mkdirSync(path.dirname(outputPath), { recursive: true });

  try {
    await tts.setMetadata(
      EDGE_SPEECH_VOICE,
      OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3,
    );
    const result = await tts.toFile(tempDir, buildEdgeSsmlBody(text), {
      rate: EDGE_SPEECH_RATE,
      volume: EDGE_SPEECH_VOLUME,
    });
    if (!existsSync(result.audioFilePath)) {
      throw new Error("Edge TTS did not create an audio file");
    }
    copyFileSync(result.audioFilePath, outputPath);
  } finally {
    tts.close();
  }

  console.log(
    `  -> Saved via free Edge SSML [Voice: ${EDGE_SPEECH_VOICE}, Rate: ${EDGE_SPEECH_RATE}] (${outputPath})`,
  );
}

function crossfadePcm16Mono(
  left: Buffer,
  right: Buffer,
  requestedOverlapSamples: number,
): Buffer {
  const leftSamples = Math.floor(left.length / 2);
  const rightSamples = Math.floor(right.length / 2);
  const overlapSamples = Math.min(
    requestedOverlapSamples,
    leftSamples,
    rightSamples,
  );
  if (overlapSamples <= 0) return Buffer.concat([left, right]);

  const leftKeepSamples = leftSamples - overlapSamples;
  const output = Buffer.alloc(
    (leftSamples + rightSamples - overlapSamples) * 2,
  );
  left.copy(output, 0, 0, leftKeepSamples * 2);

  for (let index = 0; index < overlapSamples; index++) {
    const mix = (index + 1) / (overlapSamples + 1);
    const leftSample = left.readInt16LE((leftKeepSamples + index) * 2);
    const rightSample = right.readInt16LE(index * 2);
    const blended = Math.max(
      -32768,
      Math.min(32767, Math.round(leftSample * (1 - mix) + rightSample * mix)),
    );
    output.writeInt16LE(blended, (leftKeepSamples + index) * 2);
  }

  right.copy(
    output,
    (leftKeepSamples + overlapSamples) * 2,
    overlapSamples * 2,
  );
  return output;
}

function extractPcmDataFromWav(wav: Buffer): Buffer {
  if (
    wav.toString("ascii", 0, 4) !== "RIFF" ||
    wav.toString("ascii", 8, 12) !== "WAVE"
  ) {
    throw new Error("FFmpeg produced an invalid WAV file");
  }

  let offset = 12;
  while (offset + 8 <= wav.length) {
    const chunkId = wav.toString("ascii", offset, offset + 4);
    const chunkSize = wav.readUInt32LE(offset + 4);
    const dataStart = offset + 8;
    if (chunkId === "data") {
      return wav.subarray(dataStart, dataStart + chunkSize);
    }
    offset = dataStart + chunkSize + (chunkSize % 2);
  }
  throw new Error("FFmpeg WAV output has no PCM data chunk");
}

function createPcmWav(pcm: Buffer, sampleRate: number = 24000): Buffer {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0, "ascii");
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8, "ascii");
  header.write("fmt ", 12, "ascii");
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36, "ascii");
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

export async function generateWithEdgeSegmented(
  text: string,
  outputPath: string,
) {
  const segments = normalizeSynthesisSegments(text).filter((segment) =>
    /[\p{L}\p{N}]/u.test(segment.text),
  );
  if (segments.length === 0) {
    throw new Error("No speakable text found for Edge TTS");
  }

  const tempDir = path.join(
    "temp_tts",
    `edge-segmented-${Math.random().toString(36).substring(2, 9)}`,
  );
  mkdirSync(tempDir, { recursive: true });
  mkdirSync(path.dirname(outputPath), { recursive: true });

  const segmentFiles: string[] = [];
  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index];
    const segmentDir = path.join(tempDir, `segment-${index}`);
    mkdirSync(segmentDir, { recursive: true });
    const tts = new MsEdgeTTS();

    try {
      await tts.setMetadata(
        EDGE_SPEECH_VOICE,
        OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3,
        { voiceLocale: segment.locale },
      );
      const result = await tts.toFile(segmentDir, segment.text.trim(), {
        rate: EDGE_SPEECH_RATE,
        volume: EDGE_SPEECH_VOLUME,
      });
      if (!existsSync(result.audioFilePath)) {
        throw new Error(
          `Edge TTS did not create audio for ${segment.locale} segment ${index + 1}`,
        );
      }
      segmentFiles.push(result.audioFilePath);
    } finally {
      tts.close();
    }

    if (index < segments.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  if (segmentFiles.length === 1) {
    copyFileSync(segmentFiles[0], outputPath);
  } else {
    const pcmBuffers = segmentFiles.map((segmentFile, index) => {
      const wavFile = path.join(tempDir, `segment-${index}.wav`);
      execFileSync(
        FFMPEG_PATH,
        [
          "-y",
          "-loglevel",
          "error",
          "-i",
          segmentFile,
          "-acodec",
          "pcm_s16le",
          "-ar",
          "24000",
          "-ac",
          "1",
          wavFile,
        ],
        { stdio: "pipe" },
      );
      return extractPcmDataFromWav(readFileSync(wavFile));
    });
    const overlapSamples = Math.round(
      (EDGE_SEGMENT_CROSSFADE_MS / 1000) * 24000,
    );
    let mergedPcm: Buffer = pcmBuffers[0];
    for (let index = 1; index < pcmBuffers.length; index++) {
      mergedPcm = crossfadePcm16Mono(
        mergedPcm,
        pcmBuffers[index],
        overlapSamples,
      );
    }
    const mergedWavFile = path.join(tempDir, "merged.wav");
    writeFileSync(mergedWavFile, createPcmWav(mergedPcm));
    execFileSync(
      FFMPEG_PATH,
      [
        "-y",
        "-loglevel",
        "error",
        "-i",
        mergedWavFile,
        "-b:a",
        "96k",
        outputPath,
      ],
      { stdio: "pipe" },
    );
  }

  console.log(
    `  -> Saved via free Edge segmented [Voice: ${EDGE_SPEECH_VOICE}, Segments: ${segments.length}, Crossfade: ${EDGE_SEGMENT_CROSSFADE_MS}ms] (${outputPath})`,
  );
}

async function generateWithEdgeTTS(
  text: string,
  outputPath: string,
  speed: number = 1.0,
) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(
    "vi-VN-NamMinhNeural",
    OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3,
  );

  const tempDir = path.join(
    "temp_tts",
    Math.random().toString(36).substring(2, 9),
  );
  mkdirSync(tempDir, { recursive: true });

  const rateStr =
    speed > 1.0
      ? `+${Math.round((speed - 1) * 100)}%`
      : `${Math.round((speed - 1) * 100)}%`;
  await tts.toFile(
    tempDir,
    text,
    rateStr !== "0%" ? { rate: rateStr } : undefined,
  );

  const dir = outputPath.substring(0, outputPath.lastIndexOf("/"));
  mkdirSync(dir, { recursive: true });
  copyFileSync(path.join(tempDir, "audio.mp3"), outputPath);
  console.log(`  -> Saved via Edge TTS (${outputPath})`);
}

async function generateWithElevenLabs(
  text: string,
  voiceId: string,
  outputPath: string,
  speed: number = 1.0,
) {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("Missing ELEVENLABS_API_KEY");
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: ELEVENLABS_MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
          speed,
        },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${err}`);
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  const dir = outputPath.substring(0, outputPath.lastIndexOf("/"));
  mkdirSync(dir, { recursive: true });
  writeFileSync(outputPath, audioBuffer);
  console.log(`  -> Saved via ElevenLabs (${audioBuffer.length} bytes)`);
}

const ZEROTTS_PYTHON = path.resolve("ZeroTTS/.venv/Scripts/python.exe");
const ZEROTTS_BATCH_SCRIPT = path.resolve("ZeroTTS/batch_tts.py");

async function generateZeroTTSBatch(
  compositionId: string,
  scenes: Array<{ id: string; text: string; out: string; voice?: string }>,
  voice: string = "tiendat",
) {
  if (scenes.length === 0) return;
  const tempJson = path.resolve(
    "temp_tts",
    `batch_${compositionId}_${Math.random().toString(36).substring(2, 9)}.json`,
  );
  mkdirSync(path.dirname(tempJson), { recursive: true });
  writeFileSync(tempJson, JSON.stringify(scenes, null, 2), "utf8");

  const cmd = `"${ZEROTTS_PYTHON}" "${ZEROTTS_BATCH_SCRIPT}" --batch "${tempJson}" --voice "${voice}" --ffmpeg "${FFMPEG_PATH}"`;
  execSync(cmd, {
    stdio: "inherit",
    env: { ...process.env, PYTHONUTF8: "1" },
  });
}

async function main() {
  const targetComp = process.argv[2]?.startsWith("--") ? undefined : process.argv[2];
  const engineArg =
    process.argv.find((a) => a.startsWith("--engine="))?.split("=")[1] ||
    "zerotts";
  const voiceArg =
    process.argv.find((a) => a.startsWith("--voice="))?.split("=")[1] ||
    "tiendat";
  const presetArg = process.argv
    .find((a) => a.startsWith("--preset="))
    ?.split("=")[1];
  const listOnly = process.argv.includes("--list");

  const ALL_CONFIGS = await discoverVoiceoverConfigs();

  if (listOnly) {
    console.log(`\nDiscovered ${ALL_CONFIGS.length} voiceover configs:\n`);
    for (const c of ALL_CONFIGS) {
      console.log(`  ${c.compositionId} (${c.scenes.length} scenes)`);
    }
    return;
  }

  const configsToRun = targetComp
    ? ALL_CONFIGS.filter((c) => c.compositionId === targetComp)
    : ALL_CONFIGS;

  if (configsToRun.length === 0) {
    console.log(`No config found for target composition "${targetComp}"`);
    console.log(
      `Available: ${ALL_CONFIGS.map((c) => c.compositionId).join(", ")}`,
    );
    return;
  }

  let azureFallbackActive = false;
  let edgeFallbackActive = false;

  for (const config of configsToRun) {
    if (engineArg === "zerotts") {
      const voice = voiceArg || (config as any).voice || "tiendat";
      console.log(
        `\n=== Voiceover generation for: ${config.compositionId} (Engine: zerotts, Voice: ${voice}) ===`,
      );
      const pendingScenes = config.scenes
        .map((s) => ({
          id: s.id,
          text: stripLanguageMarkers(s.text),
          out: `public/videos/${config.compositionId}/voiceover/${s.id}.mp3`,
          voice,
        }))
        .filter((s) => {
          if (existsSync(s.out)) {
            console.log(`Skipping ${s.out} (already exists)`);
            return false;
          }
          return true;
        });

      if (pendingScenes.length > 0) {
        await generateZeroTTSBatch(config.compositionId, pendingScenes, voice);
      }
      continue;
    }

    const preset = presetArg || (config as any).googlePreset || "g4";
    console.log(
      `\n=== Voiceover generation for: ${config.compositionId} (Engine: ${engineArg}, Preset: ${preset}) ===`,
    );
    for (const scene of config.scenes) {
      const outputPath = `public/videos/${config.compositionId}/voiceover/${scene.id}.mp3`;
      if (existsSync(outputPath)) {
        console.log(`Skipping ${outputPath} (already exists)`);
        continue;
      }

      const speed = (config as any).speed ?? 1.0;
      const cleanText = stripLanguageMarkers(scene.text);

      if (engineArg === "edge-segmented" || engineArg === "edge") {
        if (edgeFallbackActive) {
          await generateGoogleG4(cleanText, outputPath, preset);
        } else {
          try {
            await generateWithEdgeSegmented(scene.text, outputPath);
          } catch (error: any) {
            edgeFallbackActive = true;
            console.warn(
              `[TTS Warning] Free Edge SSML failed: ${error.message}. Google fallback is active for the rest of this run (${preset}).`,
            );
            await generateGoogleG4(cleanText, outputPath, preset);
          }
        }
      } else if (engineArg === "edge-ssml") {
        try {
          await generateWithEdgeSsml(scene.text, outputPath);
        } catch (error: any) {
          console.warn(
            `[TTS Warning] Edge raw SSML failed: ${error.message}. Falling back to Google TTS (${preset})...`,
          );
          await generateGoogleG4(cleanText, outputPath, preset);
        }
      } else if (engineArg === "azure") {
        if (azureFallbackActive) {
          await generateGoogleG4(cleanText, outputPath, preset);
        } else {
          try {
            await generateWithAzureSpeech(scene.text, outputPath);
          } catch (error: any) {
            azureFallbackActive = true;
            const quotaHint =
              error instanceof AzureSpeechRequestError && error.status === 429
                ? " (F0 quota/rate limit reached)"
                : "";
            console.warn(
              `[TTS Warning] Azure Speech failed${quotaHint}: ${error.message}. Google fallback is active for the rest of this run (${preset}).`,
            );
            await generateGoogleG4(cleanText, outputPath, preset);
          }
        }
      } else if (engineArg === "google-g4" || engineArg === "google") {
        await generateGoogleG4(cleanText, outputPath, preset);
      } else if (engineArg === "elevenlabs") {
        try {
          await generateWithElevenLabs(
            cleanText,
            config.voiceId ?? "",
            outputPath,
            speed,
          );
        } catch (e: any) {
          console.warn(
            `[TTS Warning] ElevenLabs failed (${e.message}), falling back to Google TTS (${preset})...`,
          );
          await generateGoogleG4(cleanText, outputPath, preset);
        }
      } else if (engineArg === "edge-vi") {
        await generateWithEdgeTTS(cleanText, outputPath, speed);
      } else {
        console.warn(
          `[TTS Warning] Unknown engine "${engineArg}", using Google TTS (${preset})...`,
        );
        await generateGoogleG4(cleanText, outputPath, preset);
      }

      await new Promise((r) => setTimeout(r, 600));
    }
  }
  console.log("\nDone! All voiceover files generated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
