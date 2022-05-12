

import { FramebufferInfo } from '../base/define';
import { Framebuffer } from '../base/framebuffer';

export class EmptyFramebuffer extends Framebuffer {
    public initialize (info: Readonly<FramebufferInfo>) {
        this._renderPass = info.renderPass;
        this._colorTextures = info.colorTextures || [];
        this._depthStencilTexture = info.depthStencilTexture || null;
    }
    public destroy () {}
}
