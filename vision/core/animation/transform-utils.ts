

/**
 * @packageDocumentation
 * @module animation
 */

import { Mat4 } from '../math';
import { Node } from '../scene-graph';

const m4_1 = new Mat4();

/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export function getPathFromRoot (target: Node | null, root: Node) {
    let node: Node | null = target;
    let path = '';
    while (node !== null && node !== root) {
        path = `${node.name}/${path}`;
        node = node.parent;
    }
    return path.slice(0, -1);
}

/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export function getWorldTransformUntilRoot (target: Node, root: Node, outMatrix: Mat4) {
    Mat4.identity(outMatrix);
    while (target !== root) {
        Mat4.fromRTS(m4_1, target.rotation, target.position, target.scale);
        Mat4.multiply(outMatrix, m4_1, outMatrix);
        target = target.parent!;
    }
    return outMatrix;
}
