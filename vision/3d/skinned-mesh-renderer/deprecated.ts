

/**
 * @packageDocumentation
 * @module component
 */

import { SkinnedMeshRenderer } from './skinned-mesh-renderer';
import { SkinnedMeshBatchRenderer, SkinnedMeshUnit } from './skinned-mesh-batch-renderer';
import { js } from '../../core/utils/js';
import { legacyCC } from '../../core/global-exports';
/**
 * Alias of [[SkinnedMeshRenderer]]
 * @deprecated Since v1.2
 */
export { SkinnedMeshRenderer as SkinningModelComponent };
legacyCC.SkinningModelComponent = SkinnedMeshRenderer;
js.setClassAlias(SkinnedMeshRenderer, 'cc.SkinningModelComponent');
/**
 * Alias of [[SkinnedMeshUnit]]
 * @deprecated Since v1.2
 */
export { SkinnedMeshUnit as SkinningModelUnit };
legacyCC.SkinningModelUnit = SkinnedMeshUnit;
js.setClassAlias(SkinnedMeshUnit, 'cc.SkinningModelUnit');
/**
 * Alias of [[SkinnedMeshBatchRenderer]]
 * @deprecated Since v1.2
 */
export { SkinnedMeshBatchRenderer as BatchedSkinningModelComponent };
legacyCC.BatchedSkinningModelComponent = SkinnedMeshBatchRenderer;
js.setClassAlias(SkinnedMeshBatchRenderer, 'cc.BatchedSkinningModelComponent');
