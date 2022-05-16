

/**
 * @packageDocumentation
 * @module component/video
 */

import { legacyCC } from '../core/global-exports';
import { VideoPlayer } from './video-player';
import { VideoPlayerImplWeb } from './video-player-impl-web';

export class VideoPlayerImplManager {
    // default web
    static getImpl (component: VideoPlayer): VideoPlayerImplWeb {
        return new VideoPlayerImplWeb(component);
    }
}

legacyCC.internal.VideoPlayerImplManager = VideoPlayerImplManager;
