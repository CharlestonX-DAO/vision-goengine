

/**
 * @packageDocumentation
 * @module ui
 */

import { ccclass, disallowMultiple, executeInEditMode,
    executionOrder, menu, requireComponent } from 'cc.decorator';
import { Component } from '../../core/components/component';
import { legacyCC } from '../../core/global-exports';
import { UITransform } from './ui-transform';

@ccclass('cc.RenderRoot2D')
@executionOrder(100)
@menu('2D/RenderRoot2D')
@requireComponent(UITransform)
@disallowMultiple
@executeInEditMode
export class RenderRoot2D extends Component {
    public onEnable () {
        legacyCC.director.root!.batcher2D.addScreen(this);
    }

    public onDisable () {
        legacyCC.director.root!.batcher2D.removeScreen(this);
    }

    public onDestroy () {
        legacyCC.director.root!.batcher2D.removeScreen(this);
    }
}
