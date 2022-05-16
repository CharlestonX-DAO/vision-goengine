

/**
 * @packageDocumentation
 * @module asset
 */

import { ccclass, serializable, editable } from 'cc.decorator';
import { Asset } from './asset';
import { legacyCC } from '../global-exports';

/**
 * @en Class for text file.
 * @zh 文本资源。
 */
@ccclass('cc.TextAsset')
export default class TextAsset extends Asset {
    /**
     * @en The text content.
     * @zh 此资源包含的文本。
     */
    @serializable
    @editable
    public text = '';

    public toString () {
        return this.text;
    }
}

legacyCC.TextAsset = TextAsset;
