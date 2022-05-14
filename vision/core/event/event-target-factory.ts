/**
 * @packageDocumentation
 * @module event
 */

import { EventTarget } from './event-target';

export function applyMixins (derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            if (name !== 'constructor') {
                Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
            }
        });
    });
}

/**
 * @en Interface for all classes that self implement the EventTarget protocol, they are normally not sub class of EventTarget
 * @zh 所有自己实现 EventTarget 功能的类都实现了这个 Interface，他们可能无法直接继承自 EventTarget
 */
export interface IEventTarget extends EventTarget {
}
