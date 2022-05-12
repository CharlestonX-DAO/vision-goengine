



import { Billboard } from './billboard';
import { Line } from './line';
import { ParticleSystem } from './particle-system';
import { ParticleUtils } from './particle-utils';
import CurveRange from './animator/curve-range';
import { legacyCC } from '../core/global-exports';
import GradientRange from './animator/gradient-range';
import Gradient, { AlphaKey, ColorKey } from './animator/gradient';
import Burst from './burst';

export {
    Billboard,
    Line,
    ParticleSystem,
    ParticleUtils,
    CurveRange,
    GradientRange,
    Gradient,
    AlphaKey,
    ColorKey,
    Burst,
};

export * from './deprecated';

legacyCC.ParticleUtils = ParticleUtils;
