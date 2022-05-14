

import { RenderPass } from '../gfx';
import { PipelineStateManager } from './pipeline-state-manager';
import { SetIndex } from './define';
import { Camera } from '../renderer/scene/camera';
import { RenderPipeline } from './render-pipeline';
import { getPhaseID } from './pass-phase';

export class UIPhase {
    private _phaseID = getPhaseID('default');
    private declare _pipeline: RenderPipeline;

    public activate (pipeline: RenderPipeline) {
        this._pipeline = pipeline;
    }

    public render (camera: Camera, renderPass: RenderPass) {
        const pipeline = this._pipeline;
        const device = pipeline.device;
        const cmdBuff = pipeline.commandBuffers[0];
        const scene = camera.scene!;
        const batches = scene.batches;
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            let visible = false;
            if (camera.visibility & batch.visFlags) {
                visible = true;
            }

            if (!visible) continue;
            // shaders.length always equals actual used passes.length
            const count = batch.shaders.length;
            for (let j = 0; j < count; j++) {
                const pass = batch.passes[j];
                if (pass.phase !== this._phaseID) continue;
                const shader = batch.shaders[j];
                const inputAssembler = batch.inputAssembler!;
                const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader, renderPass, inputAssembler);
                cmdBuff.bindPipelineState(pso);
                cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
                const ds = batch.descriptorSet!;
                cmdBuff.bindDescriptorSet(SetIndex.LOCAL, ds);
                cmdBuff.bindInputAssembler(inputAssembler);
                cmdBuff.draw(inputAssembler);
            }
        }
    }
}
