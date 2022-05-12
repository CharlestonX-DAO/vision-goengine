

import { RenderPassInfo } from '../base/define';
import { RenderPass } from '../base/render-pass';
import { IWebGLGPURenderPass } from './webgl-gpu-objects';

export class WebGLRenderPass extends RenderPass {
    public get gpuRenderPass (): IWebGLGPURenderPass {
        return  this._gpuRenderPass!;
    }

    private _gpuRenderPass: IWebGLGPURenderPass | null = null;

    public initialize (info: Readonly<RenderPassInfo>) {
        this._colorInfos = info.colorAttachments;
        this._depthStencilInfo = info.depthStencilAttachment;
        this._subpasses = info.subpasses;

        this._gpuRenderPass = {
            colorAttachments: this._colorInfos,
            depthStencilAttachment: this._depthStencilInfo,
        };

        this._hash = this.computeHash();
    }

    public destroy () {
        this._gpuRenderPass = null;
    }
}
