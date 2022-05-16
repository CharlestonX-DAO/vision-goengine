

/**
 * @packageDocumentation
 * @module gfx
 */

import { GFXObject, ObjectType, DescriptorSetLayoutBinding, DescriptorSetLayoutInfo } from './define';

/**
 * @en GFX descriptor sets layout.
 * @zh GFX 描述符集布局。
 */
export abstract class DescriptorSetLayout extends GFXObject {
    get bindings () {
        return this._bindings;
    }

    get bindingIndices () {
        return this._bindingIndices;
    }

    get descriptorIndices () {
        return this._descriptorIndices;
    }

    protected _bindings: DescriptorSetLayoutBinding[] = [];
    protected _bindingIndices: number[] = [];
    protected _descriptorIndices: number[] = [];

    constructor () {
        super(ObjectType.DESCRIPTOR_SET_LAYOUT);
    }

    public abstract initialize (info: Readonly<DescriptorSetLayoutInfo>): void;

    public abstract destroy (): void;
}
