

import { BufferSource, BufferInfo, BufferViewInfo, BufferUsageBit } from '../base/define';
import { Buffer } from '../base/buffer';

import {
    WebGLCmdFuncCreateBuffer,
    WebGLCmdFuncDestroyBuffer,
    WebGLCmdFuncResizeBuffer,
    WebGLCmdFuncUpdateBuffer,
} from './webgl-commands';
import { IWebGLGPUBuffer, IWebGLGPUBufferView, WebGLIndirectDrawInfos } from './webgl-gpu-objects';
import { WebGLDeviceManager } from './webgl-define';

export class WebGLBuffer extends Buffer {
    get gpuBuffer (): IWebGLGPUBuffer {
        return  this._gpuBuffer!;
    }

    get gpuBufferView (): IWebGLGPUBufferView {
        return  this._gpuBufferView!;
    }

    private _gpuBuffer: IWebGLGPUBuffer | null = null;
    private _gpuBufferView: IWebGLGPUBufferView | null = null;
    private _uniformBuffer: Uint8Array | null = null;

    public initialize (info: Readonly<BufferInfo> | Readonly<BufferViewInfo>) {
        if ('buffer' in info) { // buffer view
            this._isBufferView = true;

            const buffer = info.buffer as WebGLBuffer;

            this._usage = buffer.usage;
            this._memUsage = buffer.memUsage;
            this._size = this._stride = info.range;
            this._count = 1;
            this._flags = buffer.flags;

            this._gpuBufferView = {
                gpuBuffer: buffer.gpuBuffer,
                offset: info.offset,
                range: info.range,
            };
        } else { // native buffer
            this._usage = info.usage;
            this._memUsage = info.memUsage;
            this._size = info.size;
            this._stride = Math.max(info.stride || this._size, 1);
            this._count = this._size / this._stride;
            this._flags = info.flags;

            if ((this._usage & BufferUsageBit.UNIFORM) && this._size > 0) {
                this._uniformBuffer = new Uint8Array(this._size);
            }

            this._gpuBuffer = {
                usage: this._usage,
                memUsage: this._memUsage,
                size: this._size,
                stride: this._stride,
                buffer: null,
                vf32: null,
                indirects: new WebGLIndirectDrawInfos(),
                glTarget: 0,
                glBuffer: null,
            };

            if (this._usage & BufferUsageBit.UNIFORM) {
                this._gpuBuffer.buffer = this._uniformBuffer;
            }

            WebGLCmdFuncCreateBuffer(WebGLDeviceManager.instance, this._gpuBuffer);

            WebGLDeviceManager.instance.memoryStatus.bufferSize += this._size;
        }
    }

    public destroy () {
        if (this._gpuBuffer) {
            WebGLCmdFuncDestroyBuffer(WebGLDeviceManager.instance, this._gpuBuffer);
            WebGLDeviceManager.instance.memoryStatus.bufferSize -= this._size;
            this._gpuBuffer = null;
        }

        if (this._gpuBufferView) {
            this._gpuBufferView = null;
        }
    }

    public resize (size: number) {
        if (this._isBufferView) {
            console.warn('cannot resize buffer views!');
            return;
        }

        const oldSize = this._size;
        if (oldSize === size) { return; }

        this._size = size;
        this._count = this._size / this._stride;

        if (this._uniformBuffer) {
            this._uniformBuffer = new Uint8Array(size);
        }

        if (this._gpuBuffer) {
            if (this._uniformBuffer) {
                this._gpuBuffer.buffer = this._uniformBuffer;
            }

            this._gpuBuffer.size = size;
            if (size > 0) {
                WebGLCmdFuncResizeBuffer(WebGLDeviceManager.instance, this._gpuBuffer);
                WebGLDeviceManager.instance.memoryStatus.bufferSize -= oldSize;
                WebGLDeviceManager.instance.memoryStatus.bufferSize += size;
            }
        }
    }

    public update (buffer: Readonly<BufferSource>, size?: number) {
        if (this._isBufferView) {
            console.warn('cannot update through buffer views!');
            return;
        }

        let buffSize: number;
        if (size !== undefined) {
            buffSize = size;
        } else if (this._usage & BufferUsageBit.INDIRECT) {
            buffSize = 0;
        } else {
            buffSize = (buffer as ArrayBuffer).byteLength;
        }

        WebGLCmdFuncUpdateBuffer(
            WebGLDeviceManager.instance,
            this._gpuBuffer!,
            buffer as BufferSource,
            0,
            buffSize,
        );
    }
}
