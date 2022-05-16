

/**
 * @packageDocumentation
 * @module asset
 */

import { ccclass, string, override, serializable } from 'cc.decorator';
import { extname } from '../../core/utils/path';
import { Font } from './font';
import { legacyCC } from '../../core/global-exports';

/**
 * @en Class for TTFFont asset.
 * @zh TTF 字体资源类。
 */
@ccclass('cc.TTFFont')
export class TTFFont extends Font {
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    @serializable
    public _fontFamily: string | null = null;

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    @override
    @string
    get _nativeAsset () {
        return this._fontFamily;
    }
    set _nativeAsset (value) {
        this._fontFamily = value || 'Arial';
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    @override
    get _nativeDep () {
        return { uuid: this._uuid, __nativeName__: this._native, ext: extname(this._native), __isNative__: true };
    }

    public initDefault (uuid?: string) {
        this._fontFamily = 'Arial';
        super.initDefault(uuid);
    }
}

legacyCC.TTFFont = TTFFont;
