import {Audio} from '@remotion/media';
import type {ReactNode} from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {BRAND} from '../../brand';

// Shared closing CTA: follow / like / save the channel. Brand name + handle come from src/brand.ts;
// the voiceover (voiceover-config.ts) is brand-neutral. Beats are timed to the measured clips.

// Voiceover clips (frames @30fps), measured with ffprobe.
const VO = [
  {id: '01a-hook', start: 8, dur: 59},
  {id: '01b-follow', start: 79, dur: 98},
  {id: '01c-save', start: 191, dur: 80},
] as const;

export const BRAND_CTA_FRAMES = 310;

const T = {
  cardIn: [0, 20] as const,
  followClick: 128,
  heartClick: 214,
  saveClick: 244,
  handleIn: [256, 276] as const,
};

const CLICKS = [T.followClick, T.heartClick, T.saveClick];

// Cursor tip positions in canvas px; segments ease between consecutive waypoints.
const PATH = [
  {f: 0, x: 930, y: 1500},
  {f: 90, x: 930, y: 1500},
  {f: 124, x: 540, y: 905},
  {f: 160, x: 640, y: 1000},
  {f: 210, x: 390, y: 1085},
  {f: 228, x: 392, y: 1088},
  {f: 240, x: 690, y: 1085},
  {f: 310, x: 694, y: 1090},
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const fadeIn = (frame: number, [a, b]: readonly [number, number]) =>
  interpolate(frame, [a, b], [0, 1], clamp);

const cursorAt = (frame: number) => {
  for (let i = 0; i < PATH.length - 1; i++) {
    const p = PATH[i];
    const q = PATH[i + 1];
    if (frame <= q.f) {
      const t = interpolate(frame, [p.f, q.f], [0, 1], {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      });
      return {x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t};
    }
  }
  const last = PATH[PATH.length - 1];
  return {x: last.x, y: last.y};
};

const Cursor: React.FC<{frame: number}> = ({frame}) => {
  const {x, y} = cursorAt(frame);
  const visible = interpolate(frame, [88, 96], [0, 1], clamp);
  const press = CLICKS.reduce(
    (s, c) => Math.min(s, interpolate(frame, [c - 2, c, c + 4], [1, 0.82, 1], clamp)),
    1,
  );
  return (
    <>
      {CLICKS.map((c) => {
        const p = interpolate(frame, [c, c + 14], [0, 1], clamp);
        if (frame < c || p >= 1) return null;
        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: x - 36,
              top: y - 36,
              width: 72,
              height: 72,
              borderRadius: 999,
              border: `4px solid ${BRAND.accent}`,
              opacity: 1 - p,
              scale: 0.3 + p * 0.9,
              zIndex: 40,
            }}
          />
        );
      })}
      <svg
        width={46}
        height={58}
        viewBox="0 0 23 29"
        style={{
          position: 'absolute',
          left: x - 2,
          top: y - 2,
          opacity: visible,
          scale: press,
          transformOrigin: '2px 2px',
          filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.45))',
          zIndex: 41,
        }}
      >
        <path
          d="M1 1 L1 22 L6.5 16.8 L10.2 25.5 L13.6 24 L10 15.6 L17.5 15.6 Z"
          fill="#fff"
          stroke="#111"
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

const Hi: React.FC<{children: ReactNode}> = ({children}) => (
  <span style={{color: BRAND.accent}}>{children}</span>
);

const CAPTIONS: ReactNode[] = [
  <>Thấy hay thì đừng lướt qua vội nhé!</>,
  <>
    Bấm <Hi>theo dõi kênh</Hi>, mỗi ngày một công cụ AI xịn cho bạn.
  </>,
  <>
    <Hi>Thả tim, lưu video</Hi> lại, cần là mở ra dùng liền!
  </>,
];

const initials = BRAND.name
  .split(/\s+/)
  .map((w) => w[0])
  .join('')
  .slice(0, 2)
  .toUpperCase();

const ActionButton: React.FC<{icon: string; label: string; active: boolean; pulse: number}> = ({
  icon,
  label,
  active,
  pulse,
}) => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      padding: '24px 0',
      borderRadius: 22,
      backgroundColor: active ? `${BRAND.accent}22` : 'rgba(255,255,255,0.05)',
      border: `2px solid ${active ? BRAND.accent : 'rgba(255,255,255,0.12)'}`,
    }}
  >
    <span style={{fontSize: 58, scale: pulse, filter: active ? 'none' : 'grayscale(1) brightness(1.6)'}}>
      {icon}
    </span>
    <span style={{fontSize: 24, fontWeight: 800, color: active ? '#fff' : 'rgba(255,255,255,0.6)'}}>
      {label}
    </span>
  </div>
);

export type BrandCtaSceneProps = {
  withVoiceover?: boolean;
};

export const BrandCtaScene: React.FC<BrandCtaSceneProps> = ({withVoiceover = true}) => {
  const frame = useCurrentFrame();

  const cardIn = fadeIn(frame, T.cardIn);
  const cardScale = interpolate(frame, [0, 22], [0.92, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.15)),
    output: 'perceptual-scale',
  });

  const followed = frame >= T.followClick;
  const followDown = frame >= T.followClick - 2 && frame <= T.followClick + 4;
  const bump = (c: number) =>
    interpolate(frame, [c, c + 8, c + 20], [1, 1.35, 1], {...clamp, easing: Easing.inOut(Easing.sin)});

  const handleIn = fadeIn(frame, T.handleIn);
  const handleY = interpolate(frame, T.handleIn, [24, 0], {...clamp, easing: Easing.out(Easing.cubic)});

  const captionIdx = VO.reduce((acc, v, i) => (frame >= v.start - 3 ? i : acc), 0);
  const captionStart = VO[captionIdx].start - 3;
  const captionPop = interpolate(frame, [captionStart, captionStart + 7], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        backgroundColor: '#0c0d10',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {withVoiceover
        ? VO.map((v) => (
            <Sequence key={v.id} from={v.start} durationInFrames={v.dur + 6} layout="none">
              <Audio src={staticFile(`videos/brand-cta/voiceover/${v.id}.mp3`)} />
            </Sequence>
          ))
        : null}
      {CLICKS.map((c) => (
        <Sequence key={`c${c}`} from={c - 1} durationInFrames={6} layout="none">
          <Audio src={staticFile('sfx/click.mp3')} volume={0.55} />
        </Sequence>
      ))}

      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 22% 18%, ${BRAND.accent}55 0%, transparent 55%), radial-gradient(circle at 82% 86%, rgba(125,207,255,0.14) 0%, transparent 60%), #0c0d10`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.18,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1.4px, transparent 1.4px)',
          backgroundSize: '38px 38px',
        }}
      />

      {/* Channel card */}
      <div
        style={{
          position: 'absolute',
          top: 380,
          left: 64,
          right: 64,
          padding: '56px 48px 48px',
          borderRadius: 34,
          backgroundColor: 'rgba(22,23,28,0.92)',
          border: '1px solid rgba(255,255,255,0.16)',
          boxShadow: '0 40px 110px rgba(0,0,0,0.55)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: cardIn,
          scale: cardScale,
        }}
      >
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${BRAND.accent} 0%, ${BRAND.accentDeep} 100%)`,
            boxShadow: `0 0 0 8px rgba(255,255,255,0.08), 0 20px 50px ${BRAND.accent}66`,
            fontSize: 76,
            fontWeight: 950,
            color: '#fff',
          }}
        >
          {initials}
        </div>
        <div style={{fontSize: 58, fontWeight: 950, color: '#fff', marginTop: 30, letterSpacing: -1}}>
          {BRAND.name}
        </div>
        <div style={{fontSize: 30, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginTop: 6}}>
          {BRAND.handle}
        </div>
        <div style={{fontSize: 28, color: 'rgba(255,255,255,0.8)', marginTop: 14}}>{BRAND.tagline}</div>

        <div
          style={{
            marginTop: 36,
            width: '100%',
            padding: '26px 0',
            borderRadius: 20,
            textAlign: 'center',
            fontSize: 36,
            fontWeight: 900,
            color: '#fff',
            backgroundColor: followed ? 'rgba(255,255,255,0.1)' : BRAND.accent,
            border: `2px solid ${followed ? 'rgba(255,255,255,0.25)' : BRAND.accent}`,
            boxShadow: followed ? 'none' : `0 16px 40px ${BRAND.accent}66`,
            scale: followDown ? 0.96 : 1,
          }}
        >
          {followed ? '✓ Đang theo dõi' : '+ Theo dõi'}
        </div>

        <div style={{display: 'flex', gap: 22, width: '100%', marginTop: 26}}>
          <ActionButton icon="❤️" label="Thả tim" active={frame >= T.heartClick} pulse={bump(T.heartClick)} />
          <ActionButton icon="🔖" label="Lưu lại" active={frame >= T.saveClick} pulse={bump(T.saveClick)} />
        </div>
      </div>

      {/* Handle reveal */}
      <div
        style={{
          position: 'absolute',
          left: 64,
          right: 64,
          top: 1330,
          textAlign: 'center',
          fontSize: 46,
          fontWeight: 950,
          color: '#fff',
          opacity: handleIn,
          translate: `0px ${handleY}px`,
        }}
      >
        Theo dõi <Hi>{BRAND.handle}</Hi>
      </div>

      {/* Caption synced to the current voiceover sentence */}
      <div
        style={{
          position: 'absolute',
          left: 64,
          right: 64,
          bottom: 180,
          padding: '24px 28px 26px 30px',
          borderRadius: 22,
          border: `1px solid ${BRAND.accent}66`,
          borderLeft: `8px solid ${BRAND.accent}`,
          backgroundColor: 'rgba(12,13,16,0.95)',
          boxShadow: '0 24px 75px rgba(0,0,0,0.65)',
          fontSize: 32,
          fontWeight: 750,
          lineHeight: 1.35,
          color: '#fff',
          opacity: fadeIn(frame, [VO[0].start - 3, VO[0].start + 4]),
        }}
      >
        <div style={{opacity: captionPop, translate: `0px ${(1 - captionPop) * 10}px`}}>
          {CAPTIONS[captionIdx]}
        </div>
      </div>

      <Cursor frame={frame} />
    </AbsoluteFill>
  );
};
