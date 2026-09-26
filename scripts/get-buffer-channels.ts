/**
 * Helper script to list all Buffer channels connected to your account.
 * Run once to find your TikTok and YouTube channel IDs, then save them to .env.
 *
 * Usage: node --strip-types --env-file=.env scripts/get-buffer-channels.ts
 */
export {};

const API_KEY = process.env.BUFFER_API_KEY;
if (!API_KEY) throw new Error("Missing BUFFER_API_KEY in .env");

async function bufferQuery(query: string, variables?: Record<string, unknown>) {
  const res = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json() as any;
  if (json.errors) {
    // Some fields might partially error - log warnings but continue
    const fatal = json.errors.filter((e: any) => !json.data);
    if (fatal.length) {
      console.error("Buffer API error:", JSON.stringify(json.errors, null, 2));
      process.exit(1);
    }
    console.warn("Partial warnings:", json.errors.map((e: any) => e.message).join(", "));
  }
  return json.data;
}

// Step 1: Get organizations
const orgData = await bufferQuery(`
  query GetOrganizations {
    account {
      organizations {
        id
        name
      }
    }
  }
`);

const orgs = orgData?.account?.organizations ?? [];
if (!orgs.length) {
  console.log("No organizations found.");
  process.exit(1);
}

console.log(`\nFound ${orgs.length} organization(s):\n`);
for (const org of orgs) {
  console.log(`  ${org.name} (${org.id})`);
}

const orgId = orgs[0].id;
console.log(`\nUsing: ${orgs[0].name} (${orgId})\n`);

// Step 2: Get channels for that org
const channelData = await bufferQuery(`
  query GetChannels($orgId: OrganizationId!) {
    channels(input: { organizationId: $orgId }) {
      id
      name
      displayName
      service
    }
  }
`, { orgId });

const channels = channelData?.channels ?? [];
if (!channels.length) {
  console.log("No channels found. Connect TikTok and YouTube in Buffer dashboard first.");
  process.exit(0);
}

console.log("=== Connected Buffer Channels ===\n");
for (const ch of channels) {
  console.log(`[${(ch.service ?? "?").toUpperCase()}] ${ch.displayName || ch.name}`);
  console.log(`  ID: ${ch.id}`);
  console.log();
}

const tiktok = channels.find((c: any) => c.service === "tiktok");
const youtube = channels.find((c: any) => c.service === "youtube");
const facebook = channels.find((c: any) => c.service === "facebook");

console.log("--- Add to your .env ---");
if (tiktok) console.log(`BUFFER_TIKTOK_CHANNEL_ID=${tiktok.id}`);
if (youtube) console.log(`BUFFER_YOUTUBE_CHANNEL_ID=${youtube.id}`);
if (facebook) console.log(`BUFFER_FACEBOOK_CHANNEL_ID=${facebook.id}`);
