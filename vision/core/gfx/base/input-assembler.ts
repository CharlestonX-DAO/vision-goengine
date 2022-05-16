

/**
 * @packageDocumentation
 * @module gfx
 */

import { Buffer } from './buffer';
import { murmurhash2_32_gc } from '../../utils/murmurhash2_gc';
import { Attribute, GFXObject, ObjectType, InputAssemblerInfo, DrawInfo } from './define';

/**
 * @en GFX input assembler.
 * @zh GFX 输入汇集器。
 */
export abstract class InputAssembler extends GFXObject {
    /**
     * @en Get current attributes.
     * @zh 顶点属性数组。
     */
    get attributes (): Attribute[] {
        return this._attributes;
    }

    /**
     * @en Get current vertex buffers.
     * @zh 顶点缓冲数组。
     */
    get vertexBuffers (): Buffer[] {
        return this._vertexBuffers;
    }

    /**
     * @en Get current index buffer.
     * @zh 索引缓冲。
     */
    get indexBuffer (): Buffer | null {
        return this._indexBuffer;
    }

    /**
     * @en Get the indirect buffer, if present.
     * @zh 间接绘制缓冲。
     */
    get indirectBuffer (): Buffer | null {
        return this._indirectBuffer;
    }

    /**
     * @en Get hash of current attributes.
     * @zh 获取顶点属性数组的哈希值。
     */
    get attributesHash (): number {
        return this._attributesHash;
    }

    /**
     * @en Get current vertex count.
     * @zh 顶点数量。
     */
    set vertexCount (count: number) {
        this._drawInfo.vertexCount = count;
    }
    get vertexCount () {
        return this._drawInfo.vertexCount;
    }

    /**
     * @en Get starting vertex.
     * @zh 起始顶点。
     */
    set firstVertex (first: number) {
        this._drawInfo.firstVertex = first;
    }
    get firstVertex () {
        return this._drawInfo.firstVertex;
    }

    /**
     * @en Get current index count.
     * @zh 索引数量。
     */
    set indexCount (count: number) {
        this._drawInfo.indexCount = count;
    }
    get indexCount () {
        return this._drawInfo.indexCount;
    }

    /**
     * @en Get starting index.
     * @zh 起始索引。
     */
    set firstIndex (first: number) {
        this._drawInfo.firstIndex = first;
    }
    get firstIndex () {
        return this._drawInfo.firstIndex;
    }

    /**
     * @en Get current vertex offset.
     * @zh 顶点偏移量。
     */
    set vertexOffset (offset: number) {
        this._drawInfo.vertexOffset = offset;
    }
    get vertexOffset () {
        return this._drawInfo.vertexOffset;
    }

    /**
     * @en Get current instance count.
     * @zh 实例数量。
     */
    set instanceCount (count: number) {
        this._drawInfo.instanceCount = count;
    }
    get instanceCount () {
        return this._drawInfo.instanceCount;
    }

    /**
     * @en Get starting instance.
     * @zh 起始实例。
     */
    set firstInstance (first: number) {
        this._drawInfo.firstInstance = first;
    }
    get firstInstance () {
        return this._drawInfo.firstInstance;
    }

    get drawInfo (): Readonly<DrawInfo> {
        return this._drawInfo;
    }

    protected _attributes: Attribute[] = [];
    protected _attributesHash = 0;

    protected _vertexBuffers: Buffer[] = [];
    protected _indexBuffer: Buffer | null = null;
    protected _indirectBuffer: Buffer | null = null;

    protected _drawInfo = new DrawInfo();

    constructor () {
        super(ObjectType.INPUT_ASSEMBLER);
    }

    /**
     * @en Get the specified vertex buffer.
     * @zh 获取顶点缓冲。
     * @param stream The stream index of the vertex buffer.
     */
    public getVertexBuffer (stream = 0): Buffer | null {
        if (stream < this._vertexBuffers.length) {
            return this._vertexBuffers[stream];
        } else {
            return null;
        }
    }

    protected computeAttributesHash (): number {
        let res = 'attrs';
        for (let i = 0; i < this.attributes.length; ++i) {
            const at = this.attributes[i];
            res += `,${at.name},${at.format},${at.isNormalized},${at.stream},${at.isInstanced}`;
        }
        return murmurhash2_32_gc(res, 666);
    }

    public abstract initialize (info: Readonly<InputAssemblerInfo>): void;
    public abstract destroy (): void;
}
