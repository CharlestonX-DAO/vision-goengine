

import { js } from '../../core/utils/js';
import { legacyCC } from '../../core/global-exports';
import { SkeletalAnimation } from './skeletal-animation';
/**
 * Alias of [[SkeletalAnimation]]
 * @deprecated Since v1.2
 */
export { SkeletalAnimation as SkeletalAnimationComponent };
legacyCC.SkeletalAnimationComponent = SkeletalAnimation;
js.setClassAlias(SkeletalAnimation, 'cc.SkeletalAnimationComponent');
