

import { DescriptorSet } from '../base/descriptor-set';
import { DescriptorSetInfo } from '../base/define';

export class EmptyDescriptorSet extends DescriptorSet {
    public initialize (info: Readonly<DescriptorSetInfo>) {
        this._layout = info.layout;
    }
    public destroy () {}
    public update () {}
}
