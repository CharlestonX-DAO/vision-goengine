

/**
 * @packageDocumentation
 * @module core
 */

/**
 * @example
 * ```
 * import { js } from 'cc';
 * var array = [0, 1, 2, 3, 4];
 * var iterator = new js.array.MutableForwardIterator(array);
 * for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
 *     var item = array[iterator.i];
 *     ...
 * }
 * ```
 */
export default class MutableForwardIterator<T> {
    public i = 0;

    constructor (public array: T[]) {
    }

    get length () {
        return this.array.length;
    }

    set length (value: number) {
        this.array.length = value;
        if (this.i >= value) {
            this.i = value - 1;
        }
    }

    public remove (value: T) {
        const index = this.array.indexOf(value);
        if (index >= 0) {
            this.removeAt(index);
        }
    }

    public removeAt (i: number) {
        this.array.splice(i, 1);

        if (i <= this.i) {
            --this.i;
        }
    }

    public fastRemove (value: T) {
        const index = this.array.indexOf(value);
        if (index >= 0) {
            this.fastRemoveAt(index);
        }
    }

    public fastRemoveAt (i: number) {
        const array = this.array;
        array[i] = array[array.length - 1];
        --array.length;

        if (i <= this.i) {
            --this.i;
        }
    }

    public push (item: T) {
        this.array.push(item);
    }
}
