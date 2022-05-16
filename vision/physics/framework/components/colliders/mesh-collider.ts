

/**
 * @packageDocumentation
 * @module physics
 */

import {
    ccclass,
    help,
    executeInEditMode,
    menu,
    type,
    editable,
    serializable,
    tooltip,
} from 'cc.decorator';
import { Collider } from './collider';
import { Mesh } from '../../../../3d/assets';
import { ITrimeshShape } from '../../../spec/i-physics-shape';
import { EColliderType } from '../../physics-enum';

/**
 * @en
 * Triangle mesh collider component.
 * @zh
 * 三角网格碰撞器。
 */
@ccclass('cc.MeshCollider')
@help('i18n:cc.MeshCollider')
@menu('Physics/MeshCollider')
@executeInEditMode
export class MeshCollider extends Collider {
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the mesh assets referenced by this collider.
     * @zh
     * 获取或设置此碰撞体引用的网格资源.
     */
    @type(Mesh)
    @tooltip('i18n:physics3d.collider.mesh_mesh')
    get mesh () {
        return this._mesh;
    }

    set mesh (value) {
        if (this._mesh === value) return;
        this._mesh = value;
        if (this._shape) this.shape.setMesh(this._mesh);
    }

    /**
     * @en
     * Gets or sets whether the collider replaces the mesh with a convex shape.
     * @zh
     * 获取或设置此碰撞体是否用凸形状代替网格.
     */
    @editable
    @tooltip('i18n:physics3d.collider.mesh_convex')
    get convex () {
        return this._convex;
    }

    set convex (value) {
        if (this._convex === value) return;
        this._convex = value;
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    get shape () {
        return this._shape as ITrimeshShape;
    }

    /// PRIVATE PROPERTY ///

    @serializable
    private _mesh: Mesh | null = null;

    @serializable
    private _convex = false;

    constructor () {
        super(EColliderType.MESH);
    }
}
