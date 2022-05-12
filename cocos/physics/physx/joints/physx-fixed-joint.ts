



import { IVec3Like } from '../../../core';
import { PointToPointConstraint } from '../../framework';
import { IPointToPointConstraint } from '../../spec/i-physics-constraint';
import { PX, _trans } from '../physx-adapter';
import { PhysXWorld } from '../physx-world';
import { PhysXJoint } from './physx-joint';

export class PhysXFixedJoint extends PhysXJoint implements IPointToPointConstraint {
    setPivotA (v: IVec3Like): void {
    }

    setPivotB (v: IVec3Like): void {
    }

    get constraint (): PointToPointConstraint {
        return this._com as PointToPointConstraint;
    }

    onComponentSet (): void {
        if (this._rigidBody) {
            this._impl = PX.PxFixedJointCreate(PhysXInstance.physics, null, _trans, null, _trans);
            this.setPivotA(this.constraint.pivotA);
            this.setPivotB(this.constraint.pivotB);
        }
    }
}
