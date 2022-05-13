

/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Camera } from './camera-component';
import { replaceProperty } from '../utils';
import { legacyCC } from '../global-exports';
import { js } from '../utils/js';

replaceProperty(Camera, 'Camera', [
    {
        name: 'CameraClearFlag',
        newName: 'ClearFlag',
    },
]);

replaceProperty(Camera.prototype, 'Camera.prototype', [
    {
        name: 'color',
        newName: 'clearColor',
    },
    {
        name: 'depth',
        newName: 'clearDepth',
    },
    {
        name: 'stencil',
        newName: 'clearStencil',
    },
]);

/**
 * Alias of [[Camera]]
 * @deprecated Since v1.2
 */
export { Camera as CameraComponent };
legacyCC.CameraComponent = Camera;
js.setClassAlias(Camera, 'cc.CameraComponent');
