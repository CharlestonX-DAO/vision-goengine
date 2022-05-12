



import { BulletShape } from './bullet-shape';
import { PlaneCollider } from '../../../../exports/physics-framework';
import { cocos2BulletVec3 } from '../bullet-utils';
import { IPlaneShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { BulletCache } from '../bullet-cache';
import { bt } from '../instantiated';

export class BulletPlaneShape extends BulletShape implements IPlaneShape {
    setNormal (v: IVec3Like) {
        cocos2BulletVec3(bt.StaticPlaneShape_getPlaneNormal(this.impl), v);
        this.updateCompoundTransform();
    }

    setConstant (v: number) {
        bt.StaticPlaneShape_setPlaneConstant(this.impl, v);
        this.updateCompoundTransform();
    }

    updateScale () {
        super.updateScale();
        const bt_v3 = BulletCache.instance.BT_V3_0;
        cocos2BulletVec3(bt_v3, this._collider.node.worldScale);
        bt.CollisionShape_setLocalScaling(this._impl, bt_v3);
        this.updateCompoundTransform();
    }

    get collider () {
        return this._collider as PlaneCollider;
    }

    onComponentSet () {
        const normal = BulletCache.instance.BT_V3_0;
        cocos2BulletVec3(normal, this.collider.normal);
        this._impl = bt.StaticPlaneShape_new(normal, this.collider.constant);
        this.updateScale();
    }
}
