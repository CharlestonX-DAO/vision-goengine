

import { Renderable2D } from '../../../framework/renderable-2d';
import { IAssemblerManager } from '../../../renderer/base';
import { Graphics } from '../../../components';
import { graphicsAssembler as graphics } from './graphics-assembler';

export { earcut } from './earcut';

const graphicsAssemblerManager: IAssemblerManager = {
    getAssembler (sprite: Renderable2D) {
        return graphics;
    },
};

Graphics.Assembler = graphicsAssemblerManager;
export {
    graphics,
    graphicsAssemblerManager as graphicsAssembler,
};
