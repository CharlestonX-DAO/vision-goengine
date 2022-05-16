

/**
 * @packageDocumentation
 * @module gfx
 */

import { CommandBuffer } from './command-buffer';
import { GFXObject, ObjectType, QueueType, QueueInfo } from './define';

/**
 * @en GFX Queue.
 * @zh GFX 队列。
 */
export abstract class Queue extends GFXObject {
    /**
     * @en Get current type.
     * @zh 队列类型。
     */
    get type (): number {
        return this._type;
    }

    protected _type: QueueType = QueueType.GRAPHICS;

    constructor () {
        super(ObjectType.QUEUE);
    }

    public abstract initialize (info: Readonly<QueueInfo>): void;

    public abstract destroy (): void;

    /**
     * @en Submit command buffers.
     * @zh 提交命令缓冲数组。
     * @param cmdBuffs The command buffers to be submitted.
     * @param fence The syncing fence.
     */
    public abstract submit (cmdBuffs: Readonly<CommandBuffer[]>): void;
}
