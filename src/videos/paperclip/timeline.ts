// Timeline built from the measured voiceover clips (ffprobe, frames @30fps).
// Each line: [id, durationFrames, pauseAfterFrames, caption].

export const TRANSITION_FRAMES = 10;
const LEAD_IN = 8;
const TAIL = 16;

type Raw = readonly [id: string, dur: number, pause: number, caption: string];

const SCENES: readonly (readonly Raw[])[] = [
  [
    ['01a-hook', 77, 14, 'Hơn 85.000 sao GitHub, chỉ sau 7 tháng!'],
    ['01b-hook', 101, 18, 'OpenClaw là nhân viên → Paperclip là cả công ty.'],
    ['01c-hook', 132, 0, 'App mã nguồn mở quản lý cả đội AI agent đi làm thay bạn.'],
  ],
  [
    ['02a-pain', 75, 18, 'Bạn đang mở 20 tab Claude Code cùng lúc?'],
    ['02b-pain', 82, 12, 'Không nhớ tab nào làm gì, reboot là mất sạch.'],
    ['02c-pain', 147, 0, 'Một vòng lặp chạy quá tay đốt cả trăm đô token.'],
  ],
  [
    ['03a-steps', 75, 14, 'Paperclip biến mớ hỗn độn đó thành một công ty.'],
    ['03b-steps', 137, 12, '① Đặt mục tiêu: app ghi chú đạt $1M doanh thu/tháng.'],
    ['03c-steps', 140, 12, '② Tuyển đội: CEO, CTO, kỹ sư, designer, marketer.'],
    ['03d-steps', 87, 0, '③ Duyệt chiến lược, đặt ngân sách, bấm chạy.'],
  ],
  [
    ['04a-org', 101, 12, 'Mỗi agent có chức danh, có sếp, có mô tả công việc.'],
    ['04b-org', 135, 16, 'Claude Code • Codex • Cursor • bash • bot HTTP'],
    ['04c-org', 70, 0, 'Nhận được heartbeat là được tuyển!'],
  ],
  [
    ['05a-beat', 111, 12, 'Agent tự thức dậy theo lịch, kiểm tra việc, rồi làm.'],
    ['05b-beat', 111, 12, 'Mỗi task là 1 ticket có lịch sử, reboot không mất.'],
    ['05c-beat', 144, 0, 'Task truy ngược về mục tiêu công ty: biết làm gì, và vì sao.'],
  ],
  [
    ['06a-gov', 96, 14, 'Ngân sách theo tháng cho từng agent. Chạm trần là dừng.'],
    ['06b-gov', 132, 12, 'Duyệt tuyển, tạm dừng hay sa thải agent bất cứ lúc nào.'],
    ['06c-gov', 92, 0, 'Mọi quyết định nằm trong audit log, không ai sửa được.'],
  ],
  [
    ['07a-start', 113, 12, 'Chạy thử 1 dòng: npx paperclipai onboard'],
    ['07b-start', 128, 12, 'PostgreSQL nhúng tự tạo, không cần cấu hình.'],
    ['07c-start', 75, 0, 'MIT • tự host • không cần tài khoản.'],
  ],
];

export type Line = {id: string; from: number; dur: number; caption: string};

export const SCENE_LINES: Line[][] = SCENES.map((raw) => {
  let t = LEAD_IN;
  return raw.map(([id, dur, pause, caption]) => {
    const line = {id, from: t, dur, caption};
    t += dur + pause;
    return line;
  });
});

export const SCENE_FRAMES: number[] = SCENE_LINES.map((lines) => {
  const last = lines[lines.length - 1];
  return last.from + last.dur + TAIL + TRANSITION_FRAMES;
});

// Start frame of line `id` within its own scene.
export const at = (id: string): number => {
  for (const lines of SCENE_LINES) {
    const l = lines.find((x) => x.id === id);
    if (l) return l.from;
  }
  throw new Error(`Unknown line ${id}`);
};

// Frame at which line `id` finishes speaking, within its own scene.
export const end = (id: string): number => {
  for (const lines of SCENE_LINES) {
    const l = lines.find((x) => x.id === id);
    if (l) return l.from + l.dur;
  }
  throw new Error(`Unknown line ${id}`);
};
