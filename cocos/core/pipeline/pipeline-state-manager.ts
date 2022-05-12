



import { Shader, RenderPass, InputAssembler, Device, PipelineState, InputState, PipelineStateInfo } from '../gfx';
import { Pass } from '../renderer/core/pass';

export class PipelineStateManager {
    private static _PSOHashMap: Map<number, PipelineState> = new Map<number, PipelineState>();

    // pass is only needed on TS.
    static getOrCreatePipelineState (device: Device, pass: Pass, shader: Shader, renderPass: RenderPass, ia: InputAssembler) {
        const hash1 = pass.hash;
        const hash2 = renderPass.hash;
        const hash3 = ia.attributesHash;
        const hash4 = shader.typedID;

        const newHash = hash1 ^ hash2 ^ hash3 ^ hash4;
        let pso = this._PSOHashMap.get(newHash);
        if (!pso) {
            const pipelineLayout = pass.pipelineLayout;
            const inputState = new InputState(ia.attributes);
            const psoInfo = new PipelineStateInfo(
                shader, pipelineLayout, renderPass, inputState,
                pass.rasterizerState,
                pass.depthStencilState,
                pass.blendState,
                pass.primitive,
                pass.dynamicStates,
            );
            pso = device.createPipelineState(psoInfo);
            this._PSOHashMap.set(newHash, pso);
        }

        return pso;
    }
}
