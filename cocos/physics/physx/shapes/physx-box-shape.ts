



import { BoxCollider } from '../../framework';
import { absolute, VEC3_0 } from '../../utils/util';
import { IBoxShape } from '../../spec/i-physics-shape';
import { PX } from '../physx-adapter';
import { EPhysXShapeType, PhysXShape } from './physx-shape';
import { PhysXInstance } from '../physx-instance';

export class PhysXBoxShape extends PhysXShape implements IBoxShape {
    static BOX_GEOMETRY: any;

    constructor () {
        super(EPhysXShapeType.BOX);
        if (!PhysXBoxShape.BOX_GEOMETRY) {
            VEC3_0.set(0.5, 0.5, 0.5);
            PhysXBoxShape.BOX_GEOMETRY = new PX.BoxGeometry(VEC3_0);
        }
    }

    updateSize (): void {
        this.updateScale();
    }

    get collider (): BoxCollider {
        return this._collider as BoxCollider;
    }

    onComponentSet (): void {
        this.updateGeometry();
        const pxmat = this.getSharedMaterial(this._collider.sharedMaterial!);
        this._impl = PhysXInstance.physics.createShape(PhysXBoxShape.BOX_GEOMETRY, pxmat, true, this._flags);
    }

    updateScale (): void {
        this.updateGeometry();
        this._impl.setGeometry(PhysXBoxShape.BOX_GEOMETRY);
        this.setCenter(this._collider.center);
    }

    updateGeometry (): void {
        const co = this.collider;
        const ws = co.node.worldScale;
        VEC3_0.set(co.size).multiplyScalar(0.5).multiply(ws);
        PhysXBoxShape.BOX_GEOMETRY.setHalfExtents(absolute(VEC3_0));
    }
}
