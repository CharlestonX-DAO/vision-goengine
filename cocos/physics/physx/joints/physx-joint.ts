



/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Constraint, RigidBody } from '../../framework';
import { IBaseConstraint } from '../../spec/i-physics-constraint';
import { PX, setJointActors, _pxtrans } from '../physx-adapter';
import { PhysXRigidBody } from '../physx-rigid-body';
import { PhysXInstance } from '../physx-instance';

export class PhysXJoint implements IBaseConstraint {
    private static _tempActor: any;

    static get tempActor (): any {
        if (!this._tempActor) {
            this._tempActor = PhysXInstance.physics.createRigidDynamic(_pxtrans);
        }
        return this._tempActor;
    }

    setConnectedBody (v: RigidBody | null): void {
        // TODO
    }

    setEnableCollision (v: boolean): void {
        this._impl.setConstraintFlag(1 << 3, v);
    }

    get impl (): any { return this._impl; }
    get constraint () { return this._com; }

    protected _impl!: any;
    protected _com!: Constraint;
    protected _rigidBody!: RigidBody;

    initialize (v: Constraint): void {
        this._com = v;
        this._rigidBody = v.attachedBody!;
        this.onComponentSet();
        this.setEnableCollision(this._com.enableCollision);
        if (this._impl.$$) {
            PX.IMPL_PTR[this._impl.$$.ptr] = this;
        }
    }

    // virtual
    protected onComponentSet (): void { }

    // virtual
    updateScale0 () { }
    updateScale1 () { }

    onEnable (): void {
        const sb = (this._rigidBody.body as PhysXRigidBody).sharedBody;
        const connect = this._com.connectedBody;
        sb.addJoint(this, 0);
        if (connect) {
            const sb2 = (connect.body as PhysXRigidBody).sharedBody;
            setJointActors(this._impl, sb.impl, sb2.impl);
            sb2.addJoint(this, 1);
        } else {
            setJointActors(this._impl, sb.impl, null);
        }
    }

    onDisable (): void {
        setJointActors(this._impl, PhysXJoint.tempActor, null);
        const sb = (this._rigidBody.body as PhysXRigidBody).sharedBody;
        sb.removeJoint(this, 0);
        const connect = this.constraint.connectedBody;
        if (connect) {
            const sb2 = (connect.body as PhysXRigidBody).sharedBody;
            sb2.removeJoint(this, 1);
        }
    }

    onDestroy (): void {
        if (this._impl.$$) {
            PX.IMPL_PTR[this._impl.$$.ptr] = null;
            delete PX.IMPL_PTR[this._impl.$$.ptr];
        }
        this._impl.release();
        (this._com as any) = null;
        (this._rigidBody as any) = null;
        this._impl = null;
    }
}
