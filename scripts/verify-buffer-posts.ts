/**
 * Verify one or more Buffer post IDs after creation.
 * Usage: node --strip-types --env-file=.env scripts/verify-buffer-posts.ts <postId...>
 */
export {};

const apiKey = process.env.BUFFER_API_KEY;
if (!apiKey) throw new Error("Missing BUFFER_API_KEY");

const postIds = process.argv.slice(2);
if (!postIds.length) {
  throw new Error("Usage: verify-buffer-posts.ts <postId...>");
}

const query = `
  query GetPost($id: PostId!) {
    post(input: {id: $id}) {
      id
      text
      status
      dueAt
      sentAt
      externalLink
      shareMode
      sharedNow
      channelId
      assets {
        mimeType
        source
      }
      error {
        message
      }
    }
  }
`;

for (const id of postIds) {
  const response = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({query, variables: {id}}),
  });
  const payload = (await response.json()) as any;
  if (!response.ok || payload.errors) {
    throw new Error(
      `Buffer verification failed for ${id}: ${JSON.stringify(payload.errors ?? payload)}`,
    );
  }
  console.log(JSON.stringify(payload.data?.post, null, 2));
}
