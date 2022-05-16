

/**
 * @packageDocumentation
 * @module gfx
 */

import { murmurhash2_32_gc } from '../../../utils/murmurhash2_gc';
import { GFXObject, ObjectType, GeneralBarrierInfo } from '../define';

/**
 * @en GFX global barrier.
 * @zh GFX 全局内存屏障。
 */
export class GeneralBarrier extends GFXObject {
    get info (): Readonly<GeneralBarrierInfo> { return this._info; }
    get hash (): number { return this._hash; }

    protected _info: GeneralBarrierInfo = new GeneralBarrierInfo();
    protected _hash = 0;

    constructor (info: Readonly<GeneralBarrierInfo>, hash: number) {
        super(ObjectType.GLOBAL_BARRIER);
        this._info.copy(info);
        this._hash = hash;
    }

    static computeHash (info: Readonly<GeneralBarrierInfo>) {
        return murmurhash2_32_gc(`${info.prevAccesses} ${info.nextAccesses}`, 666);
    }
}
