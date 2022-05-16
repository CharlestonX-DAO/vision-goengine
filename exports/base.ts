

import { legacyCC } from '../vision/core/global-exports';
// has to import predefines first
import '../predefine';

// tslint:disable-next-line: ordered-imports
import '../vision/core/legacy';
import * as renderer from '../vision/core/renderer';

// LOAD ENGINE CORE
export * from '../vision/core';

export { renderer };
legacyCC.renderer = renderer;

export * from '../extensions/ccpool/node-pool';

export { legacyCC as cclegacy };

export * from '../vision/input/types';
export * from '../vision/input';

type Constructor_<T = unknown> = Constructor<T>;

export type { Constructor_ as Constructor };
