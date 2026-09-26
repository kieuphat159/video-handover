import os
import sys
import json
import time
import argparse
import subprocess
from pathlib import Path
import numpy as np

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

from zerotts import ZeroTTS, normalize_vi_text

def synthesize_one(tts, text, voice, out_path, ffmpeg_path):
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    norm_text = normalize_vi_text(text)

    t0 = time.perf_counter()
    audio = tts.synthesize(norm_text, voice=voice)
    elapsed = time.perf_counter() - t0
    dur = audio.shape[-1] / tts.sample_rate

    temp_wav = out_path.with_suffix(".temp.wav")
    tts.save_audio(audio, str(temp_wav))

    if out_path.suffix.lower() == ".mp3":
        cmd = [
            ffmpeg_path, "-y",
            "-i", str(temp_wav),
            "-codec:a", "libmp3lame",
            "-b:a", "192k",
            str(out_path)
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if temp_wav.exists():
            temp_wav.unlink()
    else:
        if temp_wav != out_path:
            if out_path.exists():
                out_path.unlink()
            temp_wav.rename(out_path)

    speed = dur / elapsed if elapsed > 0 else 0
    print(f"  [{voice}] {dur:.2f}s audio in {elapsed:.2f}s ({speed:.2f}x) -> {out_path.name}")
    return dur

def main():
    parser = argparse.ArgumentParser(description="ZeroTTS Voiceover Generator")
    parser.add_argument("--batch", help="Path to JSON file with batch scenes list")
    parser.add_argument("--text", help="Text to speak (single mode)")
    parser.add_argument("--voice", default="tiendat", help="Voice pack name (default: tiendat)")
    parser.add_argument("--out", help="Output audio file (.wav or .mp3) for single mode")
    parser.add_argument("--ffmpeg", default="ffmpeg", help="Path to ffmpeg executable")
    parser.add_argument("--threads", type=int, default=4, help="CPU threads")
    args = parser.parse_args()

    tts = ZeroTTS.from_pretrained("zeroweight-ai/ZeroTTS", intra_op_num_threads=args.threads)

    if args.batch:
        with open(args.batch, "r", encoding="utf-8") as f:
            items = json.load(f)
        voice = args.voice
        print(f"Loaded ZeroTTS model. Processing batch of {len(items)} scenes with voice '{voice}'...")
        total_dur = 0.0
        for item in items:
            text = item.get("text", "").strip()
            out_file = item.get("out")
            scene_voice = item.get("voice", voice)
            if not text or not out_file:
                continue
            dur = synthesize_one(tts, text, scene_voice, out_file, args.ffmpeg)
            total_dur += dur
        print(f"Batch completed! Total audio duration: {total_dur:.2f}s")
    else:
        text = args.text
        if not text or text == "-":
            text = sys.stdin.read()
        text = text.strip()
        if not text:
            print("Error: Empty text", file=sys.stderr)
            sys.exit(1)
        if not args.out:
            print("Error: Missing --out", file=sys.stderr)
            sys.exit(1)
        synthesize_one(tts, text, args.voice, args.out, args.ffmpeg)

if __name__ == "__main__":
    main()
