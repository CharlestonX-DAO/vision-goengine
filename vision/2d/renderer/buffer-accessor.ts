

/**
 * @packageDocumentation
 * @module ui
 */

import { Attribute, Device } from '../../core/gfx';
import type { MeshBuffer } from './mesh-buffer';
import { getComponentPerVertex } from './vertex-format';

export class BufferAccessor {
    public get attributes (): Readonly<Attribute[]> { return this._attributes; }
    public get vertexFormatBytes () { return this._vertexFormatBytes; }
    public get floatsPerVertex () { return this._floatsPerVertex; }

    protected _device: Device = null!
    protected _attributes: Attribute[] = null!;
    protected _vertexFormatBytes: number;
    protected _floatsPerVertex: number;
    protected _buffers: MeshBuffer[] = [];

    constructor (device: Device, attributes: Attribute[]) {
        this._device = device;
        this._attributes = attributes;
        this._floatsPerVertex = getComponentPerVertex(attributes);
        this._vertexFormatBytes = this._floatsPerVertex * Float32Array.BYTES_PER_ELEMENT;
    }

    public initialize () {}
    public reset () {}
    public request (vertexCount = 4, indexCount = 6) {}
    public appendBuffers (vertices: Float32Array, indices: Uint16Array) {}
    public uploadBuffers () {}
    public destroy () {
        this._attributes.length = 0;
    }
}
