

import { PipelineLayout } from '../base/pipeline-layout';
import { PipelineLayoutInfo } from '../base/define';

export class EmptyPipelineLayout extends PipelineLayout {
    public initialize (info: Readonly<PipelineLayoutInfo>) {
        Array.prototype.push.apply(this._setLayouts, info.setLayouts);
    }
    public destroy () {}
}
