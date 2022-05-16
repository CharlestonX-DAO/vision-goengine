

/**
 * @packageDocumentation
 * @module ui-assembler
 */

import { SpriteFrame } from '../../assets/sprite-frame';
import * as js from '../../../core/utils/js';
import { Color, Rect } from '../../../core/math';
import { IBatcher } from '../../renderer/i-batcher';
import { Label } from '../../components/label';
import { IAssembler } from '../../renderer/base';
import { fillMeshVertices3D } from '../utils';
import { bmfontUtils } from './bmfontUtils';

const tempColor = new Color(255, 255, 255, 255);

/**
 * bmfont 组装器
 * 可通过 `UI.bmfont` 获取该组装器。
 */
export const bmfont: IAssembler = {
    createData (comp: Label) {
        return comp.requestRenderData();
    },

    fillBuffers (comp: Label, renderer: IBatcher) {
        const node = comp.node;
        tempColor.set(comp.color);
        tempColor.a = node._uiProps.opacity * 255;
        // Fill All
        fillMeshVertices3D(node, renderer, comp.renderData!, tempColor);
    },

    appendQuad (comp: Label, spriteFrame: SpriteFrame, rect: Rect, rotated: boolean, x: number, y: number, scale: number) {
        const renderData = comp.renderData;
        if (!renderData) {
            return;
        }

        const dataOffset = renderData.dataLength;

        renderData.dataLength += 4;
        renderData.resize(renderData.dataLength, renderData.dataLength / 2 * 3);

        const dataList = renderData.data;
        const texW = spriteFrame.width;
        const texH = spriteFrame.height;

        const rectWidth = rect.width;
        const rectHeight = rect.height;

        let l = 0;
        let b = 0;
        let t = 0;
        let r = 0;
        if (!rotated) {
            l = (rect.x) / texW;
            r = (rect.x + rectWidth) / texW;
            b = (rect.y + rectHeight) / texH;
            t = (rect.y) / texH;

            dataList[dataOffset].u = l;
            dataList[dataOffset].v = b;
            dataList[dataOffset + 1].u = r;
            dataList[dataOffset + 1].v = b;
            dataList[dataOffset + 2].u = l;
            dataList[dataOffset + 2].v = t;
            dataList[dataOffset + 3].u = r;
            dataList[dataOffset + 3].v = t;
        } else {
            l = (rect.x) / texW;
            r = (rect.x + rectHeight) / texW;
            b = (rect.y + rectWidth) / texH;
            t = (rect.y) / texH;

            dataList[dataOffset].u = l;
            dataList[dataOffset].v = t;
            dataList[dataOffset + 1].u = l;
            dataList[dataOffset + 1].v = b;
            dataList[dataOffset + 2].u = r;
            dataList[dataOffset + 2].v = t;
            dataList[dataOffset + 3].u = r;
            dataList[dataOffset + 3].v = b;
        }

        dataList[dataOffset].x = x;
        dataList[dataOffset].y = y - rectHeight * scale;
        dataList[dataOffset + 1].x = x + rectWidth * scale;
        dataList[dataOffset + 1].y = y - rectHeight * scale;
        dataList[dataOffset + 2].x = x;
        dataList[dataOffset + 2].y = y;
        dataList[dataOffset + 3].x = x + rectWidth * scale;
        dataList[dataOffset + 3].y = y;
    },

    updateColor (comp: Label) {

    },
};

js.addon(bmfont, bmfontUtils);
