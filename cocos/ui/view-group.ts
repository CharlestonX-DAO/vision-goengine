

/**
 * @packageDocumentation
 * @module ui
 */

/**
 * @en
 * Handling touch events in a ViewGroup takes special care,
 * because it's common for a ViewGroup to have children that are targets for different touch events than the ViewGroup itself.
 * To make sure that each view correctly receives the touch events intended for it,
 * ViewGroup should register capture phase event and handle the event propagation properly.
 * Please refer to ScrollView for more information.
 *
 * @zh
 * ViewGroup 的事件处理比较特殊，因为 ViewGroup 里面的子节点关心的事件跟 ViewGroup 本身可能不一样。
 * 为了让子节点能够正确地处理事件，ViewGroup 需要注册 capture 阶段的事件，并且合理地处理 ViewGroup 之间的事件传递。
 * 请参考 ScrollView 的实现来获取更多信息。
 */

import { ccclass, executionOrder } from 'cc.decorator';
import { Component } from '../core/components';
import { legacyCC } from '../core/global-exports';

@ccclass('cc.ViewGroup')
@executionOrder(110)
export class ViewGroup extends Component {

}

legacyCC.ViewGroup = ViewGroup;
