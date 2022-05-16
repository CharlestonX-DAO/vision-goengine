

/**
 * @packageDocumentation
 * @module gfx
 */

import { DescriptorSetLayout } from './descriptor-set-layout';
import { GFXObject, ObjectType, PipelineLayoutInfo } from './define';

/**
 * @en GFX pipeline layout.
 * @zh GFX 管线布局。
 */
export abstract class PipelineLayout extends GFXObject {
    get setLayouts () {
        return this._setLayouts;
    }

    protected _setLayouts: DescriptorSetLayout[] = [];

    constructor () {
        super(ObjectType.PIPELINE_LAYOUT);
    }

    public abstract initialize (info: Readonly<PipelineLayoutInfo>): void;

    public abstract destroy (): void;
}
