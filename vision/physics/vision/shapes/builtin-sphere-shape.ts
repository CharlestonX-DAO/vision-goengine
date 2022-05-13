

import { Sphere } from '../../../core/geometry';
import { BuiltinShape } from './builtin-shape';
import { ISphereShape } from '../../spec/i-physics-shape';
import { maxComponent } from '../../utils/util';
import { SphereCollider } from '../../../../exports/physics-framework';

export class BuiltinSphereShape extends BuiltinShape implements ISphereShape {
    updateRadius () {
        this.localSphere.radius = this.collider.radius;
        const s = maxComponent(this.collider.node.worldScale);
        this.worldSphere.radius = this.localSphere.radius * s;
    }

    get localSphere () {
        return this._localShape as Sphere;
    }

    get worldSphere () {
        return this._worldShape as Sphere;
    }

    get collider () {
        return this._collider as SphereCollider;
    }

    constructor (radius = 0.5) {
        super();
        this._localShape = new Sphere(0, 0, 0, radius);
        this._worldShape = new Sphere(0, 0, 0, radius);
    }

    onLoad () {
        super.onLoad();
        this.updateRadius();
    }
}
