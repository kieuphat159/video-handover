/**
 * Move existing Buffer posts from the queue to immediate publishing.
 * Usage: node --strip-types --env-file=.env scripts/share-buffer-posts-now.ts <postId...>
 */
export {};

const apiKey = process.env.BUFFER_API_KEY;
if (!apiKey) throw new Error("Missing BUFFER_API_KEY");

const postIds = process.argv.slice(2);
if (!postIds.length) {
  throw new Error("Usage: share-buffer-posts-now.ts <postId...>");
}

const mutation = `
  mutation SharePostNow($input: EditPostInput!) {
    editPost(input: $input) {
      ... on PostActionSuccess {
        post {
          id
          status
          dueAt
          sentAt
          shareMode
          sharedNow
          channelId
        }
      }
      ... on MutationError {
        message
      }
    }
  }
`;

const postQuery = `
  query GetPostForImmediateShare($id: PostId!) {
    post(input: {id: $id}) {
      id
      text
      channelId
      assets {
        mimeType
        source
      }
    }
  }
`;

const bufferRequest = async (query: string, variables: Record<string, unknown>) => {
  const response = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({query, variables}),
  });
  const payload = (await response.json()) as any;
  if (!response.ok || payload.errors) {
    throw new Error(JSON.stringify(payload.errors ?? payload));
  }
  return payload.data;
};

for (const id of postIds) {
  const existing = (await bufferRequest(postQuery, {id}))?.post;
  if (!existing) throw new Error(`Buffer post not found: ${id}`);
  const videoUrl = existing.assets?.find(
    (asset: {mimeType?: string; source?: string}) =>
      asset.mimeType?.startsWith("video/") && asset.source,
  )?.source;
  if (!videoUrl) throw new Error(`Buffer post has no video asset: ${id}`);

  const youtubeChannelId = process.env.BUFFER_YOUTUBE_CHANNEL_ID;
  const isYoutube = existing.channelId === youtubeChannelId;
  const data = await bufferRequest(mutation, {
    input: {
      id,
      text: existing.text,
      mode: "shareNow",
      schedulingType: "automatic",
      // Stylized content: do not self-label as AI-assisted.
      aiAssisted: false,
      assets: [
        {
          video: {
            url: videoUrl,
            ...(!isYoutube ? {metadata: {thumbnailOffset: 1000}} : {}),
          },
        },
      ],
      ...(isYoutube
        ? {
            metadata: {
              youtube: {
                title:
                  "Tiêu đề video #Shorts",
                categoryId: "28",
                isAiGenerated: false,
                madeForKids: false,
                privacy: "public",
              },
            },
          }
        : {}),
    },
  });
  const result = data?.editPost;
  if (result?.message) {
    throw new Error(`Buffer shareNow failed for ${id}: ${result.message}`);
  }
  console.log(JSON.stringify(result?.post, null, 2));
}
