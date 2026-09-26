export {};
const BUFFER_API_KEY = process.env.BUFFER_API_KEY;
const TIKTOK_CHANNEL_ID = process.env.BUFFER_TIKTOK_CHANNEL_ID;
const FACEBOOK_CHANNEL_ID = process.env.BUFFER_FACEBOOK_CHANNEL_ID;
const YOUTUBE_CHANNEL_ID = process.env.BUFFER_YOUTUBE_CHANNEL_ID;

const GET_CHANNEL_POSTS = `
  query GetChannelPosts($channelId: ChannelId!) {
    channel(input: { id: $channelId }) {
      name
      service
      posts(input: { page: 1, limit: 5 }) {
        total
        lines {
          id
          text
          status
          dueAt
          sentAt
          externalLink
          error {
            message
          }
        }
      }
    }
  }
`;

async function checkChannel(id: string, name: string) {
  console.log(`\n=== Checking ${name} (${id}) ===`);
  const res = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BUFFER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_CHANNEL_POSTS,
      variables: { channelId: id },
    }),
  });

  const json = (await res.json()) as any;
  if (json.errors) {
    console.error("Errors:", json.errors);
    return;
  }
  const channel = json.data?.channel;
  console.log(`Service: ${channel?.service}, Name: ${channel?.name}`);
  const posts = channel?.posts?.lines || [];
  for (const p of posts) {
    console.log(`- Post ID: ${p.id} | Status: ${p.status} | SentAt: ${p.sentAt}`);
    console.log(`  Link: ${p.externalLink || 'N/A'}`);
    if (p.error?.message) {
      console.log(`  ERROR: ${p.error.message}`);
    }
    console.log(`  Text snippet: ${p.text?.substring(0, 60)}...`);
  }
}

async function main() {
  await checkChannel(TIKTOK_CHANNEL_ID!, "TikTok");
  await checkChannel(FACEBOOK_CHANNEL_ID!, "Facebook");
  await checkChannel(YOUTUBE_CHANNEL_ID!, "YouTube");
}

main().catch(console.error);
