

/**
 * @packageDocumentation
 * @module component
 */

import { ccclass, inspector, editorOnly, serializable, editable } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { _getClassById } from '../utils/js';
import { BUILTIN_CLASSID_RE } from '../utils/misc';
import { Component } from './component';
import { legacyCC } from '../global-exports';
import { warnID, error } from '../platform/debug';

/**
 * @en
 * A temp fallback to contain the original component which can not be loaded.
 * @zh
 * 包含无法加载的原始组件的临时回退。
 */
@ccclass('cc.MissingScript')
@inspector('packages://inspector/inspectors/comps/missing-script.js')
export default class MissingScript extends Component {
    // _scriptUuid: {
    //    get: function () {
    //        var id = this._$erialized.__type__;
    //        if (EditorExtends.UuidUtils.isUuid(id)) {
    //            return EditorExtends.UuidUtils.decompressUuid(id);
    //        }
    //        return '';
    //    },
    // },

    /*
     * @param {string} id
     * @return {function} constructor
     */
    public static safeFindClass (id: string) {
        const cls = _getClassById(id);
        if (cls) {
            return cls;
        }
        legacyCC.deserialize.reportMissingClass(id);

        return undefined;
    }

    // the serialized data for original script object
    /**
     * @legacyPublic
     */
    @serializable
    @editorOnly
    public _$erialized = null;

    constructor () {
        super();
    }

    public onLoad () {
        warnID(4600, this.node.name);
    }
}

legacyCC._MissingScript = MissingScript;

// DEBUG: Check MissingScript class for issue 9878
// import { error } from '../platform/debug';
try {
    const props = MissingScript.__values__;
    if (props.length === 0 || props[props.length - 1] !== '_$erialized') {
        error(`The '_$erialized' prop in MissingScript is missing. Please contact jare.`);
        error(`    Error props: ['${props}']`);
        // props.push('_$erialized');
    }
} catch (e) {
    error(`Error when checking MissingScript 5, ${e}`);
}
