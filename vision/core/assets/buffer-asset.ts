

/**
 * @packageDocumentation
 * @module asset
 */

import { ccclass, override } from 'cc.decorator';
import { legacyCC } from '../global-exports';
import { Asset } from './asset';

@ccclass('cc.BufferAsset')
export class BufferAsset extends Asset {
    private _buffer: ArrayBuffer | null = null;

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    @override
    get _nativeAsset () {
        return this._buffer as ArrayBuffer;
    }
    set _nativeAsset (bin: ArrayBufferView | ArrayBuffer) {
        if (bin instanceof ArrayBuffer) {
            this._buffer = bin;
        } else {
            this._buffer = bin.buffer;
        }
    }

    public buffer () {
        return this._buffer;
    }

    public validate () {
        return !!this.buffer;
    }
}

legacyCC.BufferAsset = BufferAsset;
