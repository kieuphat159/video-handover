import {interpolate, useCurrentFrame} from 'remotion';
import {at, end} from '../timeline';
import {appear, clamp, colors, Cursor, Headline, Hi, mono, Pop, SceneShell} from '../shared';

const TEAM = ['CEO', 'CTO', 'Kỹ sư', 'Designer', 'Marketer'];

const Step: React.FC<{n: string; title: string; delay: number; active: boolean; children: React.ReactNode}> = ({
  n,
  title,
  delay,
  active,
  children,
}) => (
  <Pop delay={delay}>
    <div
      style={{
        borderRadius: 24,
        padding: '26px 30px',
        background: active ? `linear-gradient(135deg, ${colors.accent}22, ${colors.panel})` : colors.panel,
        border: `2px solid ${active ? colors.accent : colors.line}`,
        display: 'flex',
        gap: 24,
      }}
    >
      <div style={{fontFamily: mono, fontSize: 52, fontWeight: 900, color: active ? colors.accent : colors.dim}}>{n}</div>
      <div style={{flex: 1}}>
        <div style={{fontSize: 36, fontWeight: 900}}>{title}</div>
        <div style={{marginTop: 12}}>{children}</div>
      </div>
    </div>
  </Pop>
);

export const Scene03Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const b = at('03b-steps');
  const c = at('03c-steps');
  const d = at('03d-steps');
  const click = end('03d-steps') - 14;
  const running = frame >= click;
  const budget = Math.round(interpolate(frame, [d + 10, d + 40], [0, 500], clamp));

  return (
    <SceneShell scene={2} badge="CÁCH HOẠT ĐỘNG" chapter="3 bước dựng công ty">
      <Pop delay={2}>
        <Headline size={54}>
          Biến mớ hỗn độn thành <Hi>một công ty</Hi>
        </Headline>
      </Pop>

      <Step n="01" title="Đặt mục tiêu" delay={b} active={frame >= b && frame < c}>
        <div
          style={{
            fontSize: 28,
            fontStyle: 'italic',
            color: colors.text,
            padding: '14px 18px',
            borderRadius: 14,
            background: colors.panelSub,
          }}
        >
          “Build the #1 AI note-taking app to <Hi color={colors.green}>$1M MRR</Hi>.”
        </div>
      </Step>

      <Step n="02" title="Tuyển đội" delay={c} active={frame >= c && frame < d}>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
          {TEAM.map((r, i) => (
            <span
              key={r}
              style={{
                opacity: appear(frame, c + 10 + i * 12),
                padding: '8px 16px',
                borderRadius: 12,
                background: `${colors.purple}22`,
                border: `1px solid ${colors.purple}66`,
                color: colors.purple,
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              {r}
            </span>
          ))}
        </div>
      </Step>

      <Step n="03" title="Duyệt & chạy" delay={d} active={frame >= d}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{fontSize: 26, color: colors.muted, fontWeight: 700}}>
            ✅ Chiến lược • 💰 Ngân sách <span style={{fontFamily: mono, color: colors.amber}}>${budget}/tháng</span>
          </div>
          <div
            style={{
              padding: '14px 28px',
              borderRadius: 14,
              background: running ? colors.green : colors.accent,
              color: '#111',
              fontSize: 30,
              fontWeight: 900,
            }}
          >
            {running ? '● Đang chạy' : '▶ Run'}
          </div>
        </div>
      </Step>

      <Cursor
        from={d}
        path={[
          {f: d, x: 640, y: 1250},
          {f: click - 6, x: 850, y: 1000},
          {f: click + 20, x: 858, y: 1012},
        ]}
        clicks={[click]}
      />
    </SceneShell>
  );
};
