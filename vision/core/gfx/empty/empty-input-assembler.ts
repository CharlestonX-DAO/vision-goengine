

import { InputAssemblerInfo } from '../base/define';
import { InputAssembler } from '../base/input-assembler';

export class EmptyInputAssembler extends InputAssembler {
    public initialize (info: Readonly<InputAssemblerInfo>) {
        this._attributes = info.attributes;
        this._attributesHash = this.computeAttributesHash();
        this._vertexBuffers = info.vertexBuffers;

        if (info.indexBuffer) {
            this._indexBuffer = info.indexBuffer;
            this._drawInfo.indexCount = this._indexBuffer.size / this._indexBuffer.stride;
            this._drawInfo.firstIndex = 0;
        } else {
            const vertBuff = this._vertexBuffers[0];
            this._drawInfo.vertexCount = vertBuff.size / vertBuff.stride;
            this._drawInfo.firstVertex = 0;
            this._drawInfo.vertexOffset = 0;
        }
    }
    public destroy () {}
}
