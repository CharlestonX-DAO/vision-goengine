

import { DescriptorSetLayoutInfo } from '../base/define';
import { DescriptorSetLayout } from '../base/descriptor-set-layout';

export class EmptyDescriptorSetLayout extends DescriptorSetLayout {
    public initialize (info: Readonly<DescriptorSetLayoutInfo>) {
        Array.prototype.push.apply(this._bindings, info.bindings);
    }
    public destroy () {}
}
