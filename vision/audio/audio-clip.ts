

/**
 * @packageDocumentation
 * @module component/audio
 */

import {
    ccclass, type, serializable, override,
} from 'cc.decorator';
import { AudioPlayer, OneShotAudio } from 'pal/audio';
import { Asset } from '../core/assets/asset';
import { legacyCC } from '../core/global-exports';
import { AudioState, AudioType } from '../../pal/audio/type';

export interface AudioMeta {
    player: AudioPlayer | null,
    url: string;
    type: AudioType;
    duration: number;
}

/**
 * @en
 * The audio clip asset. <br>
 * @zh
 * 音频片段资源。<br>
 */
@ccclass('cc.AudioClip')
export class AudioClip extends Asset {
    public static AudioType = AudioType;

    @serializable
    protected _duration = 0; // we serialize this because it's unavailable at runtime on some platforms

    protected _loadMode = AudioType.UNKNOWN_AUDIO;

    protected _meta: AudioMeta | null = null;

    private _player: AudioPlayer | null = null;

    public destroy (): boolean {
        const destroyResult = super.destroy();
        this._player?.destroy();
        this._player = null;
        if (this._meta) {
            this._meta.player = null;
        }
        return destroyResult;
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    set _nativeAsset (meta: AudioMeta | null) {
        this._meta = meta;
        if (meta) {
            this._loadMode = meta.type;
            this._player = meta.player;
        } else {
            this._meta = null;
            this._loadMode = AudioType.UNKNOWN_AUDIO;
            this._duration = 0;
        }
    }
    get _nativeAsset () {
        return this._meta;
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    @override
    get _nativeDep () {
        return {
            uuid: this._uuid,
            audioLoadMode: this.loadMode,
            ext: this._native,
            __isNative__: true,
        };
    }

    get loadMode () {
        return this._loadMode;
    }

    public validate () {
        return !!this._meta;
    }

    public getDuration () {
        // Dynamicly loaded audioClip._duration is 0
        if (this._duration) {
            return this._duration;
        }
        return this._meta ? this._meta.duration : 0;
    }

    // #region deprecated method
    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.state instead.
     */
    public get state () {
        return this._player ? this._player.state : AudioState.INIT;
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.getCurrentTime() instead.
     */
    public getCurrentTime () {
        return this._player ? this._player.currentTime : 0;
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.getVolume() instead.
     */
    public getVolume () {
        return this._player ? this._player.volume : 0;
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.getLoop() instead.
     */
    public getLoop () {
        return this._player ? this._player.loop : false;
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.setCurrentTime() instead.
     */
    public setCurrentTime (time: number) {
        this._player?.seek(time).catch((e) => {});
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.setVolume() instead.
     */
    public setVolume (volume: number) {
        if (this._player) {
            this._player.volume = volume;
        }
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.setLoop() instead.
     */
    public setLoop (loop: boolean) {
        if (this._player) {
            this._player.loop = loop;
        }
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.play() instead.
     */
    public play () {
        this._player?.play().catch((e) => {});
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.pause() instead.
     */
    public pause () {
        this._player?.pause().catch((e) => {});
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.stop() instead.
     */
    public stop () {
        this._player?.stop().catch((e) => {});
    }

    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.playOneShot() instead.
     */
    public playOneShot (volume = 1) {
        if (this._nativeAsset) {
            AudioPlayer.loadOneShotAudio(this._nativeAsset.url, volume).then((oneShotAudio) => {
                oneShotAudio.play();
            }).catch((e) => {});
        }
    }
    // #endregion deprecated method
}

legacyCC.AudioClip = AudioClip;
