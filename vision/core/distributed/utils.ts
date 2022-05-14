

import { CCObject, IsClientLoad } from "../data/object";

export function isClientLoad (obj: CCObject) {
    return !!(obj._objFlags & IsClientLoad);
}
export function setClientLoad (obj: CCObject, value: boolean) {
    if (value) {
        obj._objFlags |= IsClientLoad;
    } else {
        obj._objFlags &= ~IsClientLoad;
    }
}
