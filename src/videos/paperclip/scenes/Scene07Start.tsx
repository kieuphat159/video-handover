import {Img, staticFile, useCurrentFrame} from 'remotion';
import {at} from '../timeline';
import {appear, Card, colors, Headline, Hi, mono, Pop, SceneShell, Terminal} from '../shared';

export const Scene07Start: React.FC = () => {
  const frame = useCurrentFrame();
  const a = at('07a-start');
  const b = at('07b-start');
  const c = at('07c-start');

  return (
    <SceneShell scene={6} badge="BẮT ĐẦU" chapter="1 dòng lệnh là chạy">
      <Pop delay={2}>
        <Headline size={54}>
          Chạy thử chỉ <Hi>1 dòng lệnh</Hi>
        </Headline>
      </Pop>

      <Pop delay={a}>
        <Terminal
          title="terminal"
          fontSize={27}
          lines={[
            {at: a + 12, text: 'npx paperclipai onboard --yes', speed: 1.2},
            {at: b + 4, text: '# Node.js 24.11+ • 1 tiến trình Node', kind: 'dim'},
            {at: b + 30, text: '✓ embedded PostgreSQL: tự tạo', kind: 'ok'},
            {at: b + 60, text: '✓ trusted local mode (loopback)', kind: 'ok'},
          ]}
        />
      </Pop>

      <Pop delay={b + 20}>
        <Card title="README · The Four Pillars" tag="ẢNH THẬT" tagColor={colors.green}>
          <div style={{margin: -28, overflow: 'hidden', height: 520}}>
            <Img src={staticFile('videos/paperclip/assets/four-pillars-dark.png')} style={{width: '100%', display: 'block', marginTop: 24}} />
          </div>
        </Card>
      </Pop>

      <div style={{display: 'flex', gap: 14, justifyContent: 'center'}}>
        {['MIT', 'Tự host', 'Không cần tài khoản'].map((t, i) => {
          const p = appear(frame, c + i * 14);
          return (
            <span
              key={t}
              style={{
                opacity: p,
                scale: String(0.8 + 0.2 * p),
                padding: '14px 24px',
                borderRadius: 14,
                background: `${colors.green}22`,
                border: `2px solid ${colors.green}88`,
                color: colors.green,
                fontSize: 30,
                fontWeight: 900,
                fontFamily: i === 0 ? mono : undefined,
              }}
            >
              ✓ {t}
            </span>
          );
        })}
      </div>
    </SceneShell>
  );
};
