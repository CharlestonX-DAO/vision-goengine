

/**
 * @packageDocumentation
 * @module gfx
 */

import { Buffer } from './buffer';
import { DescriptorSetLayout } from './descriptor-set-layout';
import { Sampler } from './states/sampler';
import { Texture } from './texture';
import { GFXObject, ObjectType, DescriptorSetInfo, DESCRIPTOR_BUFFER_TYPE, DESCRIPTOR_SAMPLER_TYPE } from './define';

/**
 * @en GFX descriptor sets.
 * @zh GFX 描述符集组。
 */
export abstract class DescriptorSet extends GFXObject {
    get layout () {
        return this._layout!;
    }

    protected _layout: DescriptorSetLayout | null = null;
    protected _buffers: Buffer[] = [];
    protected _textures: Texture[] = [];
    protected _samplers: Sampler[] = [];

    protected _isDirty = false;

    constructor () {
        super(ObjectType.DESCRIPTOR_SET);
    }

    public abstract initialize (info: Readonly<DescriptorSetInfo>): void;

    public abstract destroy (): void;

    public abstract update (): void;

    /**
     * @en Bind buffer to the specified descriptor.
     * @zh 在指定的描述符位置上绑定缓冲。
     * @param binding The target binding.
     * @param buffer The buffer to be bound.
     */
    public bindBuffer (binding: number, buffer: Buffer, index = 0) {
        const bindingIndex = this._layout!.bindingIndices[binding];
        const info = this._layout!.bindings[bindingIndex]; if (!info) { return; }
        if (info.descriptorType & DESCRIPTOR_BUFFER_TYPE) {
            const descriptorIndex = this._layout!.descriptorIndices[binding];
            if (this._buffers[descriptorIndex + index] !== buffer) {
                this._buffers[descriptorIndex + index] = buffer;
                this._isDirty = true;
            }
        }
    }

    /**
     * @en Bind sampler to the specified descriptor.
     * @zh 在指定的描述符位置上绑定采样器。
     * @param binding The target binding.
     * @param sampler The sampler to be bound.
     */
    public bindSampler (binding: number, sampler: Sampler, index = 0) {
        const bindingIndex = this._layout!.bindingIndices[binding];
        const info = this._layout!.bindings[bindingIndex]; if (!info) { return; }
        if (info.descriptorType & DESCRIPTOR_SAMPLER_TYPE) {
            const descriptorIndex = this._layout!.descriptorIndices[binding];
            if (this._samplers[descriptorIndex + index] !== sampler) {
                this._samplers[descriptorIndex + index] = sampler;
                this._isDirty = true;
            }
        }
    }

    /**
     * @en Bind texture to the specified descriptor.
     * @zh 在指定的描述符位置上绑定纹理。
     * @param binding The target binding.
     * @param texture The texture to be bound.
     */
    public bindTexture (binding: number, texture: Texture, index = 0) {
        const bindingIndex = this._layout!.bindingIndices[binding];
        const info = this._layout!.bindings[bindingIndex]; if (!info) { return; }
        if (info.descriptorType & DESCRIPTOR_SAMPLER_TYPE) {
            const descriptorIndex = this._layout!.descriptorIndices[binding];
            if (this._textures[descriptorIndex + index] !== texture) {
                this._textures[descriptorIndex + index] = texture;
                this._isDirty = true;
            }
        }
    }

    /**
     * @en Get buffer from the specified binding location.
     * @zh 获取当前指定绑定位置上的缓冲。
     * @param binding The target binding.
     */
    public getBuffer (binding: number, index = 0) {
        const descriptorIndex = this._layout!.descriptorIndices[binding];
        return this._buffers[descriptorIndex + index];
    }

    /**
     * @en Get sampler from the specified binding location.
     * @zh 获取当前指定绑定位置上的采样器。
     * @param binding The target binding.
     */
    public getSampler (binding: number, index = 0) {
        const descriptorIndex = this._layout!.descriptorIndices[binding];
        return this._samplers[descriptorIndex + index];
    }

    /**
     * @en Get texture from the specified binding location.
     * @zh 获取当前指定绑定位置上的贴图。
     * @param binding The target binding.
     */
    public getTexture (binding: number, index = 0) {
        const descriptorIndex = this._layout!.descriptorIndices[binding];
        return this._textures[descriptorIndex + index];
    }
}
