
/**
 * @packageDocumentation
 * @module asset-manager
 */

import downloader from '../core/asset-manager/downloader';
import factory from '../core/asset-manager/factory';
import { CompleteCallback, IDownloadParseOptions } from '../core/asset-manager/shared';
import { getError, log } from '../core/platform/debug';
import { sys } from '../core/platform/sys';
import { VideoClip } from './assets/video-clip';

// eslint-disable-next-line consistent-return
export function downloadVideo (url: string, options: IDownloadParseOptions, onComplete: CompleteCallback) {
    const video = document.createElement('video');
    const source = document.createElement('source');
    video.appendChild(source);

    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'blob';
    req.onload = function onload () {
        if (this.status === 200 || this.status === 0) {
            source.src = URL.createObjectURL(this.response);
            onComplete(null, video);
        } else {
            onComplete(new Error(`${req.status}(no response)`));
        }
    };
    req.onerror = function onerror () {
        const message = `load video failure - ${url}`;
        log(message);
        onComplete(new Error(message));
    };
    req.send();
}

function createVideoClip (id: string, data: HTMLVideoElement, options: IDownloadParseOptions, onComplete: CompleteCallback<VideoClip>) {
    const out = new VideoClip();
    out._nativeUrl = id;
    out._nativeAsset = data;
    onComplete(null, out);
}

downloader.register({
    // Video
    '.mp4': downloadVideo,
    '.avi': downloadVideo,
    '.mov': downloadVideo,
    '.mpg': downloadVideo,
    '.mpeg': downloadVideo,
    '.rm': downloadVideo,
    '.rmvb': downloadVideo,
});

factory.register({
    // Video
    '.mp4': createVideoClip,
    '.avi': createVideoClip,
    '.mov': createVideoClip,
    '.mpg': createVideoClip,
    '.mpeg': createVideoClip,
    '.rm': createVideoClip,
    '.rmvb': createVideoClip,
});
