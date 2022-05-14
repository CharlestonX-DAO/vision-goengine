

import { AudioPlayer } from 'pal/audio';
import { AudioClip, AudioMeta } from './audio-clip';
import { CompleteCallback, IDownloadParseOptions } from '../core/asset-manager/shared';
import downloader from '../core/asset-manager/downloader';
import factory from '../core/asset-manager/factory';

export function loadAudioPlayer (url: string, options: IDownloadParseOptions, onComplete: CompleteCallback) {
    AudioPlayer.load(url, {
        audioLoadMode: options.audioLoadMode,
    }).then((player) => {
        const audioMeta: AudioMeta = {
            player,
            url,
            duration: player.duration,
            type: player.type,
        };
        onComplete(null, audioMeta);
    }).catch((err) => {
        onComplete(err);
    });
}

function createAudioClip (id: string,
    data: AudioMeta,
    options: IDownloadParseOptions,
    onComplete: CompleteCallback<AudioClip>) {
    const out = new AudioClip();
    out._nativeUrl = id;
    out._nativeAsset = data;
    // @ts-expect-error assignment to private field
    out._duration = data.duration;
    onComplete(null, out);
}

downloader.register({
    '.mp3': loadAudioPlayer,
    '.ogg': loadAudioPlayer,
    '.wav': loadAudioPlayer,
    '.m4a': loadAudioPlayer,
});

factory.register({
    // Audio
    '.mp3': createAudioClip,
    '.ogg': createAudioClip,
    '.wav': createAudioClip,
    '.m4a': createAudioClip,
});
