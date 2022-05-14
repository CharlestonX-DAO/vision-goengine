

/**
 * @packageDocumentation
 * @module particle2d
 */

import { IAssembler, IAssemblerManager } from '../2d/renderer/base';
import { ParticleSystem2D } from './particle-system-2d';
import { MeshRenderData } from '../2d/renderer/render-data';
import { IBatcher } from '../2d/renderer/i-batcher';
import { legacyCC } from '../core/global-exports';

export const ParticleAssembler: IAssembler = {
    maxParticleDeltaTime: 0,
    createData (comp: ParticleSystem2D) {
        return MeshRenderData.add();
    },
    removeData (data) {
        MeshRenderData.remove(data);
    },
    updateRenderData () {
    },
    fillBuffers (comp: ParticleSystem2D, renderer: IBatcher) {
    },
};

export const ParticleSystem2DAssembler: IAssemblerManager = {
    getAssembler (comp: ParticleSystem2D) {
        if (!ParticleAssembler.maxParticleDeltaTime) {
            ParticleAssembler.maxParticleDeltaTime = legacyCC.game.frameTime / 1000 * 2;
        }
        return ParticleAssembler;
    },
};

ParticleSystem2D.Assembler = ParticleSystem2DAssembler;
