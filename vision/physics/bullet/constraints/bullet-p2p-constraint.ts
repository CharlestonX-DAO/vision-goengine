



/* eslint-disable new-cap */
import { BulletConstraint } from './bullet-constraint';
import { IPointToPointConstraint } from '../../spec/i-physics-constraint';
import { IVec3Like, Vec3 } from '../../../core';
import { PointToPointConstraint } from '../../framework';
import { BulletRigidBody } from '../bullet-rigid-body';
import { BulletCache, CC_V3_0 } from '../bullet-cache';
import { bt } from '../instantiated';
import { cocos2BulletVec3 } from '../bullet-utils';

export class BulletP2PConstraint extends BulletConstraint implements IPointToPointConstraint {
    setPivotA (v: IVec3Like): void {
        const cs = this.constraint;
        const pivotA = BulletCache.instance.BT_V3_0;
        Vec3.multiply(CC_V3_0, cs.node.worldScale, cs.pivotA);
        cocos2BulletVec3(pivotA, CC_V3_0);
        bt.P2PConstraint_setPivotA(this._impl, pivotA);
        if (!cs.connectedBody) this.setPivotB(cs.pivotB);
    }

    setPivotB (v: IVec3Like): void {
        const cs = this.constraint;
        const node = this._rigidBody.node;
        const pivotB = BulletCache.instance.BT_V3_0;
        const cb = cs.connectedBody;
        if (cb) {
            Vec3.multiply(CC_V3_0, cb.node.worldScale, cs.pivotB);
            cocos2BulletVec3(pivotB, CC_V3_0);
        } else {
            Vec3.multiply(CC_V3_0, node.worldScale, cs.pivotA);
            Vec3.add(CC_V3_0, CC_V3_0, node.worldPosition);
            Vec3.add(CC_V3_0, CC_V3_0, cs.pivotB);
            cocos2BulletVec3(pivotB, CC_V3_0);
        }
        bt.P2PConstraint_setPivotB(this._impl, pivotB);
    }

    get constraint (): PointToPointConstraint {
        return this._com as PointToPointConstraint;
    }

    onComponentSet (): void {
        const cb = this.constraint.connectedBody;
        const bodyA = (this._rigidBody.body as BulletRigidBody).impl;
        const bodyB = cb ? (cb.body as BulletRigidBody).impl : bt.TypedConstraint_getFixedBody();
        const pivotA = BulletCache.instance.BT_V3_0;
        const pivotB = BulletCache.instance.BT_V3_1;
        this._impl = bt.P2PConstraint_new(bodyA, bodyB, pivotA, pivotB);
        this.setPivotA(this.constraint.pivotA);
        this.setPivotB(this.constraint.pivotB);
    }

    updateScale0 () {
        this.setPivotA(this.constraint.pivotA);
    }

    updateScale1 () {
        this.setPivotB(this.constraint.pivotB);
    }
}
