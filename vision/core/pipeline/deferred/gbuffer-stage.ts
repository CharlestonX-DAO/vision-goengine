

/**
 * @category pipeline
 */

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { Camera } from '../../renderer/scene';
import { SetIndex } from '../define';
import { getPhaseID } from '../pass-phase';
import { renderQueueClearFunc, RenderQueue, convertRenderQueue, renderQueueSortFunc } from '../render-queue';
import { ClearFlagBit, Color, Rect } from '../../gfx';
import { SRGBToLinear } from '../pipeline-funcs';
import { RenderBatchedQueue } from '../render-batched-queue';
import { RenderInstancedQueue } from '../render-instanced-queue';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { DeferredStagePriority } from '../enum';
import { InstancedBuffer } from '../instanced-buffer';
import { BatchedBuffer } from '../batched-buffer';
import { BatchingSchemes } from '../../renderer/core/pass';
import { DeferredPipeline } from './deferred-pipeline';
import { RenderQueueDesc, RenderQueueSortMode } from '../pipeline-serialization';
import { MainFlow } from './main-flow';

const colors: Color[] = [new Color(0, 0, 0, 0), new Color(0, 0, 0, 0), new Color(0, 0, 0, 0)];

/**
 * @en The gbuffer render stage
 * @zh 前向渲染阶段。
 */
@ccclass('GbufferStage')
export class GbufferStage extends RenderStage {
    public static initInfo: IRenderStageInfo = {
        name: 'GbufferStage',
        priority: DeferredStagePriority.GBUFFER,
        tag: 0,
        renderQueues: [
            {
                isTransparent: false,
                sortMode: RenderQueueSortMode.FRONT_TO_BACK,
                stages: ['default'],
            },
            {
                isTransparent: true,
                sortMode: RenderQueueSortMode.BACK_TO_FRONT,
                stages: ['default'],
            },
        ],
    };

    @type([RenderQueueDesc])
    @serializable
    @displayOrder(2)
    protected renderQueues: RenderQueueDesc[] = [];
    protected _renderQueues: RenderQueue[] = [];

    private _renderArea = new Rect();
    private _batchedQueue: RenderBatchedQueue;
    private _instancedQueue: RenderInstancedQueue;
    private _phaseID = getPhaseID('default');

    constructor () {
        super();
        this._batchedQueue = new RenderBatchedQueue();
        this._instancedQueue = new RenderInstancedQueue();
    }

    public initialize (info: IRenderStageInfo): boolean {
        super.initialize(info);
        if (info.renderQueues) {
            this.renderQueues = info.renderQueues;
        }
        return true;
    }

    public activate (pipeline: DeferredPipeline, flow: MainFlow) {
        super.activate(pipeline, flow);
        for (let i = 0; i < this.renderQueues.length; i++) {
            this._renderQueues[i] = convertRenderQueue(this.renderQueues[i]);
        }
    }

    public destroy () {
    }

    public render (camera: Camera) {
        this._instancedQueue.clear();
        this._batchedQueue.clear();
        const pipeline = this._pipeline as DeferredPipeline;
        const device = pipeline.device;
        this._renderQueues.forEach(renderQueueClearFunc);

        pipeline.generateRenderArea(camera, this._renderArea);
        pipeline.updateQuadVertexData(this._renderArea, camera.window);

        const renderObjects = pipeline.pipelineSceneData.renderObjects;

        let m = 0; let p = 0; let k = 0;
        for (let i = 0; i < renderObjects.length; ++i) {
            const ro = renderObjects[i];
            const subModels = ro.model.subModels;
            for (m = 0; m < subModels.length; ++m) {
                const subModel = subModels[m];
                const passes = subModel.passes;
                for (p = 0; p < passes.length; ++p) {
                    const pass = passes[p];
                    if (pass.phase !== this._phaseID) continue;
                    const batchingScheme = pass.batchingScheme;
                    if (batchingScheme === BatchingSchemes.INSTANCING) {
                        const instancedBuffer = pass.getInstancedBuffer();
                        instancedBuffer.merge(subModel, ro.model.instancedAttributes, p);
                        this._instancedQueue.queue.add(instancedBuffer);
                    } else if (batchingScheme === BatchingSchemes.VB_MERGING) {
                        const batchedBuffer = pass.getBatchedBuffer();
                        batchedBuffer.merge(subModel, p, ro.model);
                        this._batchedQueue.queue.add(batchedBuffer);
                    } else {
                        for (k = 0; k < this._renderQueues.length; k++) {
                            this._renderQueues[k].insertRenderPass(ro, m, p);
                        }
                    }
                }
            }
        }
        this._renderQueues.forEach(renderQueueSortFunc);

        const cmdBuff = pipeline.commandBuffers[0];

        this._instancedQueue.uploadBuffers(cmdBuff);
        this._batchedQueue.uploadBuffers(cmdBuff);

        if (camera.clearFlag & ClearFlagBit.COLOR) {
            if (pipeline.pipelineSceneData.isHDR) {
                SRGBToLinear(colors[0], camera.clearColor);
            } else {
                colors[0].x = camera.clearColor.x;
                colors[0].y = camera.clearColor.y;
                colors[0].z = camera.clearColor.z;
            }
        }

        colors[0].w = camera.clearColor.w;

        const deferredData = pipeline.getPipelineRenderData();
        const framebuffer = deferredData.gbufferFrameBuffer;
        const renderPass = framebuffer.renderPass;
        cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea,
            colors, camera.clearDepth, camera.clearStencil);
        cmdBuff.setScissor(pipeline.generateScissor(camera));
        cmdBuff.setViewport(pipeline.generateViewport(camera));
        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, pipeline.descriptorSet);

        for (let i = 0; i < this.renderQueues.length; i++) {
            this._renderQueues[i].recordCommandBuffer(device, renderPass, cmdBuff);
        }
        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        this._batchedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        cmdBuff.endRenderPass();
    }
}
