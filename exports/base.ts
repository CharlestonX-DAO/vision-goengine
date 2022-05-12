

import { legacyCC } from '../cocos/core/global-exports';
// has to import predefines first
import '../predefine';

// tslint:disable-next-line: ordered-imports
import '../cocos/core/legacy';
import * as renderer from '../cocos/core/renderer';

// LOAD ENGINE CORE
export * from '../cocos/core';

export { renderer };
legacyCC.renderer = renderer;

export * from '../extensions/ccpool/node-pool';

export { legacyCC as cclegacy };

export * from '../cocos/input/types';
export * from '../cocos/input';

type Constructor_<T = unknown> = Constructor<T>;

export type { Constructor_ as Constructor };
