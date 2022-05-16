

/**
 * @packageDocumentation
 * @module ui-assembler
 */

import { IBatcher } from '../../renderer/i-batcher';
import { Mask, MaskType } from '../../components/mask';
import { IAssembler, IAssemblerManager } from '../../renderer/base';
import { StencilManager } from '../../renderer/stencil-manager';
import { simple } from '../sprite';

const _stencilManager = StencilManager.sharedManager!;

function applyClearMask (mask: Mask, renderer: IBatcher) {
    _stencilManager.clear(mask);
    renderer.commitModel(mask, mask._clearModel, mask._clearStencilMtl);
}

function applyAreaMask (mask: Mask, renderer: IBatcher) {
    _stencilManager.enterLevel(mask);
    if (mask.type === MaskType.IMAGE_STENCIL) {
        simple.fillBuffers(mask, renderer);
        const mat = mask.graphics!.getMaterialInstance(0)!;
        renderer.forceMergeBatches(mat, mask.spriteFrame, mask.graphics!);
    } else {
        mask.graphics!.updateAssembler(renderer);
    }
}

export const maskAssembler: IAssembler = {
    createData (mask: Mask) {
        const renderData = mask.requestRenderData();
        renderData.dataLength = 2;
        renderData.resize(4, 6);
        return renderData;
    },

    updateRenderData (mask: Mask) {
        if (mask.type === MaskType.IMAGE_STENCIL) {
            simple.updateRenderData(mask);
            simple.updateColor(mask);
        }
    },

    fillBuffers (mask: Mask, renderer: IBatcher) {
        if (mask.type !== MaskType.IMAGE_STENCIL || mask.spriteFrame) {
            _stencilManager.pushMask(mask);

            renderer.finishMergeBatches();
            applyClearMask(mask, renderer);
            applyAreaMask(mask, renderer);

            _stencilManager.enableMask();
        }
    },
};

export const maskEndAssembler: IAssembler = {
    fillBuffers (mask: Mask, ui: IBatcher) {
        _stencilManager.exitMask();
    },
};

const StartAssembler: IAssemblerManager = {
    getAssembler () {
        return maskAssembler;
    },
};

const PostAssembler: IAssemblerManager = {
    getAssembler () {
        return maskEndAssembler;
    },
};

Mask.Assembler = StartAssembler;
Mask.PostAssembler = PostAssembler;
