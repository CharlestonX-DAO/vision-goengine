

/**
 * @packageDocumentation
 * @module component
 */

import { Light } from './light-component';
import { SpotLight } from './spot-light-component';
import { SphereLight } from './sphere-light-component';
import { DirectionalLight } from './directional-light-component';
import { legacyCC } from '../../core/global-exports';
import { js } from '../../core/utils/js';
import { replaceProperty } from '../../core/utils/x-deprecated';

/**
 * Alias of [[Light]]
 * @deprecated Since v1.2
 */
export { Light as LightComponent };
legacyCC.LightComponent = Light;
js.setClassAlias(Light, 'cc.LightComponent');
/**
 * Alias of [[DirectionalLight]]
 * @deprecated Since v1.2
 */
export { DirectionalLight as DirectionalLightComponent };
legacyCC.DirectionalLightComponent = DirectionalLight;
js.setClassAlias(DirectionalLight, 'cc.DirectionalLightComponent');
/**
 * Alias of [[SphereLight]]
 * @deprecated Since v1.2
 */
export { SphereLight as SphereLightComponent };
legacyCC.SphereLightComponent = SphereLight;
js.setClassAlias(SphereLight, 'cc.SphereLightComponent');
/**
 * Alias of [[SpotLight]]
 * @deprecated Since v1.2
 */
export { SpotLight as SpotLightComponent };
legacyCC.SpotLightComponent = SpotLight;
js.setClassAlias(SpotLight, 'cc.SpotLightComponent');

replaceProperty(SpotLight.prototype, 'SpotLight.prototype', [
    {
        name: 'luminousPower',
        newName: 'luminousFlux',
        customGetter () {
            // @ts-expect-error deprecation method
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.luminousFlux;
        },
        customSetter (value) {
            // @ts-expect-error deprecation method
            this.luminousFlux = value;
        },
    },
]);

replaceProperty(SphereLight.prototype, 'SphereLight.prototype', [
    {
        name: 'luminousPower',
        newName: 'luminousFlux',
        customGetter () {
            // @ts-expect-error deprecation method
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.luminousFlux;
        },
        customSetter (value) {
            // @ts-expect-error deprecation method
            this.luminousFlux = value;
        },
    },
]);

replaceProperty(Light.PhotometricTerm, 'Light.PhotometricTerm', [
    {
        name: 'LUMINOUS_POWER',
        newName: 'LUMINOUS_FLUX',
    },
]);
