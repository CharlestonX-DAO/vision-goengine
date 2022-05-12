



import { Color, Mat4, Vec3 } from '../../core/math';
import { RenderData } from '../renderer/render-data';
import { IBatcher } from '../renderer/i-batcher';
import { Node } from '../../core/scene-graph/node';
import { FormatInfos } from '../../core/gfx';
import { clamp } from '../../core';

const vec3_temp = new Vec3();
const _worldMatrix = new Mat4();

export function fillMeshVertices3D (node: Node, renderer: IBatcher, renderData: RenderData, color: Color) {
    const chunk = renderData.chunk;
    const dataList = renderData.data;
    const vData = chunk.vb;
    const vertexCount = renderData.vertexCount;

    node.getWorldMatrix(_worldMatrix);

    let vertexOffset = 0;
    for (let i = 0; i < vertexCount; i++) {
        const vert = dataList[i];
        Vec3.set(vec3_temp, vert.x, vert.y, 0);
        Vec3.transformMat4(vec3_temp, vec3_temp, _worldMatrix);
        vData[vertexOffset++] = vec3_temp.x;
        vData[vertexOffset++] = vec3_temp.y;
        vData[vertexOffset++] = vec3_temp.z;
        Color.toArray(vData, color, vertexOffset + 2);
        vertexOffset += 6;
    }

    // fill index data
    const bid = chunk.bufferId;
    const vid = chunk.vertexOffset;
    const meshBuffer = chunk.vertexAccessor.getMeshBuffer(chunk.bufferId);
    const ib = chunk.vertexAccessor.getIndexBuffer(bid);
    let indexOffset = meshBuffer.indexOffset;
    for (let i = 0, count = vertexCount / 4; i < count; i++) {
        const start = vid + i * 4;
        ib[indexOffset++] = start;
        ib[indexOffset++] = start + 1;
        ib[indexOffset++] = start + 2;
        ib[indexOffset++] = start + 1;
        ib[indexOffset++] = start + 3;
        ib[indexOffset++] = start + 2;
    }
    meshBuffer.indexOffset += renderData.indexCount;
    meshBuffer.setDirty();
}

export function updateOpacity (renderData: RenderData, opacity: number) {
    const vfmt = renderData.vertexFormat;
    const vb = renderData.chunk.vb;
    let attr; let format; let stride;
    // Color component offset
    let offset = 0;
    for (let i = 0; i < vfmt.length; ++i) {
        attr = vfmt[i];
        format = FormatInfos[attr.format];
        if (format.hasAlpha) {
            stride = renderData.floatStride;
            if (format.size / format.count === 1) {
                const alpha = ~~clamp(Math.round(opacity * 255), 0, 255);
                // Uint color RGBA8
                for (let color = offset; color < vb.length; color += stride) {
                    vb[color] = ((vb[color] & 0xffffff00) | alpha) >>> 0;
                }
            } else if (format.size / format.count === 4) {
                // RGBA32 color, alpha at position 3
                for (let alpha = offset + 3; alpha < vb.length; alpha += stride) {
                    vb[alpha] = opacity;
                }
            }
        }
        offset += format.size >> 2;
    }
}
