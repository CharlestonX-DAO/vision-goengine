

import * as animation from './animation';
import * as easing from '../easing/easing';
import { legacyCC } from '../global-exports';

legacyCC.easing = easing;
export * from '../curves/bezier';
export { easing };
export * from './animation-curve';
export { AnimationClip } from './animation-clip';
export * from './animation-manager';
export {
    AnimationState,
} from './animation-state';
export {
    Animation,
    AnimationComponent,
} from './animation-component';
export * from './transform-utils';
export { animation };
