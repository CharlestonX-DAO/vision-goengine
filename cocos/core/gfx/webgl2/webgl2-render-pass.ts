

import { RenderPassInfo } from '../base/define';
import { RenderPass } from '../base/render-pass';
import { IWebGL2GPURenderPass } from './webgl2-gpu-objects';

export class WebGL2RenderPass extends RenderPass {
    public get gpuRenderPass (): IWebGL2GPURenderPass {
        return  this._gpuRenderPass!;
    }

    private _gpuRenderPass: IWebGL2GPURenderPass | null = null;

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
