

import { Vec3 } from '../../../core/math';
import { OBB } from '../../../core/geometry';
import { BuiltinShape } from './builtin-shape';
import { IBoxShape } from '../../spec/i-physics-shape';
import { BoxCollider } from '../../../../exports/physics-framework';
import { IVec3Like } from '../../../core/math/type-define';

export class BuiltinBoxShape extends BuiltinShape implements IBoxShape {
    get localObb () {
        return this._localShape as OBB;
    }

    get worldObb () {
        return this._worldShape as OBB;
    }

    get collider () {
        return this._collider as BoxCollider;
    }

    constructor () {
        super();
        this._localShape = new OBB();
        this._worldShape = new OBB();
    }

    updateSize () {
        Vec3.multiplyScalar(this.localObb.halfExtents, this.collider.size, 0.5);
        Vec3.multiply(this.worldObb.halfExtents, this.localObb.halfExtents, this.collider.node.worldScale);
    }

    onLoad () {
        super.onLoad();
        this.updateSize();
    }
}
