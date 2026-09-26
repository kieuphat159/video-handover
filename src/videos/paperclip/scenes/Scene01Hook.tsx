import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {at} from '../timeline';
import {appear, Card, clamp, colors, Headline, Hi, mono, Pop, SceneShell} from '../shared';

// Star count checked via GitHub API on 26/9/2026 (85,207); repo created 2/3/2026.
const STARS = 85207;

const Role: React.FC<{icon: string; label: string; sub: string; color: string; delay: number}> = ({
  icon,
  label,
  sub,
  color,
  delay,
}) => (
  <Pop delay={delay} style={{flex: 1, display: 'flex'}}>
    <div
      style={{
        flex: 1,
        padding: '26px 22px',
        borderRadius: 24,
        background: colors.panel,
        border: `2px solid ${color}88`,
        textAlign: 'center',
      }}
    >
      <div style={{fontSize: 64, lineHeight: 1.1}}>{icon}</div>
      <div style={{fontSize: 40, fontWeight: 900, color, marginTop: 8}}>{label}</div>
      <div style={{fontSize: 26, fontWeight: 700, color: colors.muted, marginTop: 4}}>{sub}</div>
    </div>
  </Pop>
);

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const count = interpolate(frame, [4, 62], [0, STARS], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const pulse = spring({frame: frame - 62, fps, config: {damping: 10, stiffness: 160}});
  const b = at('01b-hook');
  const c = at('01c-hook');
  const arrow = appear(frame, b + 40, 14);

  return (
    <SceneShell scene={0} badge="GITHUB REPO" chapter="Quản lý đội AI agent">
      <Pop delay={2}>
        <div
          style={{
            borderRadius: 30,
            padding: '32px 36px',
            background: `linear-gradient(135deg, ${colors.accent}30, ${colors.panel})`,
            border: `2px solid ${colors.accent}88`,
            display: 'flex',
            alignItems: 'center',
            gap: 28,
          }}
        >
          <div style={{fontSize: 124, lineHeight: 1, color: colors.amber, scale: String(1 + 0.12 * pulse * (1 - pulse))}}>★</div>
          <div>
            <div style={{fontFamily: mono, fontSize: 116, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1}}>
              {Math.round(count).toLocaleString('en-US')}
            </div>
            <div style={{fontSize: 34, fontWeight: 800, color: colors.muted, marginTop: 10}}>
              sao GitHub • chỉ sau <Hi color={colors.amber}>7 tháng</Hi>
            </div>
          </div>
        </div>
      </Pop>

      <div style={{display: 'flex', gap: 20, alignItems: 'center'}}>
        <Role icon="🧑‍💻" label="OpenClaw" sub="= 1 nhân viên" color={colors.blue} delay={b + 2} />
        <div style={{fontSize: 64, fontWeight: 900, color: colors.accent, opacity: arrow, translate: `${(1 - arrow) * -20}px 0px`}}>→</div>
        <Role icon="🏢" label="Paperclip" sub="= cả công ty" color={colors.accent} delay={b + 44} />
      </div>

      <Pop delay={c}>
        <Headline size={50}>
          App <Hi>mã nguồn mở</Hi> quản lý cả đội <Hi color={colors.orange}>AI agent</Hi> đi làm thay bạn
        </Headline>
      </Pop>

      <Pop delay={c + 16} style={{display: 'flex'}}>
        <Card title="github.com/paperclipai/paperclip" tag="ẢNH THẬT" tagColor={colors.green} style={{flex: 1}}>
          <div style={{margin: -28, overflow: 'hidden', height: 400}}>
            <Img
              src={staticFile('videos/paperclip/assets/banner.jpg')}
              style={{
                width: '100%',
                display: 'block',
                translate: `0px ${-interpolate(frame, [c + 30, c + 130], [60, 250], clamp)}px`,
              }}
            />
          </div>
        </Card>
      </Pop>
      <div style={{textAlign: 'center', fontSize: 21, color: colors.dim, fontFamily: mono, opacity: appear(frame, c + 30)}}>
        MIT • tạo ngày 2/3/2026 • số sao kiểm tra 26/9/2026
      </div>
    </SceneShell>
  );
};
