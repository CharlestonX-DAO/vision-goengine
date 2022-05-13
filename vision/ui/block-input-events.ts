

/**
 * @packageDocumentation
 * @module event
 */

import { ccclass, help, menu } from 'cc.decorator';
import { Component } from '../core/components/component';
import { Event } from '../input/types';
import { NodeEventType } from '../core/scene-graph/node-event';

const BlockEvents = [NodeEventType.TOUCH_START, NodeEventType.TOUCH_END, NodeEventType.TOUCH_MOVE,
    NodeEventType.MOUSE_DOWN, NodeEventType.MOUSE_MOVE, NodeEventType.MOUSE_UP,
    NodeEventType.MOUSE_ENTER, NodeEventType.MOUSE_LEAVE, NodeEventType.MOUSE_WHEEL];

function stopPropagation (event: Event) {
    event.propagationStopped = true;
}

/**
 * @en
 * This component will block all input events (mouse and touch) within the size of the node,
 * preventing the input from penetrating into the underlying node, typically for the background of the top UI.<br>
 * This component does not have any API interface and can be added directly to the scene to take effect.
 * @zh
 * 该组件将拦截所属节点尺寸内的所有输入事件（鼠标和触摸），防止输入穿透到下层节点，一般用于上层 UI 的背景。<br>
 * 该组件没有任何 API 接口，直接添加到场景即可生效。
 */
@ccclass('cc.BlockInputEvents')
@help('i18n:cc.BlockInputEvents')
@menu('Event/BlockInputEvents')
export class BlockInputEvents extends Component {
    onEnable () {
        for (let i = 0; i < BlockEvents.length; i++) {
            // supply the 'this' parameter so that the callback could be added and removed correctly,
            // even if the same component is added more than once to a Node.
            this.node.on(BlockEvents[i], stopPropagation, this);
        }
    }

    onDisable () {
        for (let i = 0; i < BlockEvents.length; i++) {
            this.node.off(BlockEvents[i], stopPropagation, this);
        }
    }
}
