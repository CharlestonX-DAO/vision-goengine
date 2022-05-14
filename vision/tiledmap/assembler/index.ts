

import { IAssemblerManager } from '../../2d/renderer/base';
import { TiledLayer } from '../tiled-layer';
import { simple } from './simple';

// Inline all type switch to avoid jit deoptimization during inlined function change

const tiledLayerAssembler: IAssemblerManager = {
    getAssembler () {
        return simple;
    },
};

TiledLayer.Assembler = tiledLayerAssembler;

export {
    tiledLayerAssembler,
};
