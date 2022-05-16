

/**
 * @packageDocumentation
 * @module component/video
 */

import { ccclass, serializable } from 'cc.decorator';
import { Asset } from '../../core/assets';

/**
 * @en
 * The video clip asset.
 * @zh
 * 视频片段资源。
 */
@ccclass('cc.VideoClip')
export class VideoClip extends Asset {
    @serializable
    protected _duration = 0;
    protected _video: HTMLVideoElement | null = null;

    constructor () {
        super();
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    set _nativeAsset (clip: HTMLVideoElement | null) {
        this._video = clip;
        if (clip) {
            this._duration = clip.duration;
        } else {
            this._duration = 0;
        }
    }
    get _nativeAsset (): HTMLVideoElement | null {
        return this._video;
    }
}
