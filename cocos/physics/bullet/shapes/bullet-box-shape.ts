/* eslint-disable new-cap */




import { BulletShape } from './bullet-shape';
import { Vec3 } from '../../../core';
import { BoxCollider, PhysicsSystem } from '../../../../exports/physics-framework';
import { IBoxShape } from '../../spec/i-physics-shape';
import { absolute, VEC3_0 } from '../../utils/util';
import { cocos2BulletVec3 } from '../bullet-utils';
import { BulletCache } from '../bullet-cache';
import { bt } from '../instantiated';

export class BulletBoxShape extends BulletShape implements IBoxShape {
    updateSize () {
        const hf = BulletCache.instance.BT_V3_0;
        cocos2BulletVec3(hf, this.getMinUnscaledHalfExtents(VEC3_0));
        bt.BoxShape_setUnscaledHalfExtents(this.impl, hf);
        this.updateCompoundTransform();
    }

    get collider () {
        return this._collider as BoxCollider;
    }

    onComponentSet () {
        const hf = BulletCache.instance.BT_V3_0;
        cocos2BulletVec3(hf, this.getMinUnscaledHalfExtents(VEC3_0));
        this._impl = bt.BoxShape_new(hf);
        this.updateScale();
    }

    updateScale () {
        super.updateScale();
        const bt_v3 = BulletCache.instance.BT_V3_0;
        bt.CollisionShape_setLocalScaling(this._impl, cocos2BulletVec3(bt_v3, this.getMinScale(VEC3_0)));
        this.updateCompoundTransform();
    }

    getMinUnscaledHalfExtents (out: Vec3) {
        const size = this.collider.size;
        const ws = absolute(VEC3_0.set(this._collider.node.worldScale));
        const minVolumeSize = PhysicsSystem.instance.minVolumeSize;
        const halfSizeX = size.x / 2; const halfSizeY = size.y / 2; const halfSizeZ = size.z / 2;
        const halfX = halfSizeX * ws.x < minVolumeSize ? minVolumeSize / ws.x : halfSizeX;
        const halfY = halfSizeY * ws.y < minVolumeSize ? minVolumeSize / ws.y : halfSizeY;
        const halfZ = halfSizeZ * ws.z < minVolumeSize ? minVolumeSize / ws.z : halfSizeZ;
        out.set(halfX, halfY, halfZ);
        return out;
    }

    getMinScale (out: Vec3) {
        const size = this.collider.size;
        const ws = absolute(VEC3_0.set(this._collider.node.worldScale));
        const minVolumeSize = PhysicsSystem.instance.minVolumeSize;
        const halfSizeX = size.x / 2; const halfSizeY = size.y / 2; const halfSizeZ = size.z / 2;
        const scaleX = halfSizeX * ws.x < minVolumeSize ? minVolumeSize / halfSizeX : ws.x;
        const scaleY = halfSizeY * ws.y < minVolumeSize ? minVolumeSize / halfSizeY : ws.y;
        const scaleZ = halfSizeZ * ws.z < minVolumeSize ? minVolumeSize / halfSizeZ : ws.z;
        out.set(scaleX, scaleY, scaleZ);
        return out;
    }
}
