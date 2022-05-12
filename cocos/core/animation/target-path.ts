



import { ccclass, serializable } from 'cc.decorator';
import { Node } from '../scene-graph/node';
import { warn, warnID } from '../platform/debug';

export type PropertyPath = string | number;

export interface ICustomTargetPath {
    /**
     * If errors are encountered, `null` should be returned.
     * @param target
     */
    get(target: any): any;
}

export type TargetPath = PropertyPath | ICustomTargetPath;

export function isPropertyPath (path: TargetPath): path is PropertyPath {
    return typeof path === 'string' || typeof path === 'number';
}

export function isCustomPath<T extends ICustomTargetPath> (path: TargetPath, constructor: Constructor<T>): path is T {
    return path instanceof constructor;
}

@ccclass('cc.animation.HierarchyPath')
export class HierarchyPath implements ICustomTargetPath {
    @serializable
    public path = '';

    constructor (path?: string) {
        this.path = path || '';
    }

    public get (target: Node) {
        if (!(target instanceof Node)) {
            warnID(3925);
            return null;
        }
        const result = target.getChildByPath(this.path);
        if (!result) {
            warnID(3926, target.name, this.path);
            return null;
        }
        return result;
    }
}

@ccclass('cc.animation.ComponentPath')
export class ComponentPath implements ICustomTargetPath {
    @serializable
    public component = '';

    constructor (component?: string) {
        this.component = component || '';
    }

    public get (target: Node) {
        if (!(target instanceof Node)) {
            warnID(3927);
            return null;
        }
        const result = target.getComponent(this.component);
        if (!result) {
            warnID(3928, target.name, this.component);
            return null;
        }
        return result;
    }
}
