



import CANNON from '@cocos/cannon';
import { IBaseConstraint } from '../../spec/i-physics-constraint';
import { Constraint, RigidBody } from '../../framework';
import { CannonRigidBody } from '../cannon-rigid-body';
import { getWrap } from '../../utils/util';
import { CannonSharedBody } from '../cannon-shared-body';

(CANNON.World as any).staticBody = new CANNON.Body();
(CANNON.World as any).idToConstraintMap = {};

export class CannonConstraint implements IBaseConstraint {
    setConnectedBody (v: RigidBody | null): void {
        const oldSB = getWrap<CannonSharedBody>(this.impl.bodyB);
        if (oldSB) oldSB.removeJoint(this, 1);

        if (v) {
            this._impl.bodyB = (v.body as CannonRigidBody).impl;
            const newSB = (v.body as CannonRigidBody).sharedBody;
            newSB.addJoint(this, 1);
        } else {
            this._impl.bodyB = (CANNON.World as any).staticBody;
        }
        const newBJ = this._impl.bodyB;
        this._impl.equations.forEach((v: CANNON.Equation) => { v.bj = newBJ; });
    }

    setEnableCollision (v: boolean): void {
        this._impl.collideConnected = v;
    }

    get impl () { return this._impl; }
    get constraint () { return this._com; }

    protected _impl!: CANNON.Constraint;
    protected _com!: Constraint;
    protected _rigidBody!: RigidBody;

    initialize (v: Constraint): void {
        this._com = v;
        this._rigidBody = v.attachedBody!;
        this.onComponentSet();
        this.setEnableCollision(v.enableCollision);
        (CANNON.World as any).idToConstraintMap[this._impl.id] = this._impl;
    }

    // virtual
    protected onComponentSet () { }

    // virtual
    updateScale0 () { }
    updateScale1 () { }

    onEnable () {
        const sb = (this._rigidBody.body as CannonRigidBody).sharedBody;
        sb.wrappedWorld.addConstraint(this);
        sb.addJoint(this, 0);
        const connect = this.constraint.connectedBody;
        if (connect) {
            const sb2 = (connect.body as CannonRigidBody).sharedBody;
            sb2.addJoint(this, 1);
        }
    }

    onDisable () {
        const sb = (this._rigidBody.body as CannonRigidBody).sharedBody;
        sb.wrappedWorld.removeConstraint(this);
        sb.removeJoint(this, 0);
        const connect = this.constraint.connectedBody;
        if (connect) {
            const sb2 = (connect.body as CannonRigidBody).sharedBody;
            sb2.removeJoint(this, 1);
        }
    }

    onDestroy () {
        delete (CANNON.World as any).idToConstraintMap[this._impl.id];
        (this._com as any) = null;
        (this._rigidBody as any) = null;
        (this._impl as any) = null;
    }
}
