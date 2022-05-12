

import { RenderPassInfo } from '../base/define';
import { RenderPass } from '../base/render-pass';

export class EmptyRenderPass extends RenderPass {
    public initialize (info: Readonly<RenderPassInfo>) {
        this._colorInfos = info.colorAttachments;
        this._depthStencilInfo = info.depthStencilAttachment;
        this._subpasses = info.subpasses;
        this._hash = this.computeHash();
    }
    public destroy () {}
}
