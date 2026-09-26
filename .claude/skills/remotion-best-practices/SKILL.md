---
name: remotion-best-practices
description: Router for all Remotion skills
version: 4.0.520
---

## Preserve user changes

Users may make edits in the code outside of the conversation.

If you detect a surprising change made in the meanwhile, don't overwrite it, assume it was intentional or ask for confirmation.

## Creating a video

If the user asks to make, create, or build a new video or composition, load [Create a new Remotion video](./remotion-create/REFERENCE.md), whether or not a Remotion project already exists.

## New project setup

If no Remotion project currently exists, load [Create a new Remotion project](./remotion-create/REFERENCE.md)

## React Markup Best Practices

If you are writing Remotion React Markup, load [Remotion Markup Best Practices](./remotion-markup/REFERENCE.md)

## Maps

For static maps, animated routes and markers, geographic explainers, Mapbox, MapLibre, MapTiler, GeoJSON, or 3D geographic flyovers, load [Remotion Maps](./remotion-maps/REFERENCE.md).

## Multimedia

For achieving multimedia tasks in the browser, such as trimming, cropping videos, or getting metadata from them, load [Remotion Multimedia](./remotion-multimedia/REFERENCE.md)

## Improving Interactivity

By structuring the Remotion markup well, we can allow users to interactively change things in the Studio and write back to code. If relevant: [Interactivity Best Practices](./remotion-interactivity/REFERENCE.md)

## Rendering

For advanced rendering beyond simple `npx remotion render`, see: [Rendering Best Practices](./remotion-render/REFERENCE.md)

## Opening Remotion Studio

To launch a project in Remotion Studio, open its exact local URL, or configure Studio CLI flags, load [Remotion Studio](./remotion-studio/REFERENCE.md).

## Captions

When working with Captions, load [Remotion Captions](./remotion-captions/REFERENCE.md).

## Creating a SaaS, automation or application

Use the [Remotion SaaS skill](./remotion-saas/REFERENCE.md) for knowledge about Remotion-powered SaaS apps, such as `<Player>`, rendering on Lambda, Vercel, Cloudflare, via Express.js, client-side rendering, or for finding the right SaaS template.

## Looking up Remotion APIs and documentation

To find and read current Remotion documentation, load [Remotion Docs](./remotion-docs/REFERENCE.md).

## Upgrading

To upgrade Remotion, related packages, compatible Mediabunny packages, and installed Remotion Agent Skills, load [Remotion Upgrade](./remotion-upgrade/REFERENCE.md).

## Publishing to TikTok, YouTube Shorts, and Facebook Reels

When the user wants to publish, post, or upload a video to TikTok, YouTube Shorts, Facebook Reels, or social media — or asks for the full pipeline (create + voiceover + publish) — load the [Remotion Publish skill](../remotion-publish/SKILL.md).

This skill covers:
- Creating 9:16 portrait compositions for Shorts format
- Generating Vietnamese TTS with ElevenLabs
- Rendering the video
- Uploading to Cloudinary for public hosting
- Publishing to TikTok (<TIKTOK_HANDLE>), YouTube Shorts (<CHANNEL_NAME>), and Facebook Reels (<CHANNEL_NAME>) via Buffer API

## Video Production Pipelines & Templates

Use specialized video workflows based on format and audience intent:
- **FOMO Repo & Tool Social Videos (With Star Counters)**: For viral GitHub repo / AI breakthrough short-form videos with animated star counters, benchmark proof, and the shared brand CTA (`BrandCtaScene`), load the [FOMO Stars Social skill](../fomo-stars-social/SKILL.md).
- **FOMO Feature & Paradigm Shift Videos (With UI Mockups, No Stars)**: For viral repo/tool videos emphasizing paradigm shifts ("Thời đại X đã hết, bây giờ là thời của Y"), creator reputation, and real screenshots or simulated Remotion mockups WITHOUT mentioning stars, load the [FOMO Feature skill](../fomo-feature/SKILL.md).
- *(Future video skills such as tutorial walkthroughs, news roundups, or tool comparisons can be registered here as separate skills under `.agents/skills/<skill-name>`)*.

