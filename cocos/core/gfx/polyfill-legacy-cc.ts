



import { Buffer } from './base/buffer';
import { CommandBuffer } from './base/command-buffer';
import { Device } from './base/device';
import { Swapchain } from './base/swapchain';
import { Framebuffer } from './base/framebuffer';
import { InputAssembler } from './base/input-assembler';
import { DescriptorSet } from './base/descriptor-set';
import { DescriptorSetLayout } from './base/descriptor-set-layout';
import { PipelineLayout } from './base/pipeline-layout';
import { PipelineState, PipelineStateInfo, RasterizerState, BlendState, BlendTarget, DepthStencilState } from './base/pipeline-state';
import { Queue } from './base/queue';
import { RenderPass } from './base/render-pass';
import { Sampler } from './base/states/sampler';
import { Shader } from './base/shader';
import { Texture } from './base/texture';
import { GeneralBarrier } from './base/states/general-barrier';
import { TextureBarrier } from './base/states/texture-barrier';
import { legacyCC } from '../global-exports';
import * as defines from './base/define';

const polyfills: Record<string, unknown> = {
    Device,
    Swapchain,
    Buffer,
    Texture,
    Sampler,
    Shader,
    InputAssembler,
    RenderPass,
    Framebuffer,
    DescriptorSet,
    DescriptorSetLayout,
    PipelineLayout,
    PipelineState,
    CommandBuffer,
    Queue,
    GeneralBarrier,
    TextureBarrier,

    RasterizerState,
    BlendState,
    BlendTarget,
    DepthStencilState,
    PipelineStateInfo,
};

Object.assign(polyfills, defines);
legacyCC.gfx = polyfills;
