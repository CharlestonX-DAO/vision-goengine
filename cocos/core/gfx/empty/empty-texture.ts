

import { TextureInfo, TextureViewInfo, ISwapchainTextureInfo, FormatSurfaceSize, IsPowerOf2 } from '../base/define';
import { Texture } from '../base/texture';

export class EmptyTexture extends Texture {
    public initialize (info: Readonly<TextureInfo> | Readonly<TextureViewInfo>, isSwapchainTexture?: boolean) {
        let texInfo = info as Readonly<TextureInfo>;

        if ('texture' in info) {
            texInfo = info.texture.info;
            this._isTextureView = true;
            this._viewInfo.copy(info);
        } else {
            this._viewInfo.texture = this;
            this._viewInfo.type = info.type;
            this._viewInfo.format = info.format;
            this._viewInfo.baseLevel = 0;
            this._viewInfo.levelCount = 1;
            this._viewInfo.baseLayer = 0;
            this._viewInfo.layerCount = 1;
        }

        this._info.copy(texInfo);

        this._isPowerOf2 = IsPowerOf2(this._info.width) && IsPowerOf2(this._info.height);
        this._size = FormatSurfaceSize(this._info.format, this.width, this.height,
            this.depth, this._info.levelCount) * this._info.layerCount;
    }
    public destroy () {}
    public resize (width: number, height: number) {
        this._info.width = width;
        this._info.height = height;
    }
    protected initAsSwapchainTexture (info: ISwapchainTextureInfo) {}
}
