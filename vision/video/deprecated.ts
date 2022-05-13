

import { replaceProperty } from '../core/utils/x-deprecated';
import { VideoPlayer } from './video-player';

replaceProperty(VideoPlayer.prototype, 'VideoPlayer.prototype', [
    {
        name: 'onPasued',
        newName: 'onPaused',
    },
]);
