

/**
 * @packageDocumentation
 * @module asset
 */

import { ccclass } from 'cc.decorator';
import { Asset } from './asset';
import { legacyCC } from '../global-exports';

/**
 * @en The script asset base class
 * @zh 脚本资源基类。
 */
@ccclass('cc.Script')
export class Script extends Asset {
}
legacyCC._Script = Script;

/**
 * @en JavaScript asset.
 * @zh JavaScript 脚本资源。
 */
@ccclass('cc.JavaScript')
export class JavaScript extends Script {
}
legacyCC._JavaScript = JavaScript;

/**
 * @en TypeScript asset
 * @zh TypeScript 脚本资源。
 */
@ccclass('cc.TypeScript')
export class TypeScript extends Script {
}
legacyCC._TypeScript = TypeScript;
