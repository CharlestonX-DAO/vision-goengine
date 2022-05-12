



import { absMax } from '../../../core';
import { BulletShape } from './bullet-shape';
import { CapsuleCollider } from '../../../../exports/physics-framework';
import { ICapsuleShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { bt } from '../instantiated';

export class BulletCapsuleShape extends BulletShape implements ICapsuleShape {
    setCylinderHeight (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.cylinderHeight,
            this.collider.direction,
            this._collider.node.worldScale,
        );
    }

    setDirection (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.cylinderHeight,
            this.collider.direction,
            this._collider.node.worldScale,
        );
    }

    setRadius (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.cylinderHeight,
            this.collider.direction,
            this._collider.node.worldScale,
        );
    }

    get collider () {
        return this._collider as CapsuleCollider;
    }

    onComponentSet () {
        this._impl = bt.CapsuleShape_new(0.5, 1);
        this.setRadius(this.collider.radius);
    }

    updateScale () {
        super.updateScale();
        this.setRadius(this.collider.radius);
    }

    updateProperties (radius: number, height: number, direction: number, scale: IVec3Like) {
        const ws = scale;
        const upAxis = direction;
        let wr: number; let halfH: number;
        if (upAxis === 1) {
            wr = radius * Math.abs(absMax(ws.x, ws.z));
            halfH = height / 2 * Math.abs(ws.y);
        } else if (upAxis === 0) {
            wr = radius * Math.abs(absMax(ws.y, ws.z));
            halfH = height / 2 * Math.abs(ws.x);
        } else {
            wr = radius * Math.abs(absMax(ws.x, ws.y));
            halfH = height / 2 * Math.abs(ws.z);
        }
        bt.CapsuleShape_updateProp(this._impl, wr, halfH, upAxis);
        this.updateCompoundTransform();
    }
}
