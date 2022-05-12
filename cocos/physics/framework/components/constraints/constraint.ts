/* eslint-disable @typescript-eslint/no-namespace */


/**
 * @packageDocumentation
 * @module physics
 */

import { ccclass, requireComponent, displayOrder, type, readOnly, serializable } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { Component } from '../../../../core';
import { RigidBody } from '../rigid-body';
import { Eventify } from '../../../../core/event';
import { IBaseConstraint } from '../../../spec/i-physics-constraint';
import { selector, createConstraint } from '../../physics-selector';
import { EConstraintType } from '../../physics-enum';

/**
 * @en
 * Base class for joint constraints, which depends on rigid body components.
 * @zh
 * 关节约束的基类，它依赖于刚体组件。
 */
@ccclass('cc.Constraint')
@requireComponent(RigidBody)
export class Constraint extends Eventify(Component) {
    /**
     * @en
     * Enumeration of joint types.
     * @zh
     * 关节类型的枚举。
     */
    static readonly Type = EConstraintType;

    /**
     * @en
     * Gets the collider attached rigid-body.
     * @zh
     * 获取碰撞器所绑定的刚体组件。
     */
    @type(RigidBody)
    @readOnly
    @displayOrder(-2)
    get attachedBody (): RigidBody | null {
        return this.getComponent(RigidBody);
    }

    /**
     * @en
     * Get or set the jointed rigid body, null means link to a static rigid body at the world origin.
     * @zh
     * 获取或设置关节连接的刚体，为空时表示链接到位于世界原点的静态刚体。
     */
    @type(RigidBody)
    @displayOrder(-1)
    get connectedBody (): RigidBody | null {
        return this._connectedBody;
    }

    set connectedBody (v: RigidBody | null) {
        this._connectedBody = v;
        if (!EDITOR) {
            if (this._constraint) this._constraint.setConnectedBody(v);
        }
    }

    /**
     * @en
     * Get or set whether collision is turned on between two rigid bodies connected by a joint.
     * @zh
     * 获取或设置关节连接的两刚体之间是否开启碰撞。
     */
    @displayOrder(0)
    get enableCollision () {
        return this._enableCollision;
    }

    set enableCollision (v) {
        this._enableCollision = v;
        if (!EDITOR) {
            if (this._constraint) this._constraint.setEnableCollision(v);
        }
    }

    /**
     * @en
     * Gets the type of this joint.
     * @zh
     * 获取此关节的类型。
     */
    readonly TYPE: EConstraintType;

    /// PROTECTED PROPERTY ///

    @serializable
    protected _enableCollision = true;

    @type(RigidBody)
    protected _connectedBody: RigidBody | null = null;

    protected _constraint: IBaseConstraint | null = null;

    constructor (type: EConstraintType) {
        super();
        this.TYPE = type;
    }

    /// COMPONENT LIFECYCLE ///

    protected onLoad () {
        if (!selector.runInEditor) return;
        this._constraint = createConstraint(this.TYPE);
        this._constraint.initialize(this);
    }

    protected onEnable () {
        if (this._constraint) {
            this._constraint.onEnable!();
        }
    }

    protected onDisable () {
        if (this._constraint) {
            this._constraint.onDisable!();
        }
    }

    protected onDestroy () {
        if (this._constraint) {
            this._constraint.onDestroy!();
        }
    }
}

export namespace Constraint {
    export type Type = EnumAlias<typeof EConstraintType>;
}
