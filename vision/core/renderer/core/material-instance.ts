

/**
 * @packageDocumentation
 * @module material
 */

import { RenderableComponent } from '../../components/renderable-component';
import { Material } from '../../assets/material';
import { PassInstance } from './pass-instance';
import { MacroRecord } from './pass-utils';
import { PassOverrides } from './pass';

export interface IMaterialInstanceInfo {
    parent: Material;
    owner?: RenderableComponent;
    subModelIdx?: number;
}

/**
 * @zh
 * 材质实例，当有材质修改需求时，根据材质资源创建的，可任意定制的实例。
 */
export class MaterialInstance extends Material {
    get parent () {
        return this._parent;
    }

    get owner () {
        return this._owner;
    }

    protected _passes: PassInstance[] = [];

    private _parent: Material;
    private _owner: RenderableComponent | null;
    private _subModelIdx = 0;

    constructor (info: IMaterialInstanceInfo) {
        super();
        this._parent = info.parent;
        this._owner = info.owner || null;
        this._subModelIdx = info.subModelIdx || 0;
        this.copy(this._parent);
    }

    public recompileShaders (overrides: MacroRecord, passIdx?: number): void {
        if (!this._passes || !this.effectAsset) { return; }
        if (passIdx === undefined) {
            for (const pass of this._passes) {
                pass.tryCompile(overrides);
            }
        } else {
            this._passes[passIdx].tryCompile(overrides);
        }
    }

    public overridePipelineStates (overrides: PassOverrides, passIdx?: number): void {
        if (!this._passes || !this.effectAsset) { return; }
        const passInfos = this.effectAsset.techniques[this.technique].passes;
        if (passIdx === undefined) {
            for (let i = 0; i < this._passes.length; i++) {
                const pass = this._passes[i];
                const state = this._states[i] || (this._states[i] = {});
                for (const key in overrides) { state[key] = overrides[key]; }
                pass.overridePipelineStates(passInfos[pass.passIndex], state);
            }
        } else {
            const state = this._states[passIdx] || (this._states[passIdx] = {});
            for (const key in overrides) { state[key] = overrides[key]; }
            this._passes[passIdx].overridePipelineStates(passInfos[passIdx], state);
        }
    }

    public destroy () {
        this._doDestroy();
        return true;
    }

    public onPassStateChange (dontNotify: boolean) {
        this._hash = Material.getHash(this);
        if (!dontNotify && this._owner) {
            // @ts-expect-error calling protected method here
            this._owner._onRebuildPSO(this._subModelIdx, this);
        }
    }

    protected _createPasses () {
        const passes: PassInstance[] = [];
        const parentPasses = this._parent.passes;
        if (!parentPasses) { return passes; }
        for (let k = 0; k < parentPasses.length; ++k) {
            passes.push(new PassInstance(parentPasses[k], this));
        }
        return passes;
    }
}
