import {Composition, Folder} from "remotion";
import {PaperclipShort, PAPERCLIP_TOTAL_FRAMES} from "./videos/paperclip/PaperclipShort";
import {BrandCtaScene, BRAND_CTA_FRAMES} from "./videos/shared/BrandCtaScene";

// Register every video here. `Paperclip` is the reference example: copy its folder
// structure (scenes/, timeline.ts, voiceover-config.ts, shared.tsx) for new videos.
export const MyComposition: React.FC = () => {
  return (
    <>
      <Folder name="Shared">
        <Composition
          id="BrandCta"
          component={BrandCtaScene}
          durationInFrames={BRAND_CTA_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Composition
        id="Paperclip"
        component={PaperclipShort}
        durationInFrames={PAPERCLIP_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
