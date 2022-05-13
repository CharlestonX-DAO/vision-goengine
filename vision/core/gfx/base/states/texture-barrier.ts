

/**
 * @packageDocumentation
 * @module gfx
 */

import { murmurhash2_32_gc } from '../../../utils/murmurhash2_gc';
import { GFXObject, ObjectType, TextureBarrierInfo } from '../define';

/**
 * @en GFX texture barrier.
 * @zh GFX 贴图内存屏障。
 */
export class TextureBarrier extends GFXObject {
    get info (): Readonly<TextureBarrierInfo> { return this._info; }
    get hash (): number { return this._hash; }

    protected _info: TextureBarrierInfo = new TextureBarrierInfo();
    protected _hash = 0;

    constructor (info: Readonly<TextureBarrierInfo>, hash: number) {
        super(ObjectType.TEXTURE_BARRIER);
        this._info.copy(info);
        this._hash = hash;
    }

    static computeHash (info: Readonly<TextureBarrierInfo>) {
        let res = `${info.prevAccesses} ${info.nextAccesses}`;
        res += info.discardContents;
        res += info.srcQueue ? info.srcQueue.type : 0;
        res += info.dstQueue ? info.dstQueue.type : 0;

        return murmurhash2_32_gc(res, 666);
    }
}
