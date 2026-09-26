import {interpolate, useCurrentFrame} from 'remotion';
import {at} from '../timeline';
import {appear, clamp, colors, Headline, Hi, mono, Pop, SceneShell} from '../shared';

const TASKS = ['fix auth', 'landing page', '???', 'viết test', 'refactor', 'SEO', '???', 'deploy', 'bug #41', 'docs'];

const Tab: React.FC<{i: number; lost: number}> = ({i, lost}) => {
  const frame = useCurrentFrame();
  const show = appear(frame, 6 + i * 3, 8);
  const blink = Math.floor((frame + i * 7) / 10) % 3 === 0;
  return (
    <div
      style={{
        opacity: show,
        scale: String(0.85 + 0.15 * show),
        borderRadius: 14,
        border: `1px solid ${lost > 0.5 ? colors.red + '88' : colors.line}`,
        background: lost > 0.5 ? '#2a1618' : colors.panel,
        padding: '12px 14px',
        fontFamily: mono,
        fontSize: 19,
        height: 96,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
        <span style={{width: 10, height: 10, borderRadius: 9, background: lost > 0.5 ? colors.red : colors.green}} />
        <span style={{color: colors.muted, fontWeight: 700}}>claude #{i + 1}</span>
      </div>
      <div style={{color: lost > 0.5 ? colors.red : colors.text, fontWeight: 700}}>
        {lost > 0.5 ? 'session lost' : `${TASKS[i % TASKS.length]}${blink ? ' ▋' : ''}`}
      </div>
    </div>
  );
};

export const Scene02Pain: React.FC = () => {
  const frame = useCurrentFrame();
  const b = at('02b-pain');
  const c = at('02c-pain');
  const reboot = interpolate(frame, [b + 30, b + 36, b + 42], [0, 1, 0], clamp);
  const cost = interpolate(frame, [c + 20, c + 130], [0, 347.2], {...clamp, easing: (t) => t * t});
  const loop = Math.floor(interpolate(frame, [c + 20, c + 130], [1, 58], clamp));

  return (
    <SceneShell scene={1} badge="VẤN ĐỀ" chapter="20 tab, 0 kiểm soát">
      <Pop delay={2}>
        <Headline size={56}>
          <Hi color={colors.orange}>20 tab</Hi> Claude Code cùng lúc?
        </Headline>
      </Pop>

      <div style={{position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14}}>
        {Array.from({length: 20}, (_, i) => (
          <Tab key={i} i={i} lost={frame >= b + 36 ? 1 : 0} />
        ))}
        <div
          style={{
            position: 'absolute',
            inset: -10,
            borderRadius: 18,
            background: '#fff',
            opacity: reboot * 0.85,
          }}
        />
      </div>

      <Pop delay={b + 38}>
        <div style={{textAlign: 'center', fontSize: 34, fontWeight: 850, color: colors.red}}>⟳ Khởi động lại máy → mất sạch ngữ cảnh</div>
      </Pop>

      <Pop delay={c + 6}>
        <div
          style={{
            borderRadius: 26,
            padding: '28px 32px',
            background: '#2a1618',
            border: `2px solid ${colors.red}88`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{fontSize: 26, fontWeight: 800, color: colors.muted}}>Hóa đơn token</div>
            <div style={{fontFamily: mono, fontSize: 30, color: colors.red, marginTop: 6}}>↻ vòng lặp lần {loop}</div>
          </div>
          <div style={{fontFamily: mono, fontSize: 92, fontWeight: 900, color: colors.red, letterSpacing: '-0.03em'}}>
            ${cost.toFixed(2)}
          </div>
        </div>
      </Pop>
    </SceneShell>
  );
};
