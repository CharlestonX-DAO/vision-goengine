

/**
 * @packageDocumentation
 * @module ui
 */

import { ccclass, disallowMultiple, executeInEditMode, executionOrder, requireComponent } from 'cc.decorator';
import { IBatcher } from '../renderer/i-batcher';
import { Component } from '../../core/components/component';
import { UITransform } from './ui-transform';
import { Node } from '../../core/scene-graph';
import { Stage } from '../renderer/stencil-manager';

/**
 * @en Legacy 2D base class for rendering component, please use [[Renderable2D]] instead.
 * This component will setup NodeUIProperties.uiComp in its owner [[Node]]
 * @zh 旧的 2D 渲染组件基类，请使用 [[Renderable2D]] 替代。
 * 这个组件会设置 [[Node]] 上的 NodeUIProperties.uiComp。
 * @deprecated since v3.4.1
 */
@ccclass('cc.UIComponent')
@requireComponent(UITransform)
@executionOrder(110)
@disallowMultiple
@executeInEditMode
export class UIComponent extends Component {
    protected _lastParent: Node | null = null;

    public __preload () {
        // @ts-expect-error temporary, UIComponent should be removed
        this.node._uiProps.uiComp = this;
    }

    public onEnable () {
    }

    public onDisable () {

    }

    public onDestroy () {
        // @ts-expect-error temporary, UIComponent should be removed
        if (this.node._uiProps.uiComp === this) {
            // @ts-expect-error temporary, UIComponent should be removed
            this.node._uiProps.uiComp = null;
        }
    }

    /**
     * @en Render data submission procedure, it update and assemble the render data to 2D data buffers before all children submission process.
     * Usually called each frame when the ui flow assemble all render data to geometry buffers.
     * Don't call it unless you know what you are doing.
     * @zh 渲染数据组装程序，这个方法会在所有子节点数据组装之前更新并组装当前组件的渲染数据到 UI 的顶点数据缓冲区中。
     * 一般在 UI 渲染流程中调用，用于组装所有的渲染数据到顶点数据缓冲区。
     * 注意：不要手动调用该函数，除非你理解整个流程。
     */
    public updateAssembler (render: IBatcher) {
    }

    /**
     * @en Post render data submission procedure, it's executed after assembler updated for all children.
     * It may assemble some extra render data to the geometry buffers, or it may only change some render states.
     * Don't call it unless you know what you are doing.
     * @zh 后置渲染数据组装程序，它会在所有子节点的渲染数据组装完成后被调用。
     * 它可能会组装额外的渲染数据到顶点数据缓冲区，也可能只是重置一些渲染状态。
     * 注意：不要手动调用该函数，除非你理解整个流程。
     */
    public postUpdateAssembler (render: IBatcher) {
    }

    public markForUpdateRenderData (enable = true) {
    }

    public stencilStage : Stage = Stage.DISABLED;

    public setNodeDirty () {
    }

    public setTextureDirty () {
    }
}
