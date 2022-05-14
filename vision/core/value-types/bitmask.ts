

/**
 * @packageDocumentation
 * @module core/value-types
 */

import { EDITOR, TEST } from 'internal:constants';
import { value } from '../utils/js';
import { legacyCC } from '../global-exports';
import { errorID } from '../platform/debug';

/**
 * @en
 * Define an BitMask type.
 * @zh
 * 定义一个位掩码类型。
 * @param obj A JavaScript literal object containing BitMask names and values
 * @return The defined BitMask type
 */
export function BitMask<T> (obj: T): T {
    if ('__bitmask__' in obj) {
        return obj;
    }
    value(obj, '__bitmask__', null, true);

    let lastIndex = -1;
    const keys: string[] = Object.keys(obj);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        let val = obj[key];
        if (val === -1) {
            val = ++lastIndex;
            obj[key] = val;
        } else if (typeof val === 'number') {
            lastIndex = val;
        } else if (typeof val === 'string' && Number.isInteger(parseFloat(key))) {
            continue;
        }
        const reverseKey = `${val}`;
        if (key !== reverseKey) {
            if ((EDITOR || TEST) && reverseKey in obj && obj[reverseKey] !== key) {
                errorID(7100, reverseKey);
                continue;
            }
            value(obj, reverseKey, key);
        }
    }
    return obj;
}

BitMask.isBitMask = (BitMaskType) => BitMaskType && BitMaskType.hasOwnProperty('__bitmask__');

BitMask.getList = (BitMaskDef) => {
    if (BitMaskDef.__bitmask__) {
        return BitMaskDef.__bitmask__;
    }

    const bitlist: any[] = BitMaskDef.__bitmask__ = [];

    for (const name in BitMaskDef) {
        const v = BitMaskDef[name];
        if (Number.isInteger(v)) {
            bitlist.push({ name, value: v });
        }
    }
    bitlist.sort((a, b) => a.value - b.value);
    return bitlist;
};

export function ccbitmask (bitmaskx) {
    if ('__bitmask__' in bitmaskx) {
        return;
    }
    value(bitmaskx, '__bitmask__', null, true);
}

legacyCC.BitMask = BitMask;
