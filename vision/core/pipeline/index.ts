

/**
 * @packageDocumentation
 * @module pipeline
 */

import * as pipeline from './define';
import { ForwardPipeline } from './forward/forward-pipeline';

export { pipeline };

export * from './pass-phase';

export { RenderPipeline } from './render-pipeline';
export { RenderFlow } from './render-flow';
export { RenderStage } from './render-stage';

export { ForwardPipeline } from './forward/forward-pipeline';
export { ForwardFlow } from './forward/forward-flow';
export { ForwardStage } from './forward/forward-stage';
export { DeferredPipeline } from './deferred/deferred-pipeline';
export { MainFlow } from './deferred/main-flow';
export { GbufferStage } from './deferred/gbuffer-stage';
export { LightingStage } from './deferred/lighting-stage';
export { BloomStage } from './deferred/bloom-stage';
export { PostProcessStage } from './deferred/postprocess-stage';
export { ShadowFlow } from './shadow/shadow-flow';
export { ShadowStage } from './shadow/shadow-stage';

export { InstancedBuffer } from './instanced-buffer';
export { PipelineStateManager } from './pipeline-state-manager';

export { PipelineEventProcessor, PipelineEventType } from './pipeline-event';

export function createDefaultPipeline () {
    const rppl = new ForwardPipeline();
    rppl.initialize({ flows: [] });
    return rppl;
}
