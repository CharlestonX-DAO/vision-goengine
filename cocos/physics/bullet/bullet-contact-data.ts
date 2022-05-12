



import { IContactEquation, ICollisionEvent } from '../framework';
import { IVec3Like, Vec3, Quat } from '../../core';
import { BulletShape } from './shapes/bullet-shape';
import { CC_QUAT_0, BulletCache } from './bullet-cache';
import { bt } from './instantiated';
import { bullet2CocosQuat, bullet2CocosVec3 } from './bullet-utils';

export class BulletContactData implements IContactEquation {
    get isBodyA (): boolean {
        const sb = (this.event.selfCollider.shape as BulletShape).sharedBody.body;
        return sb === bt.PersistentManifold_getBody0(this.impl);
    }

    impl: Bullet.ptr = 0;

    constructor (public event: ICollisionEvent) { }

    getLocalPointOnA (out: IVec3Like): void {
        if (this.impl) bullet2CocosVec3(out, bt.ManifoldPoint_get_m_localPointA(this.impl));
    }

    getLocalPointOnB (out: IVec3Like): void {
        if (this.impl) bullet2CocosVec3(out, bt.ManifoldPoint_get_m_localPointB(this.impl));
    }

    getWorldPointOnA (out: IVec3Like): void {
        if (this.impl) bullet2CocosVec3(out, bt.ManifoldPoint_get_m_positionWorldOnA(this.impl));
    }

    getWorldPointOnB (out: IVec3Like): void {
        if (this.impl) bullet2CocosVec3(out, bt.ManifoldPoint_get_m_positionWorldOnB(this.impl));
    }

    getLocalNormalOnA (out: IVec3Like): void {
        if (this.impl) {
            const bt_rot = BulletCache.instance.BT_QUAT_0;
            const body = bt.PersistentManifold_getBody0(this.impl);
            const trans = bt.CollisionObject_getWorldTransform(body);
            bt.Transform_getRotation(trans, bt_rot);
            const inv_rot = CC_QUAT_0;
            bullet2CocosQuat(inv_rot, bt_rot);
            Quat.conjugate(inv_rot, inv_rot);
            bullet2CocosVec3(out, bt.ManifoldPoint_get_m_normalWorldOnB(this.impl));
            if (!this.isBodyA) Vec3.negate(out, out);
            Vec3.transformQuat(out, out, inv_rot);
        }
    }

    getLocalNormalOnB (out: IVec3Like): void {
        if (this.impl) {
            const bt_rot = BulletCache.instance.BT_QUAT_0;
            const body = bt.PersistentManifold_getBody1(this.impl);
            const trans = bt.CollisionObject_getWorldTransform(body);
            bt.Transform_getRotation(trans, bt_rot);
            const inv_rot = CC_QUAT_0;
            bullet2CocosQuat(inv_rot, bt_rot);
            Quat.conjugate(inv_rot, inv_rot);
            bullet2CocosVec3(out, bt.ManifoldPoint_get_m_normalWorldOnB(this.impl));
            Vec3.transformQuat(out, out, inv_rot);
        }
    }

    getWorldNormalOnA (out: IVec3Like): void {
        if (this.impl) {
            bullet2CocosVec3(out, bt.ManifoldPoint_get_m_normalWorldOnB(this.impl));
            if (!this.isBodyA) Vec3.negate(out, out);
        }
    }

    getWorldNormalOnB (out: IVec3Like): void {
        if (this.impl) bullet2CocosVec3(out, bt.ManifoldPoint_get_m_normalWorldOnB(this.impl));
    }
}
