

/**
 * @packageDocumentation
 * @module decorator
 */

import { LegacyPropertyDecorator } from './utils';
import { getOrCreatePropertyStash } from './property';

export const override: LegacyPropertyDecorator = (target, propertyKey, descriptor) => {
    const propertyStash = getOrCreatePropertyStash(target, propertyKey, descriptor);
    propertyStash.override = true;
};
