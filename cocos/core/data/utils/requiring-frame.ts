

import { EDITOR } from 'internal:constants';
import { legacyCC } from '../../global-exports';

/**
 *
 */
let requiringFrames: any = [];  // the requiring frame infos

export function push (module, uuid: string, script, importMeta?) {
    if (script === undefined) {
        script = uuid;
        uuid = '';
    }
    requiringFrames.push({
        uuid,
        script,
        module,
        exports: module.exports,    // original exports
        beh: null,
        importMeta,
    });
}

export function pop () {
    const frameInfo = requiringFrames.pop();
    // check exports
    const module = frameInfo.module;
    let exports = module.exports;
    if (exports === frameInfo.exports) {
        for (const anykey in exports) {
            // exported
            return;
        }
        // auto export component
        module.exports = exports = frameInfo.cls;
    }
}

export function peek () {
    return requiringFrames[requiringFrames.length - 1];
}

legacyCC._RF = {
    push,
    pop,
    peek,
};

if (EDITOR) {
    legacyCC._RF.reset = () => {
        requiringFrames = [];
    };
}
