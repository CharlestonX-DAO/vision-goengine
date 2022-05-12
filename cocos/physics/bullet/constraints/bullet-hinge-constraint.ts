



/* eslint-disable new-cap */
import { BulletConstraint } from './bullet-constraint';
import { IHingeConstraint } from '../../spec/i-physics-constraint';
import { IVec3Like, Quat, Vec3 } from '../../../core';
import { HingeConstraint } from '../../framework';
import { BulletRigidBody } from '../bullet-rigid-body';
import { BulletCache, CC_QUAT_0, CC_V3_0 } from '../bullet-cache';
import { bt } from '../instantiated';
import { cocos2BulletQuat, cocos2BulletVec3 } from '../bullet-utils';

export class BulletHingeConstraint extends BulletConstraint implements IHingeConstraint {
    setPivotA (v: IVec3Like): void {
        this.updateFrames();
    }

    setPivotB (v: IVec3Like): void {
        this.updateFrames();
    }

    setAxis (v: IVec3Like) {
        this.updateFrames();
    }

    get constraint (): HingeConstraint {
        return this._com as HingeConstraint;
    }

    onComponentSet () {
        const cb = this.constraint.connectedBody;
        const bodyA = (this._rigidBody.body as BulletRigidBody).impl;
        const bodyB = cb ? (cb.body as BulletRigidBody).impl : bt.TypedConstraint_getFixedBody();
        const trans0 = BulletCache.instance.BT_TRANSFORM_0;
        const trans1 = BulletCache.instance.BT_TRANSFORM_1;
        this._impl = bt.HingeConstraint_new(bodyA, bodyB, trans0, trans1);
        this.updateFrames();
    }

    updateFrames () {
        const cs = this.constraint;
        const node = cs.node;
        const v3_0 = CC_V3_0;
        const rot_0 = CC_QUAT_0;
        const trans0 = BulletCache.instance.BT_TRANSFORM_0;
        Vec3.multiply(v3_0, node.worldScale, cs.pivotA);
        cocos2BulletVec3(bt.Transform_getOrigin(trans0), v3_0);
        const quat = BulletCache.instance.BT_QUAT_0;
        Quat.rotationTo(rot_0, Vec3.UNIT_Z, cs.axis);
        cocos2BulletQuat(quat, rot_0);
        bt.Transform_setRotation(trans0, quat);

        const trans1 = BulletCache.instance.BT_TRANSFORM_1;
        const cb = this.constraint.connectedBody;
        if (cb) {
            Vec3.multiply(v3_0, cb.node.worldScale, cs.pivotB);
        } else {
            Vec3.multiply(v3_0, node.worldScale, cs.pivotA);
            Vec3.add(v3_0, v3_0, node.worldPosition);
            Vec3.add(v3_0, v3_0, cs.pivotB);
            Quat.multiply(rot_0, rot_0, node.worldRotation);
        }
        cocos2BulletVec3(bt.Transform_getOrigin(trans1), v3_0);
        cocos2BulletQuat(quat, rot_0);
        bt.Transform_setRotation(trans1, quat);
        bt.HingeConstraint_setFrames(this._impl, trans0, trans1);
    }

    updateScale0 () {
        this.updateFrames();
    }

    updateScale1 () {
        this.updateFrames();
    }
}
