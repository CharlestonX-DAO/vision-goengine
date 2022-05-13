

/**
 * @packageDocumentation
 * @module gfx
 */

import { GFXObject, ObjectType, ShaderInfo, ShaderStage, UniformBlock, UniformSampler, Attribute } from './define';

/**
 * @en GFX shader.
 * @zh GFX 着色器。
 */
export abstract class Shader extends GFXObject {
    get name (): string {
        return this._name;
    }

    get attributes () {
        return this._attributes;
    }

    get blocks () {
        return this._blocks;
    }

    get samplers () {
        return this._samplers;
    }

    protected _name = '';
    protected _stages: ShaderStage[] = [];
    protected _attributes: Attribute[] = [];
    protected _blocks: UniformBlock[] = [];
    protected _samplers: UniformSampler[] = [];

    constructor () {
        super(ObjectType.SHADER);
    }

    public abstract initialize (info: Readonly<ShaderInfo>): void;

    public abstract destroy (): void;
}
