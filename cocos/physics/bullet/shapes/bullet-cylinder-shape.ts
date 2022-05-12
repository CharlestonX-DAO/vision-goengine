



import { BulletShape } from './bullet-shape';
import { CylinderCollider } from '../../../../exports/physics-framework';
import { ICylinderShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { absMax } from '../../../core';
import { BulletCache } from '../bullet-cache';
import { bt } from '../instantiated';

export class BulletCylinderShape extends BulletShape implements ICylinderShape {
    setHeight (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.height,
            this.collider.direction,
            this._collider.node.worldScale,
        );
    }

    setDirection (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.height,
            this.collider.direction,
            this._collider.node.worldScale,
        );
    }

    setRadius (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.height,
            this.collider.direction,
            this._collider.node.worldScale,
        );
    }

    get collider () {
        return this._collider as CylinderCollider;
    }

    onComponentSet () {
        const bt_v3 = BulletCache.instance.BT_V3_0;
        bt.Vec3_set(bt_v3, 0.5, 1, 0.5);
        this._impl = bt.CylinderShape_new(bt_v3);
        this.setRadius(this.collider.radius);
    }

    updateScale () {
        super.updateScale();
        this.setRadius(this.collider.radius);
    }

    updateProperties (radius: number, height: number, direction: number, scale: IVec3Like) {
        const ws = scale;
        const upAxis = direction;
        let wr: number; let wh: number;
        if (upAxis === 1) {
            wh = height * Math.abs(ws.y); wr = radius * Math.abs(absMax(ws.x, ws.z));
        } else if (upAxis === 0) {
            wh = height * Math.abs(ws.x); wr = radius * Math.abs(absMax(ws.y, ws.z));
        } else {
            wh = height * Math.abs(ws.z); wr = radius * Math.abs(absMax(ws.x, ws.y));
        }
        bt.CylinderShape_updateProp(this._impl, wr, wh / 2, upAxis);
        this.updateCompoundTransform();
    }
}
