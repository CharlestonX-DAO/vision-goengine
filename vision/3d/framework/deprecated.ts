

import { removeProperty } from '../../core/utils';
import { MeshRenderer } from './mesh-renderer';
import { js } from '../../core/utils/js';
import { legacyCC } from '../../core/global-exports';

removeProperty(MeshRenderer.prototype, 'MeshRenderer.prototype', [
    {
        name: 'enableDynamicBatching',
    },
    {
        name: 'recieveShadows',
    },
]);

/**
 * Alias of [[MeshRenderer]]
 * @deprecated Since v1.2
 */
export { MeshRenderer as ModelComponent };
legacyCC.ModelComponent = MeshRenderer;
js.setClassAlias(MeshRenderer, 'cc.ModelComponent');
