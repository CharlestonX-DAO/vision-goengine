

/**
 * @packageDocumentation
 * @module gfx
 */

import {
    BufferFlagBit,
    BufferFlags,
    BufferUsage,
    BufferUsageBit,
    MemoryUsage,
    MemoryUsageBit,
    GFXObject,
    ObjectType,
    BufferInfo,
    BufferViewInfo,
    BufferSource,
} from './define';

/**
 * @en GFX buffer.
 * @zh GFX 缓冲。
 */
export abstract class Buffer extends GFXObject {
    /**
     * @en Usage type of the buffer.
     * @zh 缓冲使用方式。
     */
    get usage (): BufferUsage {
        return this._usage;
    }

    /**
     * @en Memory usage of the buffer.
     * @zh 缓冲的内存使用方式。
     */
    get memUsage (): MemoryUsage {
        return this._memUsage;
    }

    /**
     * @en Size of the buffer.
     * @zh 缓冲大小。
     */
    get size (): number {
        return this._size;
    }

    /**
     * @en Stride of the buffer.
     * @zh 缓冲步长。
     */
    get stride (): number {
        return this._stride;
    }

    /**
     * @en Count of the buffer wrt. stride.
     * @zh 缓冲条目数量。
     */
    get count (): number {
        return this._count;
    }

    get flags (): BufferFlags {
        return this._flags;
    }

    protected _usage: BufferUsage = BufferUsageBit.NONE;
    protected _memUsage: MemoryUsage = MemoryUsageBit.NONE;
    protected _size = 0;
    protected _stride = 1;
    protected _count = 0;
    protected _flags: BufferFlags = BufferFlagBit.NONE;
    protected _isBufferView = false;

    constructor () {
        super(ObjectType.BUFFER);
    }

    public abstract initialize (info: Readonly<BufferInfo> | Readonly<BufferViewInfo>): void;

    public abstract destroy (): void;

    /**
     * @en Resize the buffer.
     * @zh 重置缓冲大小。
     * @param size The new buffer size.
     */
    public abstract resize (size: number): void;

    /**
     * @en Update the buffer data.
     * @zh 更新缓冲内容。
     * @param buffer The new buffer data.
     * @param size Size in bytes to be updated.
     */
    public abstract update (buffer: Readonly<BufferSource>, size?: number): void;
}
