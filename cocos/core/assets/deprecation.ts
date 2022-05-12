



import { removeProperty, replaceProperty } from '../utils';
import { TextureBase } from './texture-base';
import { RenderTexture } from './render-texture';

removeProperty(TextureBase.prototype, 'TextureBase.prototype', [
    {
        name: 'hasPremultipliedAlpha',
    },
    {
        name: 'setPremultiplyAlpha',
    },
    {
        name: 'setFlipY',
    },
]);

replaceProperty(RenderTexture.prototype, 'RenderTexture.prototype', [
    {
        name: 'getGFXWindow',
        customFunction () {
            // @ts-expect-error
            return this._window;
        },
    },
]);
