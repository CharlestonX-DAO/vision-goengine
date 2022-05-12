



import { BulletShape } from './bullet-shape';
import { warnID } from '../../../core';
import { Mesh } from '../../../3d/assets';
import { MeshCollider } from '../../../../exports/physics-framework';
import { cocos2BulletVec3, cocos2BulletTriMesh } from '../bullet-utils';
import { ITrimeshShape } from '../../spec/i-physics-shape';
import { BulletCache } from '../bullet-cache';
import { bt } from '../instantiated';

export class BulletTrimeshShape extends BulletShape implements ITrimeshShape {
    public get collider () {
        return this._collider as MeshCollider;
    }

    setMesh (v: Mesh | null) {
        if (!this._isInitialized) return;

        if (this._impl && BulletCache.isNotEmptyShape(this._impl)) {
            // TODO: change the mesh after initialization
            warnID(9620);
        } else {
            const mesh = v;
            if (mesh && mesh.renderingSubMeshes.length > 0) {
                const btTriangleMesh = this._getBtTriangleMesh(mesh);
                if (this.collider.convex) {
                    this._impl = bt.ConvexTriangleMeshShape_new(btTriangleMesh);
                } else {
                    this._impl = bt.BvhTriangleMeshShape_new(btTriangleMesh, true, true);
                }
                const bt_v3 = BulletCache.instance.BT_V3_0;
                cocos2BulletVec3(bt_v3, this._collider.node.worldScale);
                bt.CollisionShape_setMargin(this._impl, 0.01);
                bt.CollisionShape_setLocalScaling(this._impl, bt_v3);
                this.setCompound(this._compound);
                this.updateByReAdd();
                this.setWrapper();
            } else {
                this._impl = bt.EmptyShape_static();
            }
        }
    }

    private refBtTriangleMesh: Bullet.ptr = 0;

    onComponentSet () {
        this.setMesh(this.collider.mesh);
    }

    onDestroy () {
        if (this.refBtTriangleMesh) { bt.TriangleMesh_del(this.refBtTriangleMesh); }
        super.onDestroy();
    }

    updateScale () {
        super.updateScale();
        const bt_v3 = BulletCache.instance.BT_V3_0;
        cocos2BulletVec3(bt_v3, this._collider.node.worldScale);
        bt.CollisionShape_setLocalScaling(this._impl, bt_v3);
        this.updateCompoundTransform();
    }

    private _getBtTriangleMesh (mesh: Mesh): Bullet.ptr {
        this.refBtTriangleMesh = bt.TriangleMesh_new();
        cocos2BulletTriMesh(this.refBtTriangleMesh, mesh);
        return this.refBtTriangleMesh;
    }
}
