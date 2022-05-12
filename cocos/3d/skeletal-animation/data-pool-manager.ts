



import type { AnimationClip } from '../../core/animation/animation-clip';
import type { Skeleton } from '../assets';
import { Device } from '../../core/gfx';
import { JointAnimationInfo, JointTexturePool } from './skeletal-animation-utils';
import { legacyCC } from '../../core/global-exports';

export class DataPoolManager {
    public jointTexturePool: JointTexturePool;
    public jointAnimationInfo: JointAnimationInfo;

    constructor (device: Device) {
        this.jointTexturePool = new JointTexturePool(device);
        this.jointAnimationInfo = new JointAnimationInfo(device);
    }

    public releaseSkeleton (skeleton: Skeleton) {
        this.jointTexturePool.releaseSkeleton(skeleton);
    }

    public releaseAnimationClip (clip: AnimationClip) {
        this.jointTexturePool.releaseAnimationClip(clip);
    }

    public clear () {
        this.jointTexturePool.clear();
        this.jointAnimationInfo.clear();
    }
}

legacyCC.internal.DataPoolManager = DataPoolManager;
