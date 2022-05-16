

import { BufferSource, BufferInfo, BufferViewInfo } from '../base/define';
import { Buffer } from '../base/buffer';

export class EmptyBuffer extends Buffer {
    public initialize (info: Readonly<BufferInfo> | Readonly<BufferViewInfo>) {
        if ('buffer' in info) { // buffer view
            this._isBufferView = true;

            const buffer = info.buffer as EmptyBuffer;

            this._usage = buffer.usage;
            this._memUsage = buffer.memUsage;
            this._size = this._stride = info.range;
            this._count = 1;
            this._flags = buffer.flags;
        } else { // native buffer
            this._usage = info.usage;
            this._memUsage = info.memUsage;
            this._size = info.size;
            this._stride = Math.max(info.stride || this._size, 1);
            this._count = this._size / this._stride;
            this._flags = info.flags;
        }
    }
    public destroy () {}
    public resize (size: number) {}
    public update (buffer: Readonly<BufferSource>, size?: number) {}
}
