

/**
 * @packageDocumentation
 * @module asset
 */

import { ccclass, serializable, editable } from '../core/data/decorators';
import { Asset } from '../core/assets/asset';
import { SpriteFrame } from '../2d/assets/sprite-frame';
import { legacyCC } from '../core/global-exports';

/**
 * Class for particle asset handling.
 * @class ParticleAsset
 * @extends Asset
 */
@ccclass('cc.ParticleAsset')
export class ParticleAsset extends Asset {
    @serializable
    @editable
    public spriteFrame: SpriteFrame | null= null;
}

legacyCC.ParticleAsset = ParticleAsset;
