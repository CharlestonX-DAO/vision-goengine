

import { Filter, SamplerInfo } from '../../base/define';
import { Sampler } from '../../base/states/sampler';
import { IWebGLGPUSampler } from '../webgl-gpu-objects';

const WebGLWraps: GLenum[] = [
    0x2901, // WebGLRenderingContext.REPEAT,
    0x8370, // WebGLRenderingContext.MIRRORED_REPEAT,
    0x812F, // WebGLRenderingContext.CLAMP_TO_EDGE,
    0x812F, // WebGLRenderingContext.CLAMP_TO_EDGE,
];

export class WebGLSampler extends Sampler {
    public get gpuSampler (): IWebGLGPUSampler {
        return  this._gpuSampler!;
    }

    private _gpuSampler: IWebGLGPUSampler | null = null;

    constructor (info: Readonly<SamplerInfo>, hash: number) {
        super(info, hash);

        let glMinFilter = 0;
        let glMagFilter = 0;

        const minFilter = this._info.minFilter;
        const magFilter = this._info.magFilter;
        const mipFilter = this._info.mipFilter;

        if (minFilter === Filter.LINEAR || minFilter === Filter.ANISOTROPIC) {
            if (mipFilter === Filter.LINEAR || mipFilter === Filter.ANISOTROPIC) {
                glMinFilter = 0x2703; // WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
            } else if (mipFilter === Filter.POINT) {
                glMinFilter = 0x2701; // WebGLRenderingContext.LINEAR_MIPMAP_NEAREST;
            } else {
                glMinFilter = 0x2601; // WebGLRenderingContext.LINEAR;
            }
        } else if (mipFilter === Filter.LINEAR || mipFilter === Filter.ANISOTROPIC) {
            glMinFilter = 0x2702; // WebGLRenderingContext.NEAREST_MIPMAP_LINEAR;
        } else if (mipFilter === Filter.POINT) {
            glMinFilter = 0x2700; // WebGLRenderingContext.NEAREST_MIPMAP_NEAREST;
        } else {
            glMinFilter = 0x2600; // WebGLRenderingContext.NEAREST;
        }

        if (magFilter === Filter.LINEAR || magFilter === Filter.ANISOTROPIC) {
            glMagFilter = 0x2601; // WebGLRenderingContext.LINEAR;
        } else {
            glMagFilter = 0x2600; // WebGLRenderingContext.NEAREST;
        }

        const glWrapS = WebGLWraps[this._info.addressU];
        const glWrapT = WebGLWraps[this._info.addressV];
        const glWrapR = WebGLWraps[this._info.addressW];

        this._gpuSampler = {
            glMinFilter,
            glMagFilter,
            glWrapS,
            glWrapT,
            glWrapR,
        };
    }
}
