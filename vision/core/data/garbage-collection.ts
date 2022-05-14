
import { EDITOR } from 'internal:constants';
import { GCObject } from './gc-object';

declare class FinalizationRegistry {
    constructor (callback: (heldObj: any) => void);
    register (obj: any, heldObj: any, token?: any);
    unregister (token: any);
}

class GarbageCollectionManager {
    private _finalizationRegistry: FinalizationRegistry | null = EDITOR ? new FinalizationRegistry(this.finalizationRegistryCallback.bind(this)) : null;

    public registerGCObject (gcObject: GCObject): GCObject {
        if (EDITOR) {
            gcObject._finalizationToken = {};
            const proxy = new Proxy(gcObject, {});
            this._finalizationRegistry!.register(proxy, gcObject, gcObject._finalizationToken);
            return proxy;
        } else {
            return gcObject;
        }
    }

    public unregisterGCObject (gcObject: GCObject) {
        if (EDITOR) {
            this._finalizationRegistry!.unregister(gcObject._finalizationToken);
        }
    }

    public init () {
    }

    private finalizationRegistryCallback (gcObject: GCObject) {
        if (gcObject.isValid) {
            gcObject.destroy();
        }
    }

    public destroy () {
    }
}

const garbageCollectionManager = new GarbageCollectionManager();
export { garbageCollectionManager };
