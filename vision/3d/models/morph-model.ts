

import { Model } from '../../core/renderer/scene/model';
import { MorphRenderingInstance } from '../assets/morph';
import { Material } from '../../core/assets/material';
import { RenderingSubMesh } from '../../core/assets/rendering-sub-mesh';
import { DescriptorSet } from '../../core/gfx';
import { IMacroPatch } from '../../core/renderer';

export class MorphModel extends Model {
    private _morphRenderingInstance: MorphRenderingInstance | null = null;
    private _usedMaterials = new Set<Material>();

    public getMacroPatches (subModelIndex: number) : IMacroPatch[] | null {
        const superMacroPatches = super.getMacroPatches(subModelIndex);
        if (this._morphRenderingInstance) {
            const morphInstanceMacroPatches = this._morphRenderingInstance.requiredPatches(subModelIndex);
            if (morphInstanceMacroPatches) {
                return morphInstanceMacroPatches.concat(superMacroPatches ?? []);
            }
        }
        return superMacroPatches;
    }

    public initSubModel (subModelIndex: number, subMeshData: RenderingSubMesh, material: Material) {
        return super.initSubModel(
            subModelIndex,
            subMeshData,
            this._launderMaterial(material),
        );
    }

    public destroy () {
        super.destroy();
        this._morphRenderingInstance = null;
    }

    public setSubModelMaterial (subModelIndex: number, material: Material) {
        return super.setSubModelMaterial(subModelIndex, this._launderMaterial(material));
    }

    protected _updateLocalDescriptors (submodelIdx: number, descriptorSet: DescriptorSet) {
        super._updateLocalDescriptors(submodelIdx, descriptorSet);

        if (this._morphRenderingInstance) {
            this._morphRenderingInstance.adaptPipelineState(submodelIdx, descriptorSet);
        }
    }

    private _launderMaterial (material: Material) {
        return material;
        // if (this._usedMaterials.has(material)) {
        //     return new MaterialInstance({
        //         parent: material,
        //     });
        // } else {
        //     this._usedMaterials.add(material);
        //     return material;
        // }
    }

    public setMorphRendering (morphRendering: MorphRenderingInstance) {
        this._morphRenderingInstance = morphRendering;
    }
}
