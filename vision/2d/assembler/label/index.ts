

/**
 * @packageDocumentation
 * @module ui-assembler
 */

import { BitmapFont } from '../../assets';
import { Label } from '../../components';
import { IAssemblerManager } from '../../renderer/base';
import { bmfont } from './bmfont';
import { CanvasPool } from './font-utils';
import { letter } from './letter';
import { ttf } from './ttf';

const labelAssembler: IAssemblerManager = {
    getAssembler (comp: Label) {
        let assembler = ttf;

        if (comp.font instanceof BitmapFont) {
            assembler = bmfont;
        } else if (comp.cacheMode === Label.CacheMode.CHAR) {
            assembler = letter;
        }

        return assembler;
    },

    // Skip invalid labels (without own _assembler)
    // updateRenderData(label) {
    //     return label.__allocedDatas;
    // }
};

export {
    labelAssembler,
    ttf,
    bmfont,
    letter,
    CanvasPool,
};

Label.Assembler = labelAssembler;
