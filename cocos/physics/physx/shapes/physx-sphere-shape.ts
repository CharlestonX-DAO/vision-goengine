



import { absMaxComponent } from '../../../core';
import { SphereCollider } from '../../framework';
import { ISphereShape } from '../../spec/i-physics-shape';
import { PX } from '../physx-adapter';
import { PhysXInstance } from '../physx-instance';
import { EPhysXShapeType, PhysXShape } from './physx-shape';

export class PhysXSphereShape extends PhysXShape implements ISphereShape {
    static SPHERE_GEOMETRY: any;

    constructor () {
        super(EPhysXShapeType.SPHERE);
        if (!PhysXSphereShape.SPHERE_GEOMETRY) {
            PhysXSphereShape.SPHERE_GEOMETRY = new PX.SphereGeometry(0.5);
        }
    }

    updateRadius (): void {
        this.updateScale();
    }

    get collider () {
        return this._collider as SphereCollider;
    }

    onComponentSet () {
        this.updateGeometry();
        const pxmat = this.getSharedMaterial(this.collider.sharedMaterial!);
        this._impl = PhysXInstance.physics.createShape(PhysXSphereShape.SPHERE_GEOMETRY, pxmat, true, this._flags);
    }

    updateScale () {
        this.updateGeometry();
        this._impl.setGeometry(PhysXSphereShape.SPHERE_GEOMETRY);
        this.setCenter(this._collider.center);
    }

    updateGeometry () {
        const co = this.collider;
        const maxSp = Math.abs(absMaxComponent(this.collider.node.worldScale));
        PhysXSphereShape.SPHERE_GEOMETRY.setRadius(Math.max(0.0001, co.radius * maxSp));
    }
}
