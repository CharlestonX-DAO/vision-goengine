

import { DataPoolManager } from './data-pool-manager';
import type { AnimationClip } from '../../core/animation/animation-clip';
import { legacyCC } from '../../core/global-exports';
import { BAKE_SKELETON_CURVE_SYMBOL } from '../../core/animation/internal-symbols';

type BakeData = ReturnType<AnimationClip[typeof BAKE_SKELETON_CURVE_SYMBOL]>;

/**
 * @en The data conversion tool for skeleton animation
 * @zh 骨骼动画数据转换中心。
 * @internal
 */
export class SkelAnimDataHub {
    public static getOrExtract (clip: AnimationClip): BakeData {
        let data = SkelAnimDataHub.pool.get(clip);
        if (!data || data.samples !== clip.sample) {
            // release outdated render data
            if (data) { (legacyCC.director.root.dataPoolManager as DataPoolManager).releaseAnimationClip(clip); }
            const frames = Math.ceil(clip.sample * clip.duration) + 1;
            const step = clip.sample;
            data = clip[BAKE_SKELETON_CURVE_SYMBOL](0, step, frames);
            SkelAnimDataHub.pool.set(clip, data);
        }
        return data;
    }

    public static destroy (clip: AnimationClip) {
        SkelAnimDataHub.pool.delete(clip);
    }

    private static pool = new Map<AnimationClip, BakeData>();
}
