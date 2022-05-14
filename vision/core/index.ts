
/**
 * @packageDocumentation
 * @module core
 */
import { legacyCC, VERSION } from './global-exports';

import * as geometry from './geometry';
import * as math from './math';
import * as memop from './memop';
import * as gfx from './gfx';

import './splash-screen';
import './deprecated';

legacyCC.math = math;
legacyCC.geometry = geometry;

export { math, memop, geometry, gfx, VERSION };

export * from './math';
export * from './memop';
export * from './value-types';
export * from './utils';
export * from './data';
export * from './event';
export * from './assets';
export * from './platform';
export * from './game';
export * from './scheduler';
export * from './director';

export * from './gfx/deprecated-3.0.0';
export * from './pipeline';
export * from './asset-manager';
export * from './scene-graph';
export * from './components';
export * from './builtin';
export * from './curves';
export * from './VisionWeb';
