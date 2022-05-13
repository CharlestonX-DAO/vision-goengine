

import { FramebufferInfo } from '../base/define';
import { Framebuffer } from '../base/framebuffer';
import { WebGL2CmdFuncCreateFramebuffer, WebGL2CmdFuncDestroyFramebuffer } from './webgl2-commands';
import { WebGL2DeviceManager } from './webgl2-define';
import { IWebGL2GPUFramebuffer, IWebGL2GPUTexture, IWebGL2GPUTextureView } from './webgl2-gpu-objects';
import { WebGL2RenderPass } from './webgl2-render-pass';
import { WebGL2Texture } from './webgl2-texture';

export class WebGL2Framebuffer extends Framebuffer {
    get gpuFramebuffer (): IWebGL2GPUFramebuffer {
        return  this._gpuFramebuffer!;
    }

    private _gpuFramebuffer: IWebGL2GPUFramebuffer | null = null;

    public initialize (info: Readonly<FramebufferInfo>) {
        this._renderPass = info.renderPass;
        this._colorTextures = info.colorTextures || [];
        this._depthStencilTexture = info.depthStencilTexture || null;

        const gpuColorViews: IWebGL2GPUTextureView[] = [];
        for (let i = 0; i < info.colorTextures.length; i++) {
            const colorTexture = info.colorTextures[i];
            if (colorTexture) {
                gpuColorViews.push((colorTexture as WebGL2Texture).gpuTextureView);
            }
        }

        let gpuDepthStencilView: IWebGL2GPUTextureView | null = null;
        if (info.depthStencilTexture) {
            gpuDepthStencilView = (info.depthStencilTexture as WebGL2Texture).gpuTextureView;
        }

        let width = Number.MAX_SAFE_INTEGER;
        let height = Number.MAX_SAFE_INTEGER;
        this._gpuFramebuffer = {
            gpuRenderPass: (info.renderPass as WebGL2RenderPass).gpuRenderPass,
            gpuColorViews,
            gpuDepthStencilView,
            glFramebuffer: null,
            isOffscreen: true,
            get width () {
                if (this.isOffscreen) {
                    return width;
                } else if (this.gpuColorViews.length > 0) {
                    return this.gpuColorViews[0].gpuTexture.width;
                } else {
                    return this.gpuDepthStencilView!.gpuTexture.width;
                }
            },
            set width (val) {
                width = val;
            },
            get height () {
                if (this.isOffscreen) {
                    return width;
                } else if (this.gpuColorViews.length > 0) {
                    return this.gpuColorViews[0].gpuTexture.height;
                } else {
                    return this.gpuDepthStencilView!.gpuTexture.height;
                }
            },
            set height (val) {
                height = val;
            },
        };

        WebGL2CmdFuncCreateFramebuffer(WebGL2DeviceManager.instance, this._gpuFramebuffer);
    }

    public destroy () {
        if (this._gpuFramebuffer) {
            WebGL2CmdFuncDestroyFramebuffer(WebGL2DeviceManager.instance, this._gpuFramebuffer);
            this._gpuFramebuffer = null;
        }
    }
}
