/**
 * Upload a rendered MP4 to Cloudinary and return a stable public URL.
 *
 * Usage:
 *   node --strip-types --env-file=.env scripts/upload-to-cloudinary.ts <path-to-video.mp4> [public_id]
 *
 * Returns: the secure public URL (printed to stdout, last line)
 */
export {};
import { statSync } from "fs";
import { basename } from "path";
import { createHash } from "crypto";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  throw new Error("Missing CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET in .env");
}

const filePath = process.argv[2];
if (!filePath) throw new Error("Usage: upload-to-cloudinary.ts <video.mp4>");

const publicId = process.argv[3] ?? basename(filePath, ".mp4");
const timestamp = Math.floor(Date.now() / 1000).toString();
const folder = "remotion-videos";

// Cloudinary signature
const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
const signature = createHash("sha1")
  .update(paramsToSign + API_SECRET)
  .digest("hex");

const stats = statSync(filePath);
console.log(`Uploading ${filePath} (${(stats.size / 1024 / 1024).toFixed(1)} MB) to Cloudinary...`);

const formData = new FormData();
formData.append("api_key", API_KEY);
formData.append("timestamp", timestamp);
formData.append("signature", signature);
formData.append("folder", folder);
formData.append("public_id", publicId);
// Read file as blob
const fileBlob = new Blob([await (await import("fs/promises")).readFile(filePath)], { type: "video/mp4" });
formData.append("file", fileBlob, basename(filePath));

const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
  method: "POST",
  body: formData,
});

if (!res.ok) {
  const err = await res.text();
  throw new Error(`Cloudinary upload failed (${res.status}): ${err}`);
}

const result = await res.json() as any;
const url: string = result.secure_url;

console.log(`Upload complete!`);
console.log(`Public URL: ${url}`);
// Print URL as last line for easy parsing by other scripts
console.log(url);