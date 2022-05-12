

import { BulletShape } from './bullet-shape';
import { PhysicsSystem, SphereCollider } from '../../../../exports/physics-framework';
import { cocos2BulletVec3 } from '../bullet-utils';
import { ISphereShape } from '../../spec/i-physics-shape';
import { BulletCache, CC_V3_0 } from '../bullet-cache';
import { bt } from '../instantiated';
import { absMaxComponent } from '../../../core';

export class BulletSphereShape extends BulletShape implements ISphereShape {
    updateRadius () {
        bt.SphereShape_setUnscaledRadius(this.impl, this.getMinUnscaledRadius());
        this.updateCompoundTransform();
    }

    get collider () {
        return this._collider as SphereCollider;
    }

    onComponentSet () {
        this._impl = bt.SphereShape_new(this.getMinUnscaledRadius());
        this.updateScale();
    }

    updateScale () {
        super.updateScale();
        const scale = this.getMinScale();
        CC_V3_0.set(scale, scale, scale);
        const bt_v3 = BulletCache.instance.BT_V3_0;
        bt.CollisionShape_setLocalScaling(this._impl, cocos2BulletVec3(bt_v3, CC_V3_0));
        this.updateCompoundTransform();
    }

    getMinUnscaledRadius () {
        const radius = this.collider.radius;
        const ws = Math.abs(absMaxComponent(this._collider.node.worldScale));
        const minVolumeSize = PhysicsSystem.instance.minVolumeSize;
        return ws * radius < minVolumeSize ? minVolumeSize / ws : radius;
    }

    getMinScale () {
        const radius = this.collider.radius;
        const ws = Math.abs(absMaxComponent(this._collider.node.worldScale));
        const minVolumeSize = PhysicsSystem.instance.minVolumeSize;
        return ws * radius < minVolumeSize ? minVolumeSize / radius : ws;
    }
}
