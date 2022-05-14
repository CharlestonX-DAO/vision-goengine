

import * as VertexFormat from './vertex-format';
import { Batcher2D } from './batcher-2d';
import { DrawBatch2D } from './draw-batch';
import { markAsWarning, replaceProperty, removeProperty } from '../../core/utils/x-deprecated';
import { MeshBuffer } from './mesh-buffer';
import { MeshRenderData } from './render-data';
import { warnID } from '../../core';

export { VertexFormat as UIVertexFormat };

export { Batcher2D as UI };

export { DrawBatch2D as UIDrawBatch };

markAsWarning(MeshBuffer.prototype, 'MeshBuffer',
    [
        'byteStart',
        'vertexStart',
        'indicesStart',
        'request',
    ].map((item) => ({
        name: item,
        suggest: `please use meshBuffer.accessor.${item} instead`,
    })));

replaceProperty(MeshBuffer.prototype, 'MeshBuffer', [
    {
        name: 'indicesOffset',
        newName: 'indexOffset',
    },
]);

removeProperty(MeshBuffer.prototype, 'MeshBuffer', [
    {
        name: 'vertexBuffers',
    },
    {
        name: 'indexBuffer',
    },
]);

replaceProperty(Batcher2D.prototype, 'Batcher2D', [
    {
        name: 'currBufferBatch',
        newName: 'currBufferAccessor',
    },
    {
        name: 'acquireBufferBatch',
        newName: 'switchBufferAccessor',
    },
]);

removeProperty(MeshRenderData.prototype, 'MeshRenderData', [
    {
        name: 'formatByte',
    },
    {
        name: 'byteStart',
    },
    {
        name: 'byteCount',
    },
]);

replaceProperty(MeshRenderData.prototype, 'MeshRenderData', [
    {
        name: 'indicesStart',
        newName: 'indexStart',
    },
]);

export class QuadRenderData extends MeshRenderData {
    constructor (vertexFormat) {
        super(vertexFormat);
        warnID(9006);
    }
}
