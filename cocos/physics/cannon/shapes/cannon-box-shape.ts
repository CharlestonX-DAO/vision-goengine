



import CANNON from '@cocos/cannon';
import { clamp, Vec3 } from '../../../core/math';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { IBoxShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { BoxCollider, physics, PhysicsSystem } from '../../../../exports/physics-framework';
import { absolute, VEC3_0 } from '../../utils/util';

export class CannonBoxShape extends CannonShape implements IBoxShape {
    public get collider () {
        return this._collider as BoxCollider;
    }

    public get impl () {
        return this._shape as CANNON.Box;
    }

    readonly halfExtent: CANNON.Vec3;
    constructor () {
        super();
        this.halfExtent = new CANNON.Vec3(0.5, 0.5, 0.5);
        this._shape = new CANNON.Box(this.halfExtent.clone());
    }

    updateSize () {
        Vec3.multiplyScalar(this.halfExtent, this.collider.size, 0.5);
        const ws = absolute(VEC3_0.set(this.collider.node.worldScale));
        const x = this.halfExtent.x * ws.x;
        const y = this.halfExtent.y * ws.y;
        const z = this.halfExtent.z * ws.z;
        const minVolumeSize = PhysicsSystem.instance.minVolumeSize;
        this.impl.halfExtents.x = clamp(x, minVolumeSize, Number.MAX_VALUE);
        this.impl.halfExtents.y = clamp(y, minVolumeSize, Number.MAX_VALUE);
        this.impl.halfExtents.z = clamp(z, minVolumeSize, Number.MAX_VALUE);
        this.impl.updateConvexPolyhedronRepresentation();
        if (this._index !== -1) {
            commitShapeUpdates(this._body);
        }
    }

    onLoad () {
        super.onLoad();
        this.updateSize();
    }

    setScale (scale: Vec3): void {
        super.setScale(scale);
        this.updateSize();
    }
}
