

/**
 * @packageDocumentation
 * @module scene-graph
 */

import { Renderable2D } from '../../2d/framework/renderable-2d';
import { UITransform } from '../../2d/framework/ui-transform';
import { warnID } from '../platform/debug';
import { UIMeshRenderer } from '../../2d';

/**
 * @en Node's UI properties abstraction
 * @zh 节点上 UI 相关的属性抽象类
 */
export class NodeUIProperties {
    /**
     * @en The UI transform component
     * @zh UI 变换组件
     */
    get uiTransformComp () {
        if (!this._uiTransformComp) {
            this._uiTransformComp = this._node.getComponent('cc.UITransform') as UITransform;
        }

        return this._uiTransformComp;
    }
    set uiTransformComp (value: UITransform | null) {
        this._uiTransformComp = value;
    }

    /**
     * @en The base UI component
     * @zh UI 基类组件
     */
    get uiComp () {
        return this._uiComp;
    }
    set uiComp (comp: UIMeshRenderer | Renderable2D | null) {
        if (this._uiComp && comp) {
            warnID(12002);
            return;
        }
        this._uiComp = comp;
    }

    private _uiComp: UIMeshRenderer | Renderable2D | null = null;

    /**
     * @en The opacity of the UI node for final rendering
     * @zh 最终显示的 UI 透明度，受父节点透明度影响
     */
    private _opacity = 1;
    public get opacity () { return this._opacity; }

    /**
     * @en The opacity of the UI node itself
     * @zh 本节点的 UI 透明度
     */
    private _localOpacity = 1;
    get localOpacity () { return this._localOpacity; }
    set localOpacity (val) {
        this._localOpacity = val;
        this.colorDirty = true;
    }

    public colorDirty = true;
    protected _uiTransformComp: UITransform | null = null;
    private _node: any;

    constructor (node: any) {
        this._node = node;
    }

    /**
     * @deprecated since v3.4
     */
    public applyOpacity (effectOpacity) {
        this._opacity = this._localOpacity * effectOpacity;
    }

    /**
     * @en Make the opacity state of node tree is dirty, not effect anymore
     * @zh 为结点树的透明度状态设置脏标签，不再有效果
     * @deprecated since v3.4
     */
    public static markOpacityTree (node, isDirty = true) {}
}
