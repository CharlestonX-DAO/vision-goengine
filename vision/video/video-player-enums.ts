

/**
 * @packageDocumentation
 * @module component/video
 */

/**
 * @en Enum for video resource type.
 * @zh 视频来源
 */
import { Enum } from '../core/value-types';

export const ResourceType = Enum({
    /**
     * @en
     * The remote resource type.
     * @zh
     * 远程视频
     */
    REMOTE: 0,
    /**
     * @en
     * The local resource type.
     * @zh
     * 本地视频
     */
    LOCAL: 1,
});

export enum EventType {
    /**
     * @en None
     * @zh 无
     */
    NONE = 'none',
    /**
     * @en The video is playing.
     * @zh 视频播放中
     */
    PLAYING = 'playing',
    /**
     * @en Video paused
     * @zh 视频暂停中
     */
    PAUSED = 'paused',
    /**
     * @en Video stopped
     * @zh 视频停止中
     */
    STOPPED = 'stopped',
    /**
     * @en End of video
     * @zh 视频播放完毕
     */
    COMPLETED = 'completed',
    /**
     * @en Video metadata loading complete
     * @zh 视频元数据加载完毕
     */
    META_LOADED = 'meta-loaded',
    /**
     * @en The video is ready to play when loaded
     * @zh 视频加载完毕可播放
     */
    READY_TO_PLAY = 'ready-to-play',
    /**
     * @en Video Trigger Error
     * @zh 处理视频时触发的错误
     */
    ERROR = 'error',

    /**
     * @en Video clicked
     * @zh 视频被点击
     */
    CLICKED = 'clicked',
}

export enum READY_STATE {
    HAVE_NOTHING,      // 没有关于音频/视频是否就绪的信息
    HAVE_METADATA,     // 关于音频/视频就绪的元数据
    HAVE_CURRENT_DATA, // 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒
    HAVE_FUTURE_DATA,  // 当前及至少下一帧的数据是可用的
    HAVE_ENOUGH_DATA   // 可用数据足以开始播放
}
