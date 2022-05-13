

/**
 * @packageDocumentation
 * @module gfx
 */

declare const gfx: any;

import { legacyCC } from '../global-exports';
import * as defines from './base/define';
import * as pso from './pipeline-state.jsb';

export * from './base/descriptor-set';
export * from './base/buffer';
export * from './base/command-buffer';
export * from './base/define';
export * from './base/device';
export * from './base/swapchain';
export * from './base/framebuffer';
export * from './base/input-assembler';
export * from './base/descriptor-set-layout';
export * from './base/pipeline-layout';
export * from './base/queue';
export * from './base/render-pass';
export * from './base/shader';
export * from './base/texture';
export * from './base/states/sampler';
export * from './base/states/general-barrier';
export * from './base/states/texture-barrier';

const polyfillCC: Record<string, unknown> = Object.assign({}, defines);
polyfillCC.Device = gfx.Device;
polyfillCC.Swapchain = gfx.Swapchain;
polyfillCC.Buffer = gfx.Buffer;
polyfillCC.Texture = gfx.Texture;
polyfillCC.Sampler = gfx.Sampler;
polyfillCC.Shader = gfx.Shader;
polyfillCC.InputAssembler = gfx.InputAssembler;
polyfillCC.RenderPass = gfx.RenderPass;
polyfillCC.Framebuffer = gfx.Framebuffer;
polyfillCC.DescriptorSet = gfx.DescriptorSet;
polyfillCC.DescriptorSetLayout = gfx.DescriptorSetLayout;
polyfillCC.PipelineLayout = gfx.PipelineLayout;
polyfillCC.PipelineState = gfx.PipelineState;
polyfillCC.CommandBuffer = gfx.CommandBuffer;
polyfillCC.Queue = gfx.Queue;
legacyCC.gfx = polyfillCC;

// TODO: remove these after state info refactor
export const BlendTarget = pso.BlendTarget;
export const BlendState = pso.BlendState;
export const RasterizerState = pso.RasterizerState;
export const DepthStencilState = pso.DepthStencilState;
export const PipelineState = pso.PipelineState;
export const PipelineStateInfo = pso.PipelineStateInfo;

polyfillCC.BlendTarget = pso.BlendTarget;
polyfillCC.BlendState = pso.BlendState;
polyfillCC.RasterizerState = pso.RasterizerState;
polyfillCC.DepthStencilState = pso.DepthStencilState;
polyfillCC.PipelineStateInfo = pso.PipelineStateInfo;

import './deprecated-3.0.0';
