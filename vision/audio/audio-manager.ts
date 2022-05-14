

import { AudioPlayer, OneShotAudio } from 'pal/audio';
import { fastRemoveAt } from '../core/utils/array';

type ManagedAudio = AudioPlayer | OneShotAudio;
interface AudioInfo<T> {
    audio: T;
    playTime: number;
}

export class AudioManager {
    private _oneShotAudioInfoList: AudioInfo<OneShotAudio>[] = [];
    private _audioPlayerInfoList: AudioInfo<AudioPlayer>[] = [];

    private _findIndex (audioInfoList: AudioInfo<ManagedAudio>[], audio: ManagedAudio) {
        return audioInfoList.findIndex((item) => item.audio === audio);
    }

    private _tryAddPlaying (audioInfoList: AudioInfo<ManagedAudio>[], audio: ManagedAudio): boolean {
        const idx = this._findIndex(audioInfoList, audio);
        if (idx > -1) {
            // update play time
            audioInfoList[idx].playTime = performance.now();
            return false;
        }
        audioInfoList.push({
            audio,
            playTime: performance.now(),
        });
        return true;
    }
    public addPlaying (audio: ManagedAudio) {
        if (audio instanceof AudioPlayer) {
            if (this._tryAddPlaying(this._audioPlayerInfoList, audio)) {
                return;
            }
        } else {
            this._tryAddPlaying(this._oneShotAudioInfoList, audio);
        }
    }

    private _tryRemovePlaying (audioInfoList: AudioInfo<ManagedAudio>[], audio: ManagedAudio): boolean {
        const idx = this._findIndex(audioInfoList, audio);
        if (idx === -1) {
            return false;
        }
        fastRemoveAt(audioInfoList, idx);
        return true;
    }
    public removePlaying (audio: ManagedAudio) {
        if (audio instanceof AudioPlayer) {
            if (this._tryRemovePlaying(this._audioPlayerInfoList, audio)) {
                return;
            }
        } else {
            this._tryRemovePlaying(this._oneShotAudioInfoList, audio);
        }
    }

    public discardOnePlayingIfNeeded () {
        if (this._audioPlayerInfoList.length + this._oneShotAudioInfoList.length < AudioPlayer.maxAudioChannel) {
            return;
        }

        // TODO: support discard policy for audio source
        let audioInfoToDiscard: AudioInfo<ManagedAudio> | undefined;
        if (this._oneShotAudioInfoList.length > 0) {
            this._oneShotAudioInfoList.forEach((audioInfo) => {
                if (!audioInfoToDiscard || audioInfo.playTime < audioInfoToDiscard.playTime) {
                    audioInfoToDiscard = audioInfo;
                }
            });
        } else {
            this._audioPlayerInfoList.forEach((audioInfo) => {
                if (!audioInfoToDiscard || audioInfo.playTime < audioInfoToDiscard.playTime) {
                    audioInfoToDiscard = audioInfo;
                }
            });
        }
        if (audioInfoToDiscard) {
            audioInfoToDiscard.audio.stop();
            this.removePlaying(audioInfoToDiscard.audio);
        }
    }
}

export const audioManager = new AudioManager();
