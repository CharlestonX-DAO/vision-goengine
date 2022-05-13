

/**
 * @packageDocumentation
 * @module ui
 */
import { UICoordinateTracker } from './ui-coordinate-tracker';
import { BlockInputEvents } from './block-input-events';
import { Button } from './button';
import { EditBox } from './editbox/edit-box';
import { Layout } from './layout';
import { ProgressBar } from './progress-bar';
import { ScrollView } from './scroll-view';
import { ScrollBar } from './scroll-bar';
import { Slider } from './slider';
import { Toggle } from './toggle';
import { ToggleContainer } from './toggle-container';
import { Widget } from './widget';
import { PageView } from './page-view';
import { PageViewIndicator } from './page-view-indicator';
import { SafeArea } from './safe-area';
import { warnID } from '../core/platform/debug';
import { ccclass } from '../core/data/class-decorator';
import { js } from '../core/utils/js';
import { legacyCC } from '../core/global-exports';

/**
 * @deprecated Since v1.2
 */
@ccclass('cc.UIReorderComponent')
export class UIReorderComponent {
    constructor () {
        warnID(1408, 'UIReorderComponent');
    }
}
legacyCC.UIReorderComponent = UIReorderComponent;

/**
 * Alias of [[Button]]
 * @deprecated Since v1.2
 */
export { Button as ButtonComponent };
legacyCC.ButtonComponent = Button;
js.setClassAlias(Button, 'cc.ButtonComponent');
/**
 * Alias of [[EditBox]]
 * @deprecated Since v1.2
 */
export { EditBox as EditBoxComponent };
legacyCC.EditBoxComponent = EditBox;
js.setClassAlias(EditBox, 'cc.EditBoxComponent');
/**
 * Alias of [[Layout]]
 * @deprecated Since v1.2
 */
export { Layout as LayoutComponent };
legacyCC.LayoutComponent = Layout;
js.setClassAlias(Layout, 'cc.LayoutComponent');
/**
 * Alias of [[ProgressBar]]
 * @deprecated Since v1.2
 */
export { ProgressBar as ProgressBarComponent };
legacyCC.ProgressBarComponent = ProgressBar;
js.setClassAlias(ProgressBar, 'cc.ProgressBarComponent');
/**
 * Alias of [[ScrollView]]
 * @deprecated Since v1.2
 */
export { ScrollView as ScrollViewComponent };
legacyCC.ScrollViewComponent = ScrollView;
js.setClassAlias(ScrollView, 'cc.ScrollViewComponent');
/**
 * Alias of [[ScrollBar]]
 * @deprecated Since v1.2
 */
export { ScrollBar as ScrollBarComponent };
legacyCC.ScrollBarComponent = ScrollBar;
js.setClassAlias(ScrollBar, 'cc.ScrollBarComponent');
/**
 * Alias of [[Slider]]
 * @deprecated Since v1.2
 */
export { Slider as SliderComponent };
legacyCC.SliderComponent = Slider;
js.setClassAlias(Slider, 'cc.SliderComponent');
/**
 * Alias of [[Toggle]]
 * @deprecated Since v1.2
 */
export { Toggle as ToggleComponent };
legacyCC.ToggleComponent = Toggle;
js.setClassAlias(Toggle, 'cc.ToggleComponent');
/**
 * Alias of [[ToggleContainer]]
 * @deprecated Since v1.2
 */
export { ToggleContainer as ToggleContainerComponent };
legacyCC.ToggleContainerComponent = ToggleContainer;
js.setClassAlias(ToggleContainer, 'cc.ToggleContainerComponent');
/**
 * Alias of [[Widget]]
 * @deprecated Since v1.2
 */
export { Widget as WidgetComponent };
legacyCC.WidgetComponent = Widget;
js.setClassAlias(Widget, 'cc.WidgetComponent');
/**
 * Alias of [[PageView]]
 * @deprecated Since v1.2
 */
export { PageView as PageViewComponent };
legacyCC.PageViewComponent = PageView;
js.setClassAlias(PageView, 'cc.PageViewComponent');
/**
 * Alias of [[PageViewIndicator]]
 * @deprecated Since v1.2
 */
export { PageViewIndicator as PageViewIndicatorComponent };
legacyCC.PageViewIndicatorComponent = PageViewIndicator;
js.setClassAlias(PageViewIndicator, 'cc.PageViewIndicatorComponent');
/**
 * Alias of [[SafeArea]]
 * @deprecated Since v1.2
 */
export { SafeArea as SafeAreaComponent };
legacyCC.SafeAreaComponent = SafeArea;
js.setClassAlias(SafeArea, 'cc.SafeAreaComponent');
/**
 * Alias of [[UICoordinateTracker]]
 * @deprecated Since v1.2
 */
export { UICoordinateTracker as UICoordinateTrackerComponent };
js.setClassAlias(UICoordinateTracker, 'cc.UICoordinateTrackerComponent');
/**
 * Alias of [[BlockInputEvents]]
 * @deprecated Since v1.2
 */
export { BlockInputEvents as BlockInputEventsComponent };
legacyCC.BlockInputEventsComponent = BlockInputEvents;
js.setClassAlias(BlockInputEvents, 'cc.BlockInputEventsComponent');
