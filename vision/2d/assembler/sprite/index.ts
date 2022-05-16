



import { Renderable2D } from '../../framework/renderable-2d';
import { IAssemblerManager } from '../../renderer/base';
import { Sprite } from '../../components';
import { barFilled } from './bar-filled';
import { radialFilled } from './radial-filled';
import { simple } from './simple';
import { sliced } from './sliced';
import { tiled } from './tiled';

const SpriteType = Sprite.Type;
const FillType = Sprite.FillType;

// Inline all type switch to avoid jit deoptimization during inlined function change

const spriteAssembler: IAssemblerManager = {
    getAssembler (spriteComp: Renderable2D) {
        let util = simple;

        const comp = spriteComp as Sprite;
        switch (comp.type) {
        case SpriteType.SLICED:
            util = sliced;
            break;
        case SpriteType.TILED:
            util = tiled;
            break;
        case SpriteType.FILLED:
            if (comp.fillType === FillType.RADIAL) {
                util = radialFilled;
            } else {
                util = barFilled;
            }
            break;
            // case SpriteType.MESH:
            //     util = meshRenderUtil;
            //     break;
        default:
            break;
        }

        return util;
    },

    // Skip invalid sprites (without own _assembler)
    // updateRenderData (sprite) {
    //     return sprite.__allocedDatas;
    // },
};

Sprite.Assembler = spriteAssembler;

export {
    spriteAssembler,
    simple,
    sliced,
    barFilled,
    radialFilled,
};
