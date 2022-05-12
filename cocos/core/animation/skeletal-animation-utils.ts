



import { EDITOR } from 'internal:constants';
import { Mat4 } from '../math';
import { Node } from '../scene-graph/node';

const stack: IJointTransform[] = [];
const pool: Map<string, IJointTransform> = new Map();

export interface IJointTransform {
    node: Node;
    local: Mat4;
    world: Mat4;
    stamp: number;
    parent: IJointTransform | null;
}

export function getWorldMatrix (transform: IJointTransform | null, stamp: number) {
    let i = 0;
    let res = Mat4.IDENTITY;
    while (transform) {
        if (transform.stamp === stamp || transform.stamp + 1 === stamp && !transform.node.hasChangedFlags) {
            res = transform.world;
            transform.stamp = stamp;
            break;
        }
        transform.stamp = stamp;
        stack[i++] = transform;
        transform = transform.parent;
    }
    while (i > 0) {
        transform = stack[--i];
        stack[i] = null!;
        const node = transform.node;
        Mat4.fromRTS(transform.local, node.rotation, node.position, node.scale);
        res = Mat4.multiply(transform.world, res, transform.local);
    }
    return res;
}

export function getTransform (node: Node, root: Node) {
    let joint: IJointTransform | null = null;
    let i = 0;
    while (node !== root) {
        const id = node.uuid;
        if (pool.has(id)) {
            joint = pool.get(id)!;
            break;
        } else { // TODO: object reuse
            joint = { node, local: new Mat4(), world: new Mat4(), stamp: -1, parent: null };
            pool.set(id, joint);
        }
        stack[i++] = joint;
        node = node.parent!;
        joint = null;
    }
    let child: IJointTransform;
    while (i > 0) {
        child = stack[--i];
        stack[i] = null!;
        child.parent = joint;
        joint = child;
    }
    return joint;
}

export function deleteTransform (node: Node) {
    let transform = pool.get(node.uuid) || null;
    while (transform) {
        pool.delete(transform.node.uuid);
        transform = transform.parent;
    }
}
