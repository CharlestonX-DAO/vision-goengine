

/**
 * @packageDocumentation
 * @module asset
 */

import { ccclass } from 'cc.decorator';
import { BitmapFont } from './bitmap-font';
import { legacyCC } from '../../core/global-exports';
/**
 * @en Class for LabelAtlas handling.
 * @zh 艺术数字字体资源类。
 *
 */
@ccclass('cc.LabelAtlas')
export class LabelAtlas extends BitmapFont {
}

legacyCC.LabelAtlas = LabelAtlas;
