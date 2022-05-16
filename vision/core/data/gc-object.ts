import { EDITOR } from 'internal:constants';
import { ccclass } from './decorators';
import { garbageCollectionManager } from './garbage-collection';
import { CCObject } from './object';

@ccclass('cc.GCObject')
export class GCObject extends CCObject {
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public declare _finalizationToken: any;

    constructor (...arg: ConstructorParameters<typeof CCObject>) {
        super(...arg);
        return garbageCollectionManager.registerGCObject(this);
    }

    public equals (gcObject: GCObject | null) {
        if (!gcObject) { return false; }
        if (EDITOR) {
            return gcObject._finalizationToken === this._finalizationToken;
        } else {
            return gcObject === this;
        }
    }

    public destroy () {
        garbageCollectionManager.unregisterGCObject(this);
        return super.destroy();
    }
}
