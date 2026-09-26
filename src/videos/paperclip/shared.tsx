import {Audio} from '@remotion/media';
import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {SCENE_LINES} from './timeline';

export const colors = {
  bg: '#121212',
  panel: '#1c1c1e',
  panelSub: '#242427',
  line: '#38383d',
  text: '#f6eed8',
  muted: '#b9b3a4',
  dim: '#7d786d',
  accent: '#f472b6', // paperclip banner pink
  orange: '#fb923c',
  purple: '#a78bfa',
  red: '#ff5d5d',
  green: '#4ade80',
  blue: '#60a5fa',
  amber: '#fbbf24',
};

export const mono = '"JetBrains Mono", "Cascadia Code", Consolas, monospace';
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const appear = (frame: number, start: number, len = 12) =>
  interpolate(frame, [start, start + len], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

export const SceneShell: React.FC<{
  scene: number;
  badge: string;
  chapter: string;
  children: ReactNode;
}> = ({scene, badge, chapter, children}) => {
  const frame = useCurrentFrame();
  const lines = SCENE_LINES[scene];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: '"Be Vietnam Pro", system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 20% 12%, rgba(244,114,182,0.16) 0%, transparent 50%), radial-gradient(circle at 85% 90%, rgba(251,146,60,0.12) 0%, transparent 55%)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.14,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.55) 1.3px, transparent 1.3px)',
          backgroundSize: '40px 40px',
          translate: `0px ${-frame * 0.05}px`,
        }}
      />

      {lines.map((l) => (
        <Sequence key={l.id} from={l.from} durationInFrames={l.dur + 4} layout="none" name={`VO ${l.id}`}>
          <Audio src={staticFile(`videos/paperclip/voiceover/${l.id}.mp3`)} />
        </Sequence>
      ))}

      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 84,
          left: 64,
          right: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div
            style={{
              padding: '9px 18px',
              borderRadius: 12,
              background: 'rgba(244,114,182,0.14)',
              border: `1px solid ${colors.accent}55`,
              color: colors.accent,
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: '0.08em',
            }}
          >
            {badge}
          </div>
          <div style={{color: colors.muted, fontSize: 22, fontWeight: 700}}>{chapter}</div>
        </div>
        <div style={{color: colors.dim, fontSize: 20, fontWeight: 800, letterSpacing: '0.04em', fontFamily: mono}}>
          paperclipai/paperclip
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 170,
          left: 64,
          right: 64,
          bottom: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 26,
        }}
      >
        {children}
      </div>

      {/* Captions: visible only while the matching clip is speaking */}
      {lines.map((l) => (
        <Sequence key={`cap-${l.id}`} from={l.from} durationInFrames={l.dur} layout="none">
          <Caption text={l.caption} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const Caption: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const p = appear(frame, 0, 7);
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        right: 64,
        bottom: 190,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          padding: '20px 30px',
          borderRadius: 20,
          border: `1px solid ${colors.line}`,
          borderLeft: `8px solid ${colors.accent}`,
          backgroundColor: 'rgba(18,18,18,0.95)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
          fontSize: 36,
          fontWeight: 750,
          lineHeight: 1.35,
          textAlign: 'center',
          opacity: p,
          translate: `0px ${(1 - p) * 10}px`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const Pop: React.FC<{delay: number; children: ReactNode; style?: CSSProperties}> = ({
  delay,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 16, stiffness: 130}});
  return (
    <div style={{opacity: interpolate(p, [0, 0.5, 1], [0, 0.8, 1]), translate: `0px ${(1 - p) * 30}px`, ...style}}>
      {children}
    </div>
  );
};

export const Card: React.FC<{title: string; tag?: string; tagColor?: string; children: ReactNode; style?: CSSProperties}> = ({
  title,
  tag,
  tagColor = colors.accent,
  children,
  style,
}) => (
  <div
    style={{
      borderRadius: 24,
      background: colors.panel,
      border: `1px solid ${colors.line}`,
      boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    <div
      style={{
        padding: '16px 24px',
        background: colors.panelSub,
        borderBottom: `1px solid ${colors.line}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <span style={{width: 14, height: 14, borderRadius: 99, background: '#ff5f56'}} />
        <span style={{width: 14, height: 14, borderRadius: 99, background: '#ffbd2e'}} />
        <span style={{width: 14, height: 14, borderRadius: 99, background: '#27c93f'}} />
        <span style={{marginLeft: 12, fontSize: 21, color: colors.muted, fontWeight: 700}}>{title}</span>
      </div>
      {tag ? (
        <span
          style={{
            padding: '5px 12px',
            borderRadius: 8,
            background: `${tagColor}22`,
            color: tagColor,
            fontSize: 18,
            fontWeight: 900,
          }}
        >
          {tag}
        </span>
      ) : null}
    </div>
    <div style={{padding: 28, flex: 1, display: 'flex', flexDirection: 'column'}}>{children}</div>
  </div>
);

export const Headline: React.FC<{children: ReactNode; size?: number}> = ({children, size = 58}) => (
  <div style={{fontSize: size, fontWeight: 900, lineHeight: 1.14, letterSpacing: '-0.02em'}}>{children}</div>
);

export const Hi: React.FC<{children: ReactNode; color?: string}> = ({children, color = colors.accent}) => (
  <span style={{color}}>{children}</span>
);

// A terminal line: `cmd` lines are typed out (with key SFX) starting at `at`; output lines fade in.
export type TermLine = {at: number; text: string; kind?: 'cmd' | 'out' | 'ok' | 'bad' | 'dim'; speed?: number};

const typedLen = (frame: number, l: TermLine) =>
  l.kind === 'cmd' || l.kind === undefined
    ? Math.max(0, Math.min(l.text.length, Math.floor((frame - l.at) * (l.speed ?? 1.6))))
    : frame >= l.at
      ? l.text.length
      : 0;

export const Terminal: React.FC<{title: string; lines: TermLine[]; fontSize?: number; style?: CSSProperties}> = ({
  title,
  lines,
  fontSize = 27,
  style,
}) => {
  const frame = useCurrentFrame();
  const visible = lines.filter((l) => frame >= l.at);
  const caretOn = Math.floor(frame / 12) % 2 === 0;
  return (
    <Card title={title} style={style}>
      {lines.flatMap((l, i) => {
        if (l.kind && l.kind !== 'cmd') return [];
        const dur = Math.ceil(l.text.length / (l.speed ?? 1.6));
        return Array.from({length: Math.floor(dur / 3)}, (_, k) => (
          <Sequence key={`k${i}-${k}`} from={l.at + k * 3} durationInFrames={4} layout="none">
            <Audio src={staticFile('sfx/key.mp3')} volume={0.22} />
          </Sequence>
        ));
      })}
      <div style={{fontFamily: mono, fontSize, lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 4}}>
        {visible.map((l, i) => {
          const isCmd = l.kind === 'cmd' || l.kind === undefined;
          const color =
            l.kind === 'ok'
              ? colors.green
              : l.kind === 'bad'
                ? colors.red
                : l.kind === 'dim'
                  ? colors.dim
                  : isCmd
                    ? colors.text
                    : colors.muted;
          const shown = l.text.slice(0, typedLen(frame, l));
          const last = i === visible.length - 1;
          return (
            <div key={i} style={{color, whiteSpace: 'pre-wrap', wordBreak: 'break-all', opacity: isCmd ? 1 : appear(frame, l.at, 6)}}>
              {isCmd ? <span style={{color: colors.accent}}>$ </span> : null}
              {shown}
              {last && isCmd && caretOn ? <span style={{color: colors.accent}}>▋</span> : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// Realistic mouse cursor that eases between waypoints (canvas px, scene frames) with click ripple + SFX.
export type Waypoint = {f: number; x: number; y: number};

export const Cursor: React.FC<{path: Waypoint[]; clicks: number[]; from?: number}> = ({path, clicks, from = path[0].f}) => {
  const frame = useCurrentFrame();
  let x = path[0].x;
  let y = path[0].y;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    if (frame >= a.f) {
      const t = interpolate(frame, [a.f, b.f], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
      x = a.x + (b.x - a.x) * t;
      y = a.y + (b.y - a.y) * t;
    }
  }
  const visible = interpolate(frame, [from, from + 8], [0, 1], clamp);
  const press = clicks.reduce((s, c) => Math.min(s, interpolate(frame, [c - 2, c, c + 4], [1, 0.82, 1], clamp)), 1);
  return (
    <>
      {clicks.map((c) => (
        <Sequence key={`sfx${c}`} from={c} durationInFrames={10} layout="none">
          <Audio src={staticFile('sfx/click.mp3')} volume={0.6} />
        </Sequence>
      ))}
      {clicks.map((c) => {
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
              border: `4px solid ${colors.accent}`,
              opacity: 1 - p,
              scale: String(0.3 + p * 0.9),
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
          scale: String(press),
          transformOrigin: '2px 2px',
          filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.45))',
          zIndex: 41,
        }}
      >
        <path d="M1 1 L1 22 L6.5 16.8 L10.2 25.5 L13.6 24 L10 15.6 L17.5 15.6 Z" fill="#fff" stroke="#111" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </>
  );
};
