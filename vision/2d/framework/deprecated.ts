
/* eslint-disable @typescript-eslint/no-unsafe-return */

/**
 * @packageDocumentation
 * @module ui
 */

import { markAsWarning, removeProperty, replaceProperty } from '../../core/utils';
import { UIComponent } from './ui-component';
import { UITransform } from './ui-transform';
import { Renderable2D } from './renderable-2d';
import { Canvas } from './canvas';
import { js } from '../../core/utils/js';
import { legacyCC } from '../../core/global-exports';
import { Color } from '../../core/math/color';

removeProperty(UIComponent.prototype, 'UIComponent', [
    {
        name: '_visibility',
    },
    {
        name: 'setVisibility',
    },
]);

removeProperty(Renderable2D.prototype, 'Renderable2D.prototype', [
    {
        name: 'srcBlendFactor',
    },
    {
        name: 'dstBlendFactor',
    },
]);

replaceProperty(Canvas.prototype, 'Canvas.prototype', [
    {
        name: 'camera',
        newName: 'cameraComponent.camera',
        customGetter () {
            // @ts-expect-error deprecation method
            return this._cameraComponent.camera;
        },
    },
    {
        name: 'clearFlag',
        newName: 'cameraComponent.clearFlags',
        customGetter () {
            // @ts-expect-error deprecation method
            return this._cameraComponent ? this._cameraComponent.clearFlags : 0;
        },
        customSetter (val) {
            // @ts-expect-error deprecation method
            if (this._cameraComponent) this._cameraComponent.clearFlags = val;
        },
    },
    {
        name: 'color',
        newName: 'cameraComponent.clearColor',
        customGetter () {
            // @ts-expect-error deprecation method
            return this._cameraComponent ? this._cameraComponent.clearColor : Color.BLACK;
        },
        customSetter (val) {
            // @ts-expect-error deprecation method
            if (this._cameraComponent) this._cameraComponent.clearColor = val;
        },
    },
    {
        name: 'priority',
        newName: 'cameraComponent.priority',
        customGetter () {
            // @ts-expect-error deprecation method
            return this._cameraComponent ? this._cameraComponent.priority : 0;
        },
        customSetter (val: number) {
            // @ts-expect-error deprecation method
            if (this._cameraComponent) this._cameraComponent.priority = val;
        },
    },
    {
        name: 'targetTexture',
        newName: 'cameraComponent.targetTexture',
        customGetter () {
            // @ts-expect-error deprecation method
            return this._cameraComponent ? this._cameraComponent.targetTexture : null;
        },
        customSetter (value) {
            // @ts-expect-error deprecation method
            if (this._cameraComponent) this._cameraComponent.targetTexture = value;
        },
    },
    {
        name: 'visibility',
        newName: 'cameraComponent.visibility',
        customGetter () {
            // @ts-expect-error deprecation method
            return this._cameraComponent ? this._cameraComponent.visibility : 0;
        },
    },
]);

markAsWarning(UITransform.prototype, 'UITransform.prototype', [
    {
        name: 'priority',
        suggest: `Please use setSiblingIndex to change index of the current node in its parent's children array.`,
    },
]);

/**
 * Alias of [[UITransform]]
 * @deprecated Since v1.2
 */
export { UITransform as UITransformComponent };
legacyCC.UITransformComponent = UITransform;
js.setClassAlias(UITransform, 'cc.UITransformComponent');

/**
 * Alias of [[Renderable2D]]
 * @deprecated Since v1.2
 */
export { Renderable2D as RenderComponent };
/**
 * Alias of [[Renderable2D]]
 * @deprecated Since v3.0
 */
export { Renderable2D as UIRenderable };
js.setClassAlias(Renderable2D, 'cc.RenderComponent');

/**
 * Alias of [[Canvas]]
 * @deprecated Since v1.2
 */
export { Canvas as CanvasComponent };
legacyCC.CanvasComponent = Canvas;
js.setClassAlias(Canvas, 'cc.CanvasComponent');
