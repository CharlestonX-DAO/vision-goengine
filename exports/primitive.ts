import * as primitives from '../vision/primitive';
import { legacyCC } from '../vision/core/global-exports';

export {
    primitives,
};
legacyCC.primitives = primitives;
export * from '../vision/primitive/primitive';
