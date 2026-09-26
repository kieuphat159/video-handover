import { execSync } from "child_process";
import { readdirSync } from "fs";
import path from "path";

const FFMPEG = "E:\\test\\my-video\\node_modules\\@remotion\\compositor-win32-x64-msvc\\ffmpeg.exe";
const slug = process.argv[2] || "uno-discrete-diffusion";
const dir = path.join("public", "videos", slug, "voiceover");

const files = readdirSync(dir).filter(f => f.endsWith(".mp3")).sort();
let totalSeconds = 0;

console.log(`\n=== Audio Durations for ${slug} ===`);
for (const f of files) {
  const filePath = path.join(dir, f);
  try {
    execSync(`"${FFMPEG}" -i "${filePath}"`, { stdio: "pipe" });
  } catch (err: any) {
    const text = err.stderr?.toString() || "";
    const m = text.match(/Duration: (\d+):(\d+):([\d.]+)/);
    if (m) {
      const sec = (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]);
      totalSeconds += sec;
      const frames = Math.ceil(sec * 30);
      console.log(`${f.padEnd(25)} : ${sec.toFixed(2)}s (${frames} frames)`);
    }
  }
}
console.log(`-----------------------------------------------`);
console.log(`Total Audio Duration     : ${totalSeconds.toFixed(2)}s (${Math.ceil(totalSeconds * 30)} frames)`);
