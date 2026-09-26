import {interpolate, useCurrentFrame} from 'remotion';
import {at} from '../timeline';
import {appear, clamp, colors, Headline, Hi, mono, Pop, SceneShell} from '../shared';

const Node: React.FC<{title: string; who: string; boss?: string; color: string; delay: number; w?: number}> = ({
  title,
  who,
  boss,
  color,
  delay,
  w = 290,
}) => (
  <Pop delay={delay}>
    <div
      style={{
        width: w,
        borderRadius: 20,
        padding: '18px 20px',
        background: colors.panel,
        border: `2px solid ${color}99`,
        textAlign: 'center',
      }}
    >
      <div style={{fontSize: 32, fontWeight: 900, color}}>{title}</div>
      <div style={{fontFamily: mono, fontSize: 21, color: colors.muted, marginTop: 4}}>{who}</div>
      {boss ? <div style={{fontSize: 19, color: colors.dim, marginTop: 4}}>báo cáo → {boss}</div> : null}
    </div>
  </Pop>
);

const ADAPTERS = ['Claude Code', 'Codex', 'Cursor', 'bash', 'HTTP bot'];

export const Scene04Org: React.FC = () => {
  const frame = useCurrentFrame();
  const b = at('04b-org');
  const c = at('04c-org');
  const wire = appear(frame, 30, 20);
  // ECG-style heartbeat sweep
  const sweep = interpolate(frame, [c, c + 60], [0, 1], clamp);
  const beatPath = 'M0 60 L220 60 L250 60 L270 15 L295 105 L320 40 L340 60 L560 60 L590 60 L610 15 L635 105 L660 40 L680 60 L952 60';

  return (
    <SceneShell scene={3} badge="ORG CHART" chapter="Agent cũng có sếp">
      <Pop delay={2}>
        <Headline size={52}>
          Có <Hi>chức danh</Hi>, có <Hi color={colors.orange}>sếp</Hi>, có mô tả công việc
        </Headline>
      </Pop>

      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0}}>
        <Node title="CEO" who="claude-code" color={colors.accent} delay={10} w={340} />
        <svg width={700} height={60} style={{opacity: wire}}>
          <path d="M350 0 V30 M120 30 H580 M120 30 V60 M350 30 V60 M580 30 V60" stroke={colors.line} strokeWidth={4} fill="none" />
        </svg>
        <div style={{display: 'flex', gap: 18}}>
          <Node title="CTO" who="codex" boss="CEO" color={colors.blue} delay={30} w={296} />
          <Node title="Designer" who="cursor" boss="CEO" color={colors.purple} delay={40} w={296} />
          <Node title="Marketer" who="http-bot" boss="CEO" color={colors.orange} delay={50} w={296} />
        </div>
      </div>

      <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center'}}>
        {ADAPTERS.map((a, i) => (
          <span
            key={a}
            style={{
              opacity: appear(frame, b + i * 18),
              translate: `0px ${(1 - appear(frame, b + i * 18)) * 16}px`,
              padding: '12px 22px',
              borderRadius: 14,
              background: colors.panelSub,
              border: `1px solid ${colors.line}`,
              fontFamily: mono,
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            {a}
          </span>
        ))}
      </div>

      <Pop delay={c}>
        <div
          style={{
            borderRadius: 24,
            padding: '22px 22px 26px',
            background: `linear-gradient(135deg, ${colors.red}22, ${colors.panel})`,
            border: `2px solid ${colors.red}77`,
          }}
        >
          <svg width="100%" height={120} viewBox="0 0 952 120" preserveAspectRatio="none">
            <path d={beatPath} stroke={colors.line} strokeWidth={5} fill="none" />
            <path
              d={beatPath}
              stroke={colors.red}
              strokeWidth={6}
              fill="none"
              strokeDasharray={1400}
              strokeDashoffset={1400 * (1 - sweep)}
            />
          </svg>
          <div style={{textAlign: 'center', fontSize: 34, fontWeight: 900}}>
            💓 “If it can receive a heartbeat, <Hi color={colors.green}>it’s hired</Hi>.”
          </div>
        </div>
      </Pop>
    </SceneShell>
  );
};
