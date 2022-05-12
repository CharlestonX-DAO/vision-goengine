



import CANNON from '@cocos/cannon';
import { CannonConstraint } from './cannon-constraint';
import { IPointToPointConstraint } from '../../spec/i-physics-constraint';
import { IVec3Like, Vec3 } from '../../../core';
import { PointToPointConstraint } from '../../framework';
import { CannonRigidBody } from '../cannon-rigid-body';

const v3_0 = new Vec3();

export class CannonPointToPointConstraint extends CannonConstraint implements IPointToPointConstraint {
    public get impl () {
        return this._impl as CANNON.PointToPointConstraint;
    }

    public get constraint () {
        return this._com as PointToPointConstraint;
    }

    setPivotA (v: IVec3Like): void {
        const cs = this.constraint;
        Vec3.multiply(this.impl.pivotA, cs.node.worldScale, cs.pivotA);
        if (!cs.connectedBody) this.setPivotB(cs.pivotB);
    }

    setPivotB (v: IVec3Like): void {
        const cs = this.constraint;
        const cb = cs.connectedBody;
        if (cb) {
            Vec3.multiply(this.impl.pivotB, cb.node.worldScale, cs.pivotB);
        } else {
            const node = cs.node;
            Vec3.multiply(v3_0, node.worldScale, cs.pivotA);
            Vec3.add(v3_0, v3_0, node.worldPosition);
            Vec3.add(v3_0, v3_0, cs.pivotB);
            Vec3.copy(this.impl.pivotB, v3_0);
        }
    }

    onComponentSet () {
        const bodyA = (this._rigidBody.body as CannonRigidBody).impl;
        const cb = this.constraint.connectedBody;
        let bodyB: CANNON.Body = (CANNON.World as any).staticBody;
        if (cb) {
            bodyB = (cb.body as CannonRigidBody).impl;
        }
        this._impl = new CANNON.PointToPointConstraint(bodyA, null, bodyB);
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
