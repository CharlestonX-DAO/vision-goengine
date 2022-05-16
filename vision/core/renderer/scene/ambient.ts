

import { JSB } from 'internal:constants';
import { Vec4 } from '../../math';
import { legacyCC } from '../../global-exports';
import type { AmbientInfo } from '../../scene-graph/scene-globals';
import { NativeAmbient } from '../native-scene';

export class Ambient {
    public static SUN_ILLUM = 65000.0;
    public static SKY_ILLUM = 20000.0;

    /**
     * @en Enable ambient
     * @zh 是否开启环境光
     */
    set enabled (val: boolean) {
        this._enabled = val;
        if (JSB) {
            this._nativeObj!.enabled = val;
        }
    }
    get enabled (): boolean {
        return this._enabled;
    }
    /**
     * @en Sky color
     * @zh 天空颜色
     */
    get skyColor (): Vec4 {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._skyColorHDR;
        } else {
            return this._skyColorLDR;
        }
    }

    set skyColor (color: Vec4) {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this._skyColorHDR.set(color);
        } else {
            this._skyColorLDR.set(color);
        }
        if (JSB) {
            this._nativeObj!.skyColor = isHDR ? this._skyColorHDR : this._skyColorLDR;
        }
    }

    /**
     * @en Sky illuminance
     * @zh 天空亮度
     */
    get skyIllum (): number {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._skyIllumHDR;
        } else {
            return this._skyIllumLDR;
        }
    }

    set skyIllum (illum: number) {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this._skyIllumHDR = illum;
        } else {
            this._skyIllumLDR = illum;
        }
        if (JSB) {
            this._nativeObj!.skyIllum = isHDR ? this._skyIllumHDR : this._skyIllumLDR;
        }
    }
    /**
     * @en Ground color
     * @zh 地面颜色
     */
    get groundAlbedo (): Vec4 {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._groundAlbedoHDR;
        } else {
            return this._groundAlbedoLDR;
        }
    }

    set groundAlbedo (color: Vec4) {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this._groundAlbedoHDR.set(color);
        } else {
            this._groundAlbedoLDR.set(color);
        }

        if (JSB) {
            this._nativeObj!.groundAlbedo = isHDR ? this._groundAlbedoHDR : this._groundAlbedoLDR;
        }
    }

    get mipmapCount (): number {
        return this._mipmapCount;
    }

    set mipmapCount (count : number) {
        this._mipmapCount = count;
    }

    protected _groundAlbedoHDR = new Vec4(0.2, 0.2, 0.2, 1.0);
    protected _skyColorHDR = new Vec4(0.2, 0.5, 0.8, 1.0);
    protected _skyIllumHDR = 0;

    protected _groundAlbedoLDR = new Vec4(0.2, 0.2, 0.2, 1.0);
    protected _skyColorLDR = new Vec4(0.2, 0.5, 0.8, 1.0);
    protected _skyIllumLDR = 0;

    protected _mipmapCount = 1;

    protected _enabled = false;
    protected declare _nativeObj: NativeAmbient | null;

    get native (): NativeAmbient {
        return this._nativeObj!;
    }

    constructor () {
        if (JSB) {
            this._nativeObj = new NativeAmbient();
        }
    }

    public initialize (ambientInfo: AmbientInfo) {
        // Init HDR/LDR from serialized data on load
        this._skyColorHDR = ambientInfo.skyColorHDR;
        this._groundAlbedoHDR.set(ambientInfo.groundAlbedoHDR);
        this._skyIllumHDR = ambientInfo.skyIllumHDR;

        this._skyColorLDR = ambientInfo.skyColorLDR;
        this._groundAlbedoLDR.set(ambientInfo.groundAlbedoLDR);
        this._skyIllumLDR = ambientInfo.skyIllumLDR;

        if (JSB) {
            this._nativeObj!.skyIllum = this.skyIllum;
            this._nativeObj!.skyColor = this.skyColor;
            this._nativeObj!.groundAlbedo = this.groundAlbedo;
        }
    }

    protected _destroy () {
        if (JSB) {
            this._nativeObj = null;
        }
    }

    public destroy () {
        this._destroy();
    }
}

legacyCC.Ambient = Ambient;
