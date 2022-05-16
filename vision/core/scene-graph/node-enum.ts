

/**
 * @packageDocumentation
 * @module scene-graph
 */

import { legacyCC } from '../global-exports';

/**
 * @en Node's coordinate space
 * @zh 节点的坐标空间
 */
export enum NodeSpace {
    LOCAL,
    WORLD,
}

/**
 * @en Bit masks for node's transformation
 * @zh 节点的空间变换位标记
 */
export enum TransformBit {
    /**
     * @zh
     * 无改变
     */
    NONE = 0,
    /**
     * @zh
     * 节点位置改变
     */
    POSITION = (1 << 0),
    /**
     * @zh
     * 节点旋转
     */
    ROTATION = (1 << 1),
    /**
     * @zh
     * 节点缩放
     */
    SCALE = (1 << 2),
    /**
     * @zh
     * 节点旋转及缩放
     */
    RS = TransformBit.ROTATION | TransformBit.SCALE,
    /**
     * @zh
     * 节点平移，旋转及缩放
     */
    TRS = TransformBit.POSITION | TransformBit.ROTATION | TransformBit.SCALE,
    TRS_MASK = ~TransformBit.TRS,
}

legacyCC.internal.TransformBit = TransformBit;
