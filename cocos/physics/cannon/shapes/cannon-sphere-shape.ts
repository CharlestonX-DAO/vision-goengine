



import CANNON from '@cocos/cannon';
import { absMaxComponent, clamp, Vec3 } from '../../../core/math';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { ISphereShape } from '../../spec/i-physics-shape';
import { PhysicsSystem, SphereCollider } from '../../../../exports/physics-framework';

export class CannonSphereShape extends CannonShape implements ISphereShape {
    get collider () {
        return this._collider as SphereCollider;
    }

    get impl () {
        return this._shape as CANNON.Sphere;
    }

    updateRadius () {
        const max = Math.abs(absMaxComponent(this.collider.node.worldScale));
        this.impl.radius = clamp(this.collider.radius * Math.abs(max), PhysicsSystem.instance.minVolumeSize, Number.MAX_VALUE);
        this.impl.updateBoundingSphereRadius();
        if (this._index !== -1) {
            commitShapeUpdates(this._body);
        }
    }

    constructor (radius = 0.5) {
        super();
        this._shape = new CANNON.Sphere(radius);
    }

    onLoad () {
        super.onLoad();
        this.updateRadius();
    }

    setScale (scale: Vec3): void {
        super.setScale(scale);
        this.updateRadius();
    }
}
