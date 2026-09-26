import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {Fragment} from 'react';
import {BrandCtaScene, BRAND_CTA_FRAMES} from '../shared/BrandCtaScene';
import {Scene01Hook} from './scenes/Scene01Hook';
import {Scene02Pain} from './scenes/Scene02Pain';
import {Scene03Steps} from './scenes/Scene03Steps';
import {Scene04Org} from './scenes/Scene04Org';
import {Scene05Beat} from './scenes/Scene05Beat';
import {Scene06Gov} from './scenes/Scene06Gov';
import {Scene07Start} from './scenes/Scene07Start';
import {SCENE_FRAMES, TRANSITION_FRAMES} from './timeline';

const SCENES = [
  {name: '01 — Hook: 85k stars, agent company', C: Scene01Hook},
  {name: '02 — 20 Claude Code tabs', C: Scene02Pain},
  {name: '03 — Goal / hire / run', C: Scene03Steps},
  {name: '04 — Org chart & adapters', C: Scene04Org},
  {name: '05 — Heartbeats & tickets', C: Scene05Beat},
  {name: '06 — Budgets & governance', C: Scene06Gov},
  {name: '07 — npx onboard', C: Scene07Start},
];

export const PAPERCLIP_TOTAL_FRAMES =
  SCENE_FRAMES.reduce((s, f) => s + f, 0) + BRAND_CTA_FRAMES - SCENES.length * TRANSITION_FRAMES;

export const PaperclipShort: React.FC = () => (
  <TransitionSeries>
    {SCENES.map(({name, C}, i) => (
      <Fragment key={name}>
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES[i]} name={name}>
          <C />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={i % 2 === 0 ? fade() : slide({direction: 'from-bottom'})}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />
      </Fragment>
    ))}
    <TransitionSeries.Sequence durationInFrames={BRAND_CTA_FRAMES} name="08 — Closing CTA">
      <BrandCtaScene />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
