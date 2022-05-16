



export class NativeBufferPool {
    private _arrayBuffers: ArrayBuffer[] = [];
    private _chunkSize: number;
    constructor (dataType: number, entryBits: number, stride: number) {
        this._chunkSize = stride * (1 << entryBits);
    }
    public allocateNewChunk () { return new ArrayBuffer(this._chunkSize); }
}

export class NativeObjectPool<T> {
    constructor (dataType: number, array: T[]) {}
    public bind (index: number, obj: T) {}
}

export class NativeBufferAllocator {
    constructor (poolType: number) {}
    public alloc (index: number, bytes: number) { return new ArrayBuffer(bytes); }
    public free (index: number) {}
}
