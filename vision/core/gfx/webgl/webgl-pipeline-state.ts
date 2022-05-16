

import { PipelineState, PipelineStateInfo } from '../base/pipeline-state';
import { IWebGLGPUPipelineState } from './webgl-gpu-objects';
import { WebGLRenderPass } from './webgl-render-pass';
import { WebGLShader } from './webgl-shader';
import { DynamicStateFlagBit } from '../base/define';
import { WebGLPipelineLayout } from './webgl-pipeline-layout';

const WebGLPrimitives: GLenum[] = [
    0x0000, // WebGLRenderingContext.POINTS,
    0x0001, // WebGLRenderingContext.LINES,
    0x0003, // WebGLRenderingContext.LINE_STRIP,
    0x0002, // WebGLRenderingContext.LINE_LOOP,
    0x0000, // WebGLRenderingContext.NONE,
    0x0000, // WebGLRenderingContext.NONE,
    0x0000, // WebGLRenderingContext.NONE,
    0x0004, // WebGLRenderingContext.TRIANGLES,
    0x0005, // WebGLRenderingContext.TRIANGLE_STRIP,
    0x0006, // WebGLRenderingContext.TRIANGLE_FAN,
    0x0000, // WebGLRenderingContext.NONE,
    0x0000, // WebGLRenderingContext.NONE,
    0x0000, // WebGLRenderingContext.NONE,
    0x0000, // WebGLRenderingContext.NONE,
];

export class WebGLPipelineState extends PipelineState {
    get gpuPipelineState (): IWebGLGPUPipelineState {
        return  this._gpuPipelineState!;
    }

    private _gpuPipelineState: IWebGLGPUPipelineState | null = null;

    public initialize (info: Readonly<PipelineStateInfo>) {
        this._primitive = info.primitive;
        this._shader = info.shader;
        this._pipelineLayout = info.pipelineLayout;
        const bs = this._bs;
        if (info.blendState) {
            const bsInfo = info.blendState;
            const { targets } = bsInfo;
            if (targets) {
                targets.forEach((t, i) => {
                    bs.setTarget(i, t);
                });
            }

            if (bsInfo.isA2C !== undefined) { bs.isA2C = bsInfo.isA2C; }
            if (bsInfo.isIndepend !== undefined) { bs.isIndepend = bsInfo.isIndepend; }
            if (bsInfo.blendColor !== undefined) { bs.blendColor = bsInfo.blendColor; }
        }
        Object.assign(this._rs, info.rasterizerState);
        Object.assign(this._dss, info.depthStencilState);
        this._is = info.inputState;
        this._renderPass = info.renderPass;
        this._dynamicStates = info.dynamicStates;

        const dynamicStates: DynamicStateFlagBit[] = [];
        for (let i = 0; i < 31; i++) {
            if (this._dynamicStates & (1 << i)) {
                dynamicStates.push(1 << i);
            }
        }

        this._gpuPipelineState = {
            glPrimitive: WebGLPrimitives[info.primitive],
            gpuShader: (info.shader as WebGLShader).gpuShader,
            gpuPipelineLayout: (info.pipelineLayout as WebGLPipelineLayout).gpuPipelineLayout,
            rs: info.rasterizerState,
            dss: info.depthStencilState,
            bs: info.blendState,
            gpuRenderPass: (info.renderPass as WebGLRenderPass).gpuRenderPass,
            dynamicStates,
        };
    }

    public destroy () {
        this._gpuPipelineState = null;
    }
}
