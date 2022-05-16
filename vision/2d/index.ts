

import {
    CanvasPool,
    graphicsAssembler,
    labelAssembler,
    spriteAssembler,
    earcut,
} from './assembler';
import { RenderData, MeshRenderData } from './renderer/render-data';
import { MeshBuffer } from './renderer/mesh-buffer';
import { StencilManager } from './renderer/stencil-manager';
import { legacyCC } from '../core/global-exports';
import './event';

import './renderer/batcher-2d';

export * from './assets';
export * from './framework';
export * from './components';
export * from './renderer/render-data';
export * from './renderer/base';
export * from './renderer/deprecated';
export * from './utils';

export {
    MeshBuffer,
    StencilManager,
    CanvasPool,
    spriteAssembler,
    labelAssembler,
    graphicsAssembler,
    earcut,
};

legacyCC.UI = {
    MeshBuffer,
    spriteAssembler,
    graphicsAssembler,
    labelAssembler,
    RenderData,
    MeshRenderData,
};
console.log('2d ... 2d')