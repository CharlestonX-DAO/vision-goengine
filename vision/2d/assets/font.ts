

/**
 * @packageDocumentation
 * @module asset
 */

import { ccclass } from 'cc.decorator';
import { Asset } from '../../core/assets';
import { legacyCC } from '../../core/global-exports';

/**
 * @en Class for Font handling.
 * @zh 字体资源类。
 */
@ccclass('cc.Font')
export class Font extends Asset {
}

legacyCC.Font = Font;
