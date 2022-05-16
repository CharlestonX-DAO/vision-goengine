

import { Format, SwapchainInfo, SurfaceTransform } from '../base/define';
import { Swapchain } from '../base/swapchain';
import { EmptyTexture } from './empty-texture';

export class EmptySwapchain extends Swapchain {
    public initialize (info: Readonly<SwapchainInfo>) {
        this._colorTexture = new EmptyTexture();
        // @ts-expect-error(2445) private initializer
        this._colorTexture.initAsSwapchainTexture({
            swapchain: this,
            format: Format.RGBA8,
            width: info.width,
            height: info.height,
        });

        this._depthStencilTexture = new EmptyTexture();
        // @ts-expect-error(2445) private initializer
        this._depthStencilTexture.initAsSwapchainTexture({
            swapchain: this,
            format: Format.DEPTH_STENCIL,
            width: info.width,
            height: info.height,
        });
    }
    public destroy (): void {}
    public resize (width: number, height: number, surfaceTransform: SurfaceTransform) {}
}
