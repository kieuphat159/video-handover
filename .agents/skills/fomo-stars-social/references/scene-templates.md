# Remotion Scene Templates for FOMO Stars Videos

These standard React Remotion components form the modular foundation of every video in the `fomo-stars-social` pipeline.

---

## 1. `shared.tsx` Template

```tsx
import type {ReactNode} from 'react';
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from 'remotion';

export const palette = {
  bg: '#0d1117',
  darkBg: '#080c10',
  panel: '#161b22',
  accent: '#58a6ff',       // Primary theme color
  cyan: '#39d353',         // Accent/Success green
  magenta: '#bc8cff',      // AI highlight
  yellow: '#e3b341',       // Stars & CTA highlight
  red: '#f85149',          // Pain points
  ink: '#e6edf3',          // Text
  muted: '#8b949e',        // Subtitle / comments
};

export const SceneShell: React.FC<{
  children: ReactNode;
  index: string;
  kicker: string;
  total?: string;
}> = ({children, index, kicker, total = '05'}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        backgroundColor: palette.bg,
        color: palette.ink,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      }}
    >
      {/* Background Matrix Grid */}
      <AbsoluteFill
        style={{
          opacity: 0.18,
          backgroundImage: 'radial-gradient(rgba(88, 166, 255, 0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '38px 38px',
          translate: interpolate(frame, [0, 450], ['0px 0px', '-38px -38px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />

      {/* Atmospheric Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: 999,
          top: -300,
          right: -250,
          background: 'radial-gradient(circle, rgba(88,166,255,0.22) 0%, transparent 75%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Top Status Bar */}
      <Interactive.Div
        name="Top status bar"
        style={{
          position: 'absolute',
          top: 86,
          left: 64,
          right: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 28px',
          borderRadius: 18,
          backgroundColor: 'rgba(8,12,16,0.88)',
          border: '1px solid rgba(88,166,255,0.22)',
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 2.2,
          color: palette.muted,
          zIndex: 10,
          backdropFilter: 'blur(14px)',
        }}
      >
        <span style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: 99,
              backgroundColor: palette.cyan,
              boxShadow: '0 0 16px rgba(57,211,83,0.9)',
            }}
          />
          <span style={{color: palette.ink, fontWeight: 900}}>PROJECT_NAME</span>
          <span style={{color: palette.accent}}>•</span>
          <span>{kicker}</span>
        </span>
        <span style={{color: palette.accent, fontWeight: 900}}>
          {index}/{total}
        </span>
      </Interactive.Div>

      {children}
    </AbsoluteFill>
  );
};

export const CaptionBar: React.FC<{children: ReactNode; accent?: string}> = ({
  children,
  accent = palette.accent,
}) => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name="Caption"
      style={{
        position: 'absolute',
        left: 64,
        right: 170, // Safe zone: clear of TikTok/Reels right action icons
        bottom: 180, // Safe zone: clear of platform bottom audio/caption overlay
        padding: '24px 28px 26px 30px',
        borderRadius: 22,
        border: '1px solid rgba(88,166,255,0.25)',
        borderLeft: '8px solid ' + accent,
        backgroundColor: 'rgba(8,12,16,0.95)',
        boxShadow: '0 24px 75px rgba(0,0,0,0.70)',
        fontSize: 33,
        fontWeight: 750,
        lineHeight: 1.35,
        color: palette.ink,
        opacity: interpolate(frame, [3, 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        translate: interpolate(frame, [3, 12], ['0px 18px', '0px 0px'], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        zIndex: 20,
        backdropFilter: 'blur(10px)',
      }}
    >
      {children}
    </Interactive.Div>
  );
};

export const MiniBadge: React.FC<{children: ReactNode; color?: string; bg?: string}> = ({
  children,
  color = palette.accent,
  bg,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 18px',
      borderRadius: 999,
      border: '1px solid ' + color + '55',
      backgroundColor: bg ?? (color + '18'),
      color,
      fontSize: 21,
      fontWeight: 850,
      letterSpacing: 1.2,
    }}
  >
    {children}
  </div>
);
```

---

## 2. Animated Star Counter Hook (`IntroScene.tsx`)

```tsx
const starCount = Math.floor(
  interpolate(frame, [8, 55], [0, VERIFIED_STARS], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  }),
);

<div style={{fontSize: 110, fontWeight: 950, color: palette.yellow}}>
  {starCount.toLocaleString('vi-VN')} ★
</div>
```

---

## 3. Closing CTA — shared `BrandCtaScene` (do not build an `OutroScene.tsx`)

Every video ends on the shared scene. Append it as the last sequence of the main composition:

```tsx
import {fade} from '@remotion/transitions/fade';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {BrandCtaScene, BRAND_CTA_FRAMES} from '../shared/BrandCtaScene';

// ...last content scene...
<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 10})} />
<TransitionSeries.Sequence durationInFrames={BRAND_CTA_FRAMES} name="CTA">
  <BrandCtaScene />
</TransitionSeries.Sequence>
```

Total composition frames = sum of sequences − transition overlaps (the CTA counts toward the 80–110s target).
