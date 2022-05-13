

/**
 * @packageDocumentation
 * @module pipeline.forward
 */

import { ccclass } from 'cc.decorator';
import { Color, Rect, Framebuffer, DescriptorSet } from '../../gfx';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { ForwardStagePriority } from '../enum';
import { RenderShadowMapBatchedQueue } from '../render-shadow-map-batched-queue';
import { ForwardPipeline } from '../forward/forward-pipeline';
import { SetIndex } from '../define';
import { Light } from '../../renderer/scene/light';
import { ShadowFlow } from './shadow-flow';
import { Camera } from '../../renderer/scene';

const colors: Color[] = [new Color(1, 1, 1, 1)];

/**
 * @en Shadow map render stage
 * @zh 阴影渲染阶段。
 */
@ccclass('ShadowStage')
export class ShadowStage extends RenderStage {
    /**
     * @en A common initialization info for shadow map render stage
     * @zh 一个通用的 ShadowStage 的初始化信息对象
     */
    public static initInfo: IRenderStageInfo = {
        name: 'ShadowStage',
        priority: ForwardStagePriority.FORWARD,
        tag: 0,
    };

    /**
     * @en Sets the frame buffer for shadow map
     * @zh 设置阴影渲染的 FrameBuffer
     * @param light
     * @param shadowFrameBuffer
     */
    public setUsage (globalDS: DescriptorSet, light: Light, shadowFrameBuffer: Framebuffer) {
        this._globalDS = globalDS;
        this._light = light;
        this._shadowFrameBuffer = shadowFrameBuffer;
    }

    private _additiveShadowQueue!: RenderShadowMapBatchedQueue;
    private _shadowFrameBuffer: Framebuffer | null = null;
    private _renderArea = new Rect();
    private _light: Light | null = null;
    private _globalDS: DescriptorSet | null = null;

    public destroy () {
        this._shadowFrameBuffer = null;
        this._globalDS = null;
        this._light = null;

        this._additiveShadowQueue?.clear();
    }

    public clearFramebuffer (camera: Camera) {
        if (!this._light || !this._shadowFrameBuffer) { return; }
        colors[0].w = camera.clearColor.w;
        const pipeline = this._pipeline as ForwardPipeline;
        const cmdBuff = pipeline.commandBuffers[0];
        const renderPass = this._shadowFrameBuffer.renderPass;

        cmdBuff.beginRenderPass(renderPass, this._shadowFrameBuffer, this._renderArea,
            colors, camera.clearDepth, camera.clearStencil);
        cmdBuff.endRenderPass();
    }

    public render (camera: Camera) {
        const pipeline = this._pipeline;
        const pipelineSceneData = pipeline.pipelineSceneData;
        const shadowInfo = pipelineSceneData.shadows;
        const shadingScale = pipelineSceneData.shadingScale;
        const descriptorSet = this._globalDS!;
        const cmdBuff = pipeline.commandBuffers[0];

        if (!this._light || !this._shadowFrameBuffer) { return; }
        this._pipeline.pipelineUBO.updateShadowUBOLight(descriptorSet, this._light);
        this._additiveShadowQueue.gatherLightPasses(descriptorSet, camera, this._light, cmdBuff);

        const vp = camera.viewport;
        const shadowMapSize = shadowInfo.size;
        this._renderArea.x = vp.x * shadowMapSize.x;
        this._renderArea.y = vp.y * shadowMapSize.y;
        this._renderArea.width =  vp.width * shadowMapSize.x * shadingScale;
        this._renderArea.height = vp.height * shadowMapSize.y * shadingScale;

        const device = pipeline.device;
        const renderPass = this._shadowFrameBuffer.renderPass;

        cmdBuff.beginRenderPass(renderPass, this._shadowFrameBuffer, this._renderArea,
            colors, camera.clearDepth, camera.clearStencil);
        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, descriptorSet);

        this._additiveShadowQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        cmdBuff.endRenderPass();
    }

    public activate (pipeline: ForwardPipeline, flow: ShadowFlow) {
        super.activate(pipeline, flow);
        this._additiveShadowQueue = new RenderShadowMapBatchedQueue(pipeline);
    }
}
