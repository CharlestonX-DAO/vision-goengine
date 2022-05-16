



import { IVec3Like, IQuatLike } from '../../core/math/type-define';
import { Mesh } from '../../3d';
import { PrimitiveMode } from '../../core/gfx';
import { bt } from './instantiated';
import { BulletCache } from './bullet-cache';

export function cocos2BulletVec3 (out: Bullet.ptr, v: IVec3Like): Bullet.ptr {
    bt.Vec3_set(out, v.x, v.y, v.z);
    return out;
}

export function bullet2CocosVec3<T extends IVec3Like> (out: T, v: Bullet.ptr): T {
    out.x = bt.Vec3_x(v);
    out.y = bt.Vec3_y(v);
    out.z = bt.Vec3_z(v);
    return out;
}

export function cocos2BulletQuat (out: Bullet.ptr, q: IQuatLike): Bullet.ptr {
    bt.Quat_set(out, q.x, q.y, q.z, q.w);
    return out;
}

export function bullet2CocosQuat<T extends IQuatLike> (out: T, q: Bullet.ptr): T {
    out.x = bt.Quat_x(q);
    out.y = bt.Quat_y(q);
    out.z = bt.Quat_z(q);
    out.w = bt.Quat_w(q);
    return out;
}

export function cocos2BulletTriMesh (out: Bullet.ptr, mesh: Mesh): any {
    const len = mesh.renderingSubMeshes.length;
    for (let i = 0; i < len; i++) {
        const subMesh = mesh.renderingSubMeshes[i];
        const geoInfo = subMesh.geometricInfo;
        if (geoInfo) {
            const primitiveMode = subMesh.primitiveMode;
            const vb = geoInfo.positions;
            const ib = geoInfo.indices!;
            const v0 = BulletCache.instance.BT_V3_0;
            const v1 = BulletCache.instance.BT_V3_1;
            const v2 = BulletCache.instance.BT_V3_2;
            if (primitiveMode === PrimitiveMode.TRIANGLE_LIST) {
                const cnt = ib.length;
                for (let j = 0; j < cnt; j += 3) {
                    const i0 = ib[j] * 3;
                    const i1 = ib[j + 1] * 3;
                    const i2 = ib[j + 2] * 3;
                    bt.Vec3_set(v0, vb[i0], vb[i0 + 1], vb[i0 + 2]);
                    bt.Vec3_set(v1, vb[i1], vb[i1 + 1], vb[i1 + 2]);
                    bt.Vec3_set(v2, vb[i2], vb[i2 + 1], vb[i2 + 2]);
                    bt.TriangleMesh_addTriangle(out, v0, v1, v2);
                }
            } else if (primitiveMode === PrimitiveMode.TRIANGLE_STRIP) {
                const cnt = ib.length - 2;
                let rev = 0;
                for (let j = 0; j < cnt; j += 1) {
                    const i0 = ib[j - rev] * 3;
                    const i1 = ib[j + rev + 1] * 3;
                    const i2 = ib[j + 2] * 3;
                    rev = ~rev;
                    bt.Vec3_set(v0, vb[i0], vb[i0 + 1], vb[i0 + 2]);
                    bt.Vec3_set(v1, vb[i1], vb[i1 + 1], vb[i1 + 2]);
                    bt.Vec3_set(v2, vb[i2], vb[i2 + 1], vb[i2 + 2]);
                    bt.TriangleMesh_addTriangle(out, v0, v1, v2);
                }
            } else if (primitiveMode === PrimitiveMode.TRIANGLE_FAN) {
                const cnt = ib.length - 1;
                const i0 = ib[0] * 3;
                bt.Vec3_set(v0, vb[i0], vb[i0 + 1], vb[i0 + 2]);
                for (let j = 1; j < cnt; j += 1) {
                    const i1 = ib[j] * 3;
                    const i2 = ib[j + 1] * 3;
                    bt.Vec3_set(v1, vb[i1], vb[i1 + 1], vb[i1 + 2]);
                    bt.Vec3_set(v2, vb[i2], vb[i2 + 1], vb[i2 + 2]);
                    bt.TriangleMesh_addTriangle(out, v0, v1, v2);
                }
            }
        }
    }
    return out;
}
