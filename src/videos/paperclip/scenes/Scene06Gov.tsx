import {interpolate, useCurrentFrame} from 'remotion';
import {at, end} from '../timeline';
import {appear, Card, clamp, colors, Cursor, Headline, Hi, mono, Pop, SceneShell} from '../shared';

const BUDGETS = [
  {a: 'CTO', cap: 400, to: 0.62, c: colors.blue},
  {a: 'Marketer', cap: 150, to: 1, c: colors.orange},
  {a: 'Designer', cap: 200, to: 0.41, c: colors.purple},
];

const LOG = [
  '11:02  board   duyệt tuyển "QA Engineer"',
  '11:05  system  Marketer chạm trần $150 → pause',
  '11:09  board   terminate agent "Intern-3"',
];

export const Scene06Gov: React.FC = () => {
  const frame = useCurrentFrame();
  const b = at('06b-gov');
  const c = at('06c-gov');
  const click1 = b + 40;
  const click2 = end('06b-gov') - 16;
  const approved = frame >= click1;
  const paused = frame >= click2;

  return (
    <SceneShell scene={5} badge="GOVERNANCE" chapter="Bạn vẫn là sếp">
      <Pop delay={2}>
        <Headline size={52}>
          Chạm trần ngân sách là <Hi color={colors.red}>tự dừng</Hi>
        </Headline>
      </Pop>

      <Card title="Budget • tháng 9" tag="COST CONTROL" tagColor={colors.amber}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
          {BUDGETS.map((x, i) => {
            const p = interpolate(frame, [12 + i * 8, 70 + i * 8], [0, x.to], clamp);
            const hit = p >= 0.999;
            return (
              <div key={x.a}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, fontWeight: 800}}>
                  <span>{x.a}</span>
                  <span style={{fontFamily: mono, color: hit ? colors.red : colors.muted}}>
                    ${Math.round(p * x.cap)} / ${x.cap} {hit ? '⏸ PAUSED' : ''}
                  </span>
                </div>
                <div style={{height: 18, borderRadius: 9, background: colors.panelSub, marginTop: 8, overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${p * 100}%`, background: hit ? colors.red : x.c, borderRadius: 9}} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Pop delay={b}>
        <Card title="Approvals" tag="BOARD" tagColor={colors.accent}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            {[
              {t: 'Tuyển agent “QA Engineer”', btn: approved ? '✓ Đã duyệt' : 'Approve', ok: approved, c: colors.green},
              {t: 'Agent “Intern-3” đang lặp vô hạn', btn: paused ? '⏸ Đã dừng' : 'Pause', ok: paused, c: colors.amber},
            ].map((r) => (
              <div key={r.t} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 27}}>
                <span style={{fontWeight: 700}}>{r.t}</span>
                <span
                  style={{
                    padding: '10px 20px',
                    borderRadius: 12,
                    fontWeight: 900,
                    background: r.ok ? `${r.c}33` : r.c,
                    color: r.ok ? r.c : '#111',
                    border: `2px solid ${r.c}`,
                    minWidth: 190,
                    textAlign: 'center',
                  }}
                >
                  {r.btn}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </Pop>

      <Pop delay={c}>
        <Card title="activity.log" tag="IMMUTABLE" tagColor={colors.green}>
          <div style={{fontFamily: mono, fontSize: 22, display: 'flex', flexDirection: 'column', gap: 8}}>
            {LOG.map((l, i) => (
              <div key={l} style={{opacity: appear(frame, c + 8 + i * 14), color: colors.muted}}>
                🔒 {l}
              </div>
            ))}
          </div>
        </Card>
      </Pop>

      <Cursor
        from={b + 4}
        path={[
          {f: b + 4, x: 600, y: 900},
          {f: click1 - 4, x: 850, y: 738},
          {f: click1 + 12, x: 850, y: 745},
          {f: click2 - 6, x: 850, y: 815},
          {f: click2 + 20, x: 820, y: 860},
        ]}
        clicks={[click1, click2]}
      />
    </SceneShell>
  );
};
