



import { AudioSource } from './audio-source';
import { replaceProperty, markAsWarning } from '../core/utils/x-deprecated';
import { AudioClip } from './audio-clip';

// remove AudioClip static property
replaceProperty(AudioClip, 'AudioClip', [
    {
        name: 'PlayingState',
        newName: 'AudioState',
        target: AudioSource,
        targetName: 'AudioSource',
    },
]);

// deprecate AudioClip property
markAsWarning(AudioClip.prototype, 'AudioClip.prototype',
    [
        'state',
        'play',
        'pause',
        'stop',
        'playOneShot',
        'setCurrentTime',
        'setVolume',
        'setLoop',
        'getCurrentTime',
        'getVolume',
        'getLoop',
    ].map((item) => ({
        name: item,
        suggest: `please use AudioSource.prototype.${item} instead`,
    })));
