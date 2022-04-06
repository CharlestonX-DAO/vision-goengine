

import * as js from './js';

/**
 * 杂项工具函数
 */
import * as misc from './misc';

/**
 * 用于处理文件与目录的路径的模块
 */
import * as path from './path';

export * from './x-deprecated';
export * from './murmurhash2_gc';
export { PrefabLink } from './prefab-link';

export {
    js,
    misc,
    path,
};

export * from './coordinates-converts-utils';

// export const js = cc.js;
// export const path = cc.path;
