



import { BulletShape } from './bullet-shape';
import { SimplexCollider } from '../../../../exports/physics-framework';
import { cocos2BulletVec3 } from '../bullet-utils';
import { ISimplexShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { bt } from '../instantiated';
import { BulletCache } from '../bullet-cache';

export class BulletSimplexShape extends BulletShape implements ISimplexShape {
    setShapeType (v: SimplexCollider.ESimplexType) {
        // TODO:
    }

    setVertices (v: IVec3Like[]) {
        // TODO:
    }

    get collider () {
        return this._collider as SimplexCollider;
    }

    protected onComponentSet () {
        this._impl = bt.SimplexShape_new();
        const length = this.collider.shapeType;
        const vertices = this.collider.vertices;
        const bt_v3 = BulletCache.instance.BT_V3_0;
        for (let i = 0; i < length; i++) {
            bt.SimplexShape_addVertex(this._impl, cocos2BulletVec3(bt_v3, vertices[i]));
        }
        bt.CollisionShape_setLocalScaling(this._impl, cocos2BulletVec3(bt_v3, this._collider.node.worldScale));
    }

    onLoad () {
        super.onLoad();
        this.collider.updateVertices();
    }

    updateScale () {
        super.updateScale();
        const bt_v3 = BulletCache.instance.BT_V3_0;
        bt.CollisionShape_setLocalScaling(this._impl, cocos2BulletVec3(bt_v3, this._collider.node.worldScale));
    }
}
