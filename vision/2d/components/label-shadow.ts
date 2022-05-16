

/**
 * @packageDocumentation
 * @module ui
 */

import { ccclass, help, executionOrder, menu, tooltip, requireComponent, executeInEditMode, serializable } from 'cc.decorator';
import { Component } from '../../core/components/component';
import { Color, Vec2 } from '../../core/math';
import { Label } from './label';
import { legacyCC } from '../../core/global-exports';

/**
 * @en Shadow effect for Label component, only for system fonts or TTF fonts
 * @zh 用于给 Label 组件添加阴影效果，只能用于系统字体或 ttf 字体
 * @example
 * import { Node, Label, LabelShadow } from 'cc';
 * // Create a new node and add label components.
 * const node = new Node("New Label");
 * const label = node.addComponent(Label);
 * const shadow = node.addComponent(LabelShadow);
 * node.parent = this.node;
 */
@ccclass('cc.LabelShadow')
@help('i18n:cc.LabelShadow')
@executionOrder(110)
@menu('UI/LabelShadow')
@requireComponent(Label)
@executeInEditMode
export class LabelShadow extends Component {
    @serializable
    protected _color = new Color(0, 0, 0, 255);
    @serializable
    protected _offset = new Vec2(2, 2);
    @serializable
    protected _blur = 2;

    /**
     * @en
     * Shadow color.
     *
     * @zh
     * 阴影的颜色。
     *
     * @example
     * ```ts
     * import { Color } from 'cc';
     * labelShadow.color = new Color(0.5, 0.3, 0.7, 1.0);
     * ```
     */
    @tooltip('i18n:labelShadow.color')
    get color (): Readonly<Color> {
        return this._color;
    }

    set color (value) {
        if (this._color === value) {
            return;
        }

        this._color.set(value);
        this._updateRenderData();
    }

    /**
     * @en
     * Offset between font and shadow
     *
     * @zh
     * 字体与阴影的偏移。
     *
     * @example
     * ```ts
     * import { Vec2 } from 'cc';
     * labelShadow.offset = new Vec2(2, 2);
     * ```
     */
    @tooltip('i18n:labelShadow.offset')
    get offset () {
        return this._offset;
    }

    set offset (value) {
        this._offset = value;
        this._updateRenderData();
    }

    /**
     * @en
     * A non-negative float specifying the level of shadow blur
     *
     * @zh
     * 阴影的模糊程度
     *
     * @example
     * ```ts
     * labelShadow.blur = 2;
     * ```
     */
    @tooltip('i18n:labelShadow.blur')
    get blur () {
        return this._blur;
    }

    set blur (value) {
        this._blur = value;
        this._updateRenderData();
    }

    public onEnable () {
        this._updateRenderData();
    }

    public onDisable () {
        this._updateRenderData();
    }

    protected _updateRenderData () {
        const label = this.node.getComponent(Label);
        if (label) {
            label.updateRenderData(true);
        }
    }
}
