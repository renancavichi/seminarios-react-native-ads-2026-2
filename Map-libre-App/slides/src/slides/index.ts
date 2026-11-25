import type { SlideDef } from "../deck/Deck";
import { buildSlides } from "./build";
import { closingSlides } from "./closing";
import { conceptSlides } from "./concepts";
import { demoSlides } from "./demos";
import { introSlides } from "./intro";
import { platformSlides } from "./platforms";
import { styleSlides } from "./style";

export const SLIDES: SlideDef[] = [
  ...introSlides,
  ...conceptSlides,
  ...platformSlides,
  ...buildSlides,
  ...demoSlides,
  ...styleSlides,
  ...closingSlides,
];
