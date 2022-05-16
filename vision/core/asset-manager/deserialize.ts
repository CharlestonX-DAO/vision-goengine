

import { EDITOR } from 'internal:constants';
import { Asset } from '../assets/asset';
import MissingScript from '../components/missing-script';
import { deserialize, Details } from '../data/deserialize';
import { error } from '../platform/debug';
import { js } from '../utils/js';
import { dependMap, nativeDependMap } from './depend-maps';
import { decodeUuid } from './helper';

const missingClass = EDITOR && EditorExtends.MissingReporter.classInstance;

export interface IDependProp {
    uuid: string;
    owner: any;
    prop: string;
    type?: Constructor<Asset>;
}

export default function deserializeAsset (json: Record<string, any>, options: Record<string, any> & {
    __uuid__?: string;
}): Asset {
    let classFinder: deserialize.ClassFinder;
    if (EDITOR) {
        classFinder = (type, data, owner, propName): Constructor<unknown> => {
            const res = missingClass.classFinder(type, data, owner, propName);
            if (res) {
                return res as Constructor<unknown>;
            }
            return MissingScript;
        };
        classFinder.onDereferenced = missingClass.classFinder.onDereferenced;
    } else {
        classFinder = MissingScript.safeFindClass;
    }

    const tdInfo = Details.pool.get() as Details;

    let asset: Asset;
    try {
        asset = deserialize(json, tdInfo, {
            classFinder,
            customEnv: options,
        }) as Asset;
    } catch (e) {
        error(e);
        Details.pool.put(tdInfo);
        throw e;
    }

    asset._uuid = options.__uuid__ || '';

    if (EDITOR) {
        missingClass.reportMissingClass(asset);
        missingClass.reset();
    }

    const uuidList = tdInfo.uuidList! as string[];
    const objList = tdInfo.uuidObjList!;
    const propList = tdInfo.uuidPropList! as string[];
    const typeList = (tdInfo.uuidTypeList || []);
    const depends: IDependProp[] = [];

    for (let i = 0; i < uuidList.length; i++) {
        const dependUuid = uuidList[i];
        depends[i] = {
            uuid: decodeUuid(dependUuid),
            owner: objList[i],
            prop: propList[i],
            type: js._getClassById(typeList[i]) as Constructor<Asset>,
        };
    }

    // non-native deps
    dependMap.set(asset, depends);
    // native dep
    if (asset._native) {
        nativeDependMap.add(asset);
    }
    Details.pool.put(tdInfo);
    return asset;
}
