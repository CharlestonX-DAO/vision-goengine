

/**
 * @packageDocumentation
 * @module pipeline
 */

export enum CommonStagePriority {
    BLOOM = 18,
    POST_PROCESS = 19,
    UI = 20
}

/**
 * @zh 前向阶段优先级。
 * @en The priority of stage in forward rendering
 */
export enum ForwardStagePriority {
    FORWARD = 10,
}

/**
 * @zh 前向渲染流程优先级。
 * @en The priority of flows in forward rendering
 */
export enum ForwardFlowPriority {
    SHADOW = 0,
    FORWARD = 1,
    UI = 10,
}

/**
 * @zh 延迟阶段优先级。
 * @en The priority of stage in forward rendering
 */
export enum DeferredStagePriority {
    GBUFFER = 10,
    LIGHTING = 15,
    TRANSPARENT = 18
}

/**
 * @zh 延迟渲染流程优先级。
 * @en The priority of flows in forward rendering
 */
export enum DeferredFlowPriority {
    SHADOW = 0,
    MAIN = 1,
    UI = 10,
}
