

import { DEV } from 'internal:constants';

function deepFlatten (strList, array) {
    for (const item of array) {
        if (Array.isArray(item)) {
            deepFlatten(strList, item);
        }
        // else if (item instanceof Declaration) {
        //     strList.push(item.toString());
        // }
        else {
            strList.push(item);
        }
    }
}

export function flattenCodeArray (array) {
    const separator = DEV ? '\n' : '';
    const strList = [];
    deepFlatten(strList, array);
    return strList.join(separator);
}
