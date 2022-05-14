

/**
 * @packageDocumentation
 * @module ui-assembler
 */

import { addon } from '../../../core/utils/js';
import { IBatcher } from '../../renderer/i-batcher';
import { Label } from '../../components/label';
import { fillMeshVertices3D } from '../utils';
import { bmfont } from './bmfont';
import { letterFont } from './letter-font';
import { Color } from '../../../core/math/color';

const tempColor = new Color(255, 255, 255, 255);

/**
 * letter 组装器
 * 可通过 `UI.letter` 获取该组装器。
 */
export const letter = {
    createData (comp: Label) {
        return comp.requestRenderData();
    },

    fillBuffers (comp: Label, renderer: IBatcher) {
        if (!comp.renderData) {
            return;
        }

        const node = comp.node;
        tempColor.a = node._uiProps.opacity * 255;
        // Fill All
        fillMeshVertices3D(node, renderer, comp.renderData, tempColor);
    },

    updateColor (comp: Label) {

    },

    appendQuad: bmfont.appendQuad,
};

addon(letter, letterFont);
