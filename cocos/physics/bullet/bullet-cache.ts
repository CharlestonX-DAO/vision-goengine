



import { Collider, TriggerEventType, CollisionEventType, IContactEquation } from '../../../exports/physics-framework';
import { Vec3, Quat } from '../../core';
import { bt } from './instantiated';

export const TriggerEventObject = {
    type: 'onTriggerEnter' as unknown as TriggerEventType,
    selfCollider: null as unknown as Collider,
    otherCollider: null as unknown as Collider,
    impl: null,
};

export const CollisionEventObject = {
    type: 'onCollisionEnter' as CollisionEventType,
    selfCollider: null as unknown as Collider,
    otherCollider: null as unknown as Collider,
    contacts: [] as IContactEquation[],
    impl: null,
};

export class BulletCache {
    private static _instance: BulletCache;
    static get instance () {
        if (BulletCache._instance == null) BulletCache._instance = new BulletCache();
        return BulletCache._instance;
    }

    static readonly ROOT: { [x: number]: Record<string, unknown> } = {};

    static setWrapper (impl: Bullet.ptr, type: string, wrap: any) {
        if (!this.ROOT[type]) this.ROOT[type] = {};
        this.ROOT[type][impl] = wrap;
    }

    static delWrapper (impl: Bullet.ptr, type: string) {
        delete this.ROOT[type][impl];
    }

    static getWrapper<T> (ptr: Bullet.ptr, type: string): T {
        return this.ROOT[type][ptr] as T;
    }

    static isNotEmptyShape (ptr: Bullet.ptr) { return ptr !== bt.EmptyShape_static(); }

    readonly BT_TRANSFORM_0 = bt.Transform_new();
    readonly BT_TRANSFORM_1 = bt.Transform_new();
    readonly BT_V3_0 = bt.Vec3_new(0, 0, 0);
    readonly BT_V3_1 = bt.Vec3_new(0, 0, 0);
    readonly BT_V3_2 = bt.Vec3_new(0, 0, 0);
    readonly BT_QUAT_0 = bt.Quat_new(0, 0, 0, 1);
}

export const CC_V3_0 = new Vec3();
export const CC_V3_1 = new Vec3();
export const CC_QUAT_0 = new Quat();

bt.CACHE = BulletCache;
