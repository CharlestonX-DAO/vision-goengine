

/**
 * @packageDocumentation
 * @module core
 */

import { EDITOR } from 'internal:constants';

const NonUuidMark = '.';

/**
 * ID generator for runtime.
 */
export default class IDGenerator {
    /*
    * The global id generator might have a conflict problem once every 365 days,
    * if the game runs at 60 FPS and each frame 4760273 counts of new id are requested.
    */
    public static global = new IDGenerator('global');

    public id: number;

    public prefix: string;

    /**
     * @param [category] You can specify a unique category to avoid id collision with other instance of IdGenerator.
     */
    constructor (category?: string) {
        // Tnit with a random id to emphasize that the returns id should not be stored in persistence data.
        this.id = 0 | (Math.random() * 998);
        this.prefix = category ? (category + NonUuidMark) : '';
    }

    public getNewId () {
        if (EDITOR && (this.prefix === 'Node.' || this.prefix === 'Comp.')) {
            return EditorExtends.UuidUtils.uuid();
        }
        return this.prefix + (++this.id);
    }
}
