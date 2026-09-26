/**
 * Publish a video to TikTok, YouTube Shorts, and Facebook Reels via Buffer API.
 *
 * Usage:
 *   node --strip-types --env-file=.env scripts/publish-to-buffer.ts <videoUrl> <caption> [all|both|tiktok|youtube|facebook] [youtubeTitle] [shareNow|addToQueue|shareNext]
 *
 * Example:
 *   node --strip-types --env-file=.env scripts/publish-to-buffer.ts \
 *     "https://res.cloudinary.com/.../video.mp4" \
 *     "Caption tiếng Việt có dấu #AI #Shorts"
 */
export {};

const BUFFER_API_KEY = process.env.BUFFER_API_KEY;
const TIKTOK_CHANNEL_ID = process.env.BUFFER_TIKTOK_CHANNEL_ID;
const YOUTUBE_CHANNEL_ID = process.env.BUFFER_YOUTUBE_CHANNEL_ID;
const FACEBOOK_CHANNEL_ID = process.env.BUFFER_FACEBOOK_CHANNEL_ID;

if (!BUFFER_API_KEY) throw new Error("Missing BUFFER_API_KEY");
if (!TIKTOK_CHANNEL_ID) throw new Error("Missing BUFFER_TIKTOK_CHANNEL_ID");
if (!YOUTUBE_CHANNEL_ID) throw new Error("Missing BUFFER_YOUTUBE_CHANNEL_ID");

const videoUrl = process.argv[2];
const caption = process.argv[3];
const target = process.argv[4] ?? "all";
const youtubeTitle =
  process.argv[5] ??
  "Tiêu đề video #Shorts";
const shareMode =
  process.argv[6] ?? process.env.BUFFER_SHARE_MODE ?? "shareNow";
const dueAt = process.argv[7];
const effectiveMode = dueAt ? "customScheduled" : shareMode;

if (!videoUrl) throw new Error("Usage: publish-to-buffer.ts <videoUrl> <caption>");
if (!caption) throw new Error("Usage: publish-to-buffer.ts <videoUrl> <caption>");

// Mandatory Rule: Caption must be in Vietnamese with proper diacritics (tiếng Việt có dấu)
const VIETNAMESE_DIACRITICS_REGEX =
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/;
if (!VIETNAMESE_DIACRITICS_REGEX.test(caption)) {
  throw new Error(
    "MANDATORY CAPTION RULE VIOLATION: Caption must be in Vietnamese with proper diacritics (tiếng Việt có dấu)."
  );
}

if (!["all", "both", "tiktok", "youtube", "facebook"].includes(target)) {
  throw new Error("Target must be one of: all, both, tiktok, youtube, facebook");
}
if ((target === "all" || target === "both" || target === "facebook") && !FACEBOOK_CHANNEL_ID) {
  throw new Error("Missing BUFFER_FACEBOOK_CHANNEL_ID in .env");
}
if (!["shareNow", "addToQueue", "shareNext", "customScheduled"].includes(shareMode)) {
  throw new Error("Share mode must be one of: shareNow, addToQueue, shareNext, customScheduled");
}

const CREATE_POST_MUTATION = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on PostActionSuccess {
        post {
          id
          text
          status
          dueAt
          channelId
        }
      }
      ... on MutationError {
        message
      }
    }
  }
`;

async function publishToChannel(channelId: string, platform: string) {
  console.log(`\nPosting to ${platform} (channel: ${channelId})...`);

  const metadata: Record<string, unknown> = {};
  if (platform === "YouTube Shorts") {
    metadata.youtube = {
      title: youtubeTitle,
      categoryId: "28",
      // Stylized Remotion motion-graphics (non-realistic) does NOT require
      // YouTube synthetic-content disclosure. Over-labeling hurts trust/retention.
      isAiGenerated: false,
      madeForKids: false,
      privacy: "public",
    };
  } else if (platform === "Facebook Reels" || platform === "Facebook") {
    metadata.facebook = {
      type: process.env.BUFFER_FACEBOOK_POST_TYPE ?? "reel",
    };
  }


  const res = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BUFFER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CREATE_POST_MUTATION,
      variables: {
        input: {
          text: caption,
          channelId,
          schedulingType: "automatic",
          mode: effectiveMode,
          ...(dueAt ? { dueAt } : {}),
          // Remotion stylized videos do NOT require AI disclosure.
          // Omit aiAssisted entirely to avoid unwanted AI labels on TikTok, YouTube, and Facebook Reels.
          // Only enable if explicit realistic synthetic footage is used.
          ...(process.env.IS_REALISTIC_AI === "true" ? { aiAssisted: true } : {}),
          ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
          assets: [
            {
              video: {
                url: videoUrl,
                ...(platform === "TikTok"
                  ? { metadata: { thumbnailOffset: 1000 } }
                  : {}),
              },
            },
          ],
        },
      },
    }),
  });

  const json = (await res.json()) as any;

  if (json.errors) {
    console.error(`  [ERROR] ${platform}:`, json.errors.map((e: any) => e.message).join(", "));
    return false;
  }

  const result = json.data?.createPost;
  if (result?.message) {
    // MutationError
    console.error(`  [ERROR] ${platform}: ${result.message}`);
    return false;
  }

  const post = result?.post;
  console.log(
    `  [OK] Post created! ID: ${post?.id}, Status: ${post?.status}, Due: ${post?.dueAt ?? "queue-managed"}`,
  );
  return true;
}

console.log(`\n=== Publishing to Buffer ===`);
console.log(`Video: ${videoUrl}`);
console.log(`Caption: ${caption.slice(0, 80)}...`);
console.log(`Target: ${target}`);
console.log(`Share mode: ${effectiveMode}`);
if (dueAt) console.log(`Scheduled for: ${dueAt}`);

const tiktokOk =
  target === "all" || target === "both" || target === "tiktok"
    ? await publishToChannel(TIKTOK_CHANNEL_ID!, "TikTok")
    : true;

const youtubeOk =
  target === "all" || target === "both" || target === "youtube"
    ? await publishToChannel(YOUTUBE_CHANNEL_ID!, "YouTube Shorts")
    : true;

const facebookOk =
  target === "all" || target === "both" || target === "facebook"
    ? await publishToChannel(FACEBOOK_CHANNEL_ID!, "Facebook Reels")
    : true;

console.log("\n=== Done ===");
if (tiktokOk && youtubeOk && facebookOk) {
  console.log(
    shareMode === "shareNow"
      ? "All posts submitted for immediate publishing in Buffer!"
      : "All posts scheduled successfully in Buffer!",
  );
} else {
  console.log("Some posts failed. Check errors above.");
  process.exit(1);
}
