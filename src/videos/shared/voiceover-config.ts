// Voiceover for the shared closing CTA (BrandCtaScene.tsx). Brand-neutral on purpose:
// the brand name/handle only appear on screen (src/brand.ts), so these clips never need regenerating.
// Split per sentence so each visual beat syncs to its own clip.
export const BRAND_CTA_VOICEOVER = {
  compositionId: 'brand-cta',
  voice: 'tiendat',
  scenes: [
    {id: '01a-hook', text: 'Thấy hay thì đừng lướt qua vội nhé!'},
    {id: '01b-follow', text: 'Bấm theo dõi kênh, mỗi ngày một công cụ AI xịn cho bạn.'},
    {id: '01c-save', text: 'Thả tim, lưu video lại, cần là mở ra dùng liền!'},
  ],
} as const;
