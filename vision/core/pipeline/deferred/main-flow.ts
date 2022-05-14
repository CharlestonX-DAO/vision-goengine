

/**
 * @category pipeline.deferred
 */

import { ccclass } from 'cc.decorator';
import { Camera } from '../../renderer/scene';
import { PIPELINE_FLOW_MAIN } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { DeferredFlowPriority } from '../enum';
import { GbufferStage } from './gbuffer-stage';
import { LightingStage } from './lighting-stage';
import { PostProcessStage } from './postprocess-stage';
import { RenderPipeline } from '../render-pipeline';
import { BloomStage } from './bloom-stage';

/**
 * @en The main flow in deferred render pipeline
 * @zh 延迟渲染流程。
 */
@ccclass('MainFlow')
export class MainFlow extends RenderFlow {
    /**
     * @en The shared initialization information of main render flow
     * @zh 共享的延迟渲染流程初始化参数
     */
    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_MAIN,
        priority: DeferredFlowPriority.MAIN,
        stages: [],
    };

    public initialize (info: IRenderFlowInfo): boolean {
        super.initialize(info);
        if (this._stages.length === 0) {
            const gbufferStage = new GbufferStage();
            gbufferStage.initialize(GbufferStage.initInfo);
            this._stages.push(gbufferStage);
            const lightingStage = new LightingStage();
            lightingStage.initialize(LightingStage.initInfo);
            this._stages.push(lightingStage);
            const bloomStage = new BloomStage();
            bloomStage.initialize(BloomStage.initInfo);
            this._stages.push(bloomStage);
            const postProcessStage = new PostProcessStage();
            postProcessStage.initialize(PostProcessStage.initInfo);
            this._stages.push(postProcessStage);
        }
        return true;
    }

    public activate (pipeline: RenderPipeline) {
        super.activate(pipeline);
    }

    public render (camera: Camera) {
        super.render(camera);
    }

    public destroy () {
        super.destroy();
    }
}
