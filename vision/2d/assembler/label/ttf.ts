

/**
 * ui-assembler 相关模块
 * @module ui-assembler
 */

import * as js from '../../../core/utils/js';
import { Color } from '../../../core/math';
import { IBatcher } from '../../renderer/i-batcher';
import { Label } from '../../components/label';
import { IAssembler } from '../../renderer/base';
import { ttfUtils } from './ttfUtils';
import { IRenderData } from '../../renderer/render-data';

const WHITE = Color.WHITE.clone();

/**
 * ttf 组装器
 * 可通过 `UI.ttf` 获取该组装器。
 */
export const ttf: IAssembler = {
    createData (comp: Label) {
        const renderData = comp.requestRenderData()!;

        renderData.dataLength = 2;
        renderData.resize(4, 6);

        const vData = renderData.chunk.vb;

        vData[3] = vData[21] = vData[22] = vData[31] = 0;
        vData[4] = vData[12] = vData[13] = vData[30] = 1;
        let offset = 5;
        for (let i = 0; i < 4; i++) {
            Color.toArray(vData, WHITE, offset);
            offset += 9;
        }
        return renderData;
    },

    fillBuffers (comp: Label, renderer: IBatcher) {
        const chunk = comp.renderData!.chunk;
        const dataList: IRenderData[] = comp.renderData!.data;
        const node = comp.node;

        const vData = chunk.vb;
        const data0 = dataList[0];
        const data3 = dataList[1];
        /* */
        node.updateWorldTransform();
        // @ts-expect-error private property access
        const pos = node._pos; const rot = node._rot; const scale = node._scale;
        const ax = data0.x * scale.x; const bx = data3.x * scale.x;
        const ay = data0.y * scale.y; const by = data3.y * scale.y;
        const qx = rot.x; const qy = rot.y; const qz = rot.z; const qw = rot.w;
        const qxy = qx * qy; const qzw = qz * qw;
        const qxy2 = qx * qx - qy * qy;
        const qzw2 = qw * qw - qz * qz;
        const cx1 = qzw2 + qxy2;
        const cx2 = (qxy - qzw) * 2;
        const cy1 = qzw2 - qxy2;
        const cy2 = (qxy + qzw) * 2;
        const x = pos.x; const y = pos.y;
        // left bottom
        vData[0] = cx1 * ax + cx2 * ay + x;
        vData[1] = cy1 * ay + cy2 * ax + y;
        // right bottom
        vData[9] = cx1 * bx + cx2 * ay + x;
        vData[10] = cy1 * ay + cy2 * bx + y;
        // left top
        vData[18] = cx1 * ax + cx2 * by + x;
        vData[19] = cy1 * by + cy2 * ax + y;
        // right top
        vData[27] = cx1 * bx + cx2 * by + x;
        vData[28] = cy1 * by + cy2 * bx + y;

        // quick version
        const bid = chunk.bufferId;
        const vid = chunk.vertexOffset;
        const meshBuffer = chunk.vertexAccessor.getMeshBuffer(chunk.bufferId);
        const ib = chunk.vertexAccessor.getIndexBuffer(bid);
        let indexOffset = meshBuffer.indexOffset;
        ib[indexOffset++] = vid;
        ib[indexOffset++] = vid + 1;
        ib[indexOffset++] = vid + 2;
        ib[indexOffset++] = vid + 2;
        ib[indexOffset++] = vid + 1;
        ib[indexOffset++] = vid + 3;
        meshBuffer.indexOffset += 6;
        // slow version
        // const chunk = renderData.chunk;
        // renderer.getBufferAccessor().appendIndices(chunk);
    },

    updateVertexData (comp: Label) {
        const renderData = comp.renderData;
        if (!renderData) {
            return;
        }
        const uiTrans = comp.node._uiProps.uiTransformComp!;
        const width = uiTrans.width;
        const height = uiTrans.height;
        const appX = uiTrans.anchorX * width;
        const appY = uiTrans.anchorY * height;

        const data = renderData.data;
        data[0].x = -appX;
        data[0].y = -appY;
        data[1].x = width - appX;
        data[1].y = height - appY;
    },

    updateUVs (comp: Label) {
        const renderData = comp.renderData;
        if (!renderData || !comp.ttfSpriteFrame) {
            return;
        }
        const vData = renderData.chunk.vb;
        const uv = comp.ttfSpriteFrame.uv;
        vData[3] = uv[0];
        vData[4] = uv[1];
        vData[12] = uv[2];
        vData[13] = uv[3];
        vData[21] = uv[4];
        vData[22] = uv[5];
        vData[30] = uv[6];
        vData[31] = uv[7];
    },

    updateColor (comp: Label) {

    },
};

js.addon(ttf, ttfUtils);
