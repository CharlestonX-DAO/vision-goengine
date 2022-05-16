

/**
 * @packageDocumentation
 * @module physics
 */

import { PhysicsGroup } from './physics-enum';

export class CollisionMatrix {
    constructor (strategy?: number) {
        if (strategy === 1) {
            const self = (this as any);
            for (let i = 0; i < 32; i++) {
                const key = `_${1 << i}`;
                self[key] = 0;
                self.updateArray = [];
                Object.defineProperty(self, 1 << i, {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    get () { return this[key]; },
                    set (v) {
                        if (this[key] !== v) {
                            this[key] = v;
                            if (this.updateArray.indexOf(i) < 0) {
                                this.updateArray.push(i);
                            }
                        }
                    },
                });
            }
            // eslint-disable-next-line dot-notation
            this['_1'] = PhysicsGroup.DEFAULT;
        } else {
            for (let i = 0; i < 32; i++) {
                const key = 1 << i;
                this[`${key}`] = 0;
            }
            this['1'] = PhysicsGroup.DEFAULT;
        }
    }
}
