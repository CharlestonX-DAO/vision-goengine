



/* eslint-disable new-cap */
import { IBaseConstraint } from '../../spec/i-physics-constraint';
import { Constraint, RigidBody } from '../../framework';
import { BulletRigidBody } from '../bullet-rigid-body';
import { bt } from '../instantiated';

export abstract class BulletConstraint implements IBaseConstraint {
    setConnectedBody (v: RigidBody | null): void {
        // TODO: support dynamic change connected body
    }

    setEnableCollision (v: boolean): void {
        if (this._collided !== v) {
            this._collided = v;
            this.updateByReAdd();
        }
    }

    get impl () {
        return this._impl;
    }

    get constraint (): Constraint {
        return this._com;
    }

    dirty = 0;
    index = -1;

    protected _impl: Bullet.ptr = 0;
    protected _com!: Constraint;
    protected _rigidBody!: RigidBody;
    protected _collided = false;

    updateByReAdd () {
        if (this._rigidBody && this.index >= 0) {
            const sb = (this._rigidBody.body as BulletRigidBody).sharedBody;
            sb.wrappedWorld.removeConstraint(this);
            sb.wrappedWorld.addConstraint(this);
        }
    }

    initialize (v: Constraint): void {
        this._com = v;
        this._rigidBody = v.attachedBody!;
        this._collided = v.enableCollision;
        this.onComponentSet();
    }

    // virtual
    protected abstract onComponentSet(): void;

    abstract updateScale0(): void;
    abstract updateScale1(): void;

    onEnable (): void {
        const sb = (this._rigidBody.body as BulletRigidBody).sharedBody;
        sb.wrappedWorld.addConstraint(this);
        sb.addJoint(this, 0);
        const connect = this.constraint.connectedBody;
        if (connect) {
            const sb2 = (connect.body as BulletRigidBody).sharedBody;
            sb2.addJoint(this, 1);
        }
    }

    onDisable (): void {
        const sb = (this._rigidBody.body as BulletRigidBody).sharedBody;
        sb.wrappedWorld.removeConstraint(this);
        sb.removeJoint(this, 0);
        const connect = this.constraint.connectedBody;
        if (connect) {
            const sb2 = (connect.body as BulletRigidBody).sharedBody;
            sb2.removeJoint(this, 1);
        }
    }

    onDestroy (): void {
        bt.TypedConstraint_del(this._impl);
        (this._com as any) = null;
        (this._rigidBody as any) = null;
    }
}
