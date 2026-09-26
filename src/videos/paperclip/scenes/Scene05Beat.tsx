import {useCurrentFrame} from 'remotion';
import {at} from '../timeline';
import {appear, Card, colors, Headline, Hi, mono, Pop, SceneShell} from '../shared';

const WAKES = [
  {t: '09:00', a: 'CTO', s: 'check PAP-142 → code'},
  {t: '09:30', a: 'Marketer', s: 'viết bài social'},
  {t: '10:00', a: 'CEO', s: 'review tiến độ tuần'},
];

const CHAIN = [
  {k: 'MISSION', v: 'App ghi chú #1, $1M MRR', c: colors.accent},
  {k: 'PROJECT', v: 'Ra mắt bản web', c: colors.purple},
  {k: 'TASK', v: 'PAP-142 · Trang đăng ký', c: colors.orange},
];

export const Scene05Beat: React.FC = () => {
  const frame = useCurrentFrame();
  const b = at('05b-beat');
  const c = at('05c-beat');

  return (
    <SceneShell scene={4} badge="HEARTBEAT" chapter="Tự thức dậy, tự làm">
      <Pop delay={2}>
        <Headline size={52}>
          Agent <Hi>tự thức dậy</Hi> theo lịch
        </Headline>
      </Pop>

      <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
        {WAKES.map((w, i) => {
          const p = appear(frame, 14 + i * 22);
          return (
            <div
              key={w.t}
              style={{
                opacity: p,
                translate: `${(1 - p) * -30}px 0px`,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '16px 22px',
                borderRadius: 16,
                background: colors.panel,
                border: `1px solid ${colors.line}`,
                fontSize: 28,
              }}
            >
              <span style={{fontFamily: mono, color: colors.amber, fontWeight: 800}}>⏰ {w.t}</span>
              <span style={{fontWeight: 900, color: colors.accent}}>{w.a}</span>
              <span style={{color: colors.muted}}>{w.s}</span>
            </div>
          );
        })}
      </div>

      <Pop delay={b}>
        <Card title="PAP-142 · Trang đăng ký" tag="TICKET" tagColor={colors.orange}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, fontSize: 25}}>
            {[
              ['CEO', 'Giao cho CTO, hạn thứ 6.'],
              ['CTO', 'Đã checkout task, đang code form.'],
              ['CTO', 'Xong. Đính kèm diff + screenshot.'],
            ].map(([who, msg], i) => (
              <div key={i} style={{opacity: appear(frame, b + 10 + i * 20), display: 'flex', gap: 12}}>
                <span style={{fontWeight: 900, color: colors.accent, minWidth: 70}}>{who}</span>
                <span style={{color: colors.text}}>{msg}</span>
              </div>
            ))}
            <div style={{opacity: appear(frame, b + 70), fontFamily: mono, fontSize: 21, color: colors.green}}>
              ✓ session được lưu — reboot vẫn làm tiếp
            </div>
          </div>
        </Card>
      </Pop>

      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 6}}>
        {[...CHAIN].reverse().map((n, i) => {
          const p = appear(frame, c + 8 + i * 22);
          return (
            <div key={n.k} style={{opacity: p}}>
              {i > 0 ? <div style={{textAlign: 'center', color: colors.dim, fontSize: 26, lineHeight: 1}}>↑</div> : null}
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                  padding: '12px 20px',
                  borderRadius: 14,
                  border: `2px solid ${n.c}88`,
                  background: `${n.c}14`,
                  fontSize: 27,
                }}
              >
                <span style={{fontFamily: mono, fontSize: 20, fontWeight: 900, color: n.c, minWidth: 120}}>{n.k}</span>
                <span style={{fontWeight: 800}}>{n.v}</span>
              </div>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};
