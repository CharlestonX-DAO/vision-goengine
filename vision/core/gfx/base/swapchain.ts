

/**
 * @packageDocumentation
 * @module gfx
 */

import { GFXObject, ObjectType, SurfaceTransform, SwapchainInfo } from './define';
import { Texture } from './texture';

/**
 * @en GFX Swapchain.
 * @zh GFX 交换链。
 */
export abstract class Swapchain extends GFXObject {
    /**
     * @en The color texture of this swapchain.
     * @zh 当前交换链的颜色缓冲。
     */
    get colorTexture () {
        return this._colorTexture;
    }

    /**
     * @en The depth stencil texture of this swapchain.
     * @zh 当前交换链的深度模板缓冲。
     */
    get depthStencilTexture () {
        return this._depthStencilTexture;
    }

    /**
     * @en The surface transform to be applied in projection matrices.
     * @zh 需要在投影矩阵中应用的表面变换。
     */
    get surfaceTransform () {
        return this._transform;
    }

    get width () {
        return this._colorTexture.width;
    }

    get height () {
        return this._colorTexture.height;
    }

    protected _transform = SurfaceTransform.IDENTITY;
    protected _colorTexture: Texture = null!;
    protected _depthStencilTexture: Texture = null!;

    constructor () {
        super(ObjectType.SWAPCHAIN);
    }

    public abstract initialize (info: Readonly<SwapchainInfo>): void;
    public abstract resize (width: number, height: number, surfaceTransform: SurfaceTransform): void;
    public abstract destroy (): void;
}
