

import { ShaderInfo } from '../base/define';
import { Shader } from '../base/shader';
import { WebGLCmdFuncCreateShader, WebGLCmdFuncDestroyShader } from './webgl-commands';
import { WebGLDeviceManager } from './webgl-define';
import { IWebGLGPUShader, IWebGLGPUShaderStage } from './webgl-gpu-objects';

export class WebGLShader extends Shader {
    get gpuShader (): IWebGLGPUShader {
        return  this._gpuShader!;
    }

    private _gpuShader: IWebGLGPUShader | null = null;

    public initialize (info: Readonly<ShaderInfo>) {
        this._name = info.name;
        this._stages = info.stages;
        this._attributes = info.attributes;
        this._blocks = info.blocks;
        this._samplers = info.samplers;

        this._gpuShader = {
            name: info.name,
            blocks: info.blocks.slice(),
            samplerTextures: info.samplerTextures.slice(),
            subpassInputs: info.subpassInputs.slice(),

            gpuStages: new Array<IWebGLGPUShaderStage>(info.stages.length),
            glProgram: null,
            glInputs: [],
            glUniforms: [],
            glBlocks: [],
            glSamplerTextures: [],
        };

        for (let i = 0; i < info.stages.length; ++i) {
            const stage = info.stages[i];
            this._gpuShader.gpuStages[i] = {
                type: stage.stage,
                source: stage.source,
                glShader: null,
            };
        }

        WebGLCmdFuncCreateShader(WebGLDeviceManager.instance, this._gpuShader);
    }

    public destroy () {
        if (this._gpuShader) {
            WebGLCmdFuncDestroyShader(WebGLDeviceManager.instance, this._gpuShader);
            this._gpuShader = null;
        }
    }
}
