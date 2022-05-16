

import { QueueInfo } from '../base/define';
import { CommandBuffer } from '../base/command-buffer';
import { Queue } from '../base/queue';

export class WebGLQueue extends Queue {
    public numDrawCalls = 0;
    public numInstances = 0;
    public numTris = 0;

    public initialize (info: Readonly<QueueInfo>) {
        this._type = info.type;
    }

    public destroy () {
    }

    public submit (cmdBuffs: Readonly<CommandBuffer[]>) {
        const len = cmdBuffs.length;
        for (let i = 0; i < len; i++) {
            const cmdBuff = cmdBuffs[i];
            // WebGLCmdFuncExecuteCmds( this._device as WebGLDevice, (cmdBuff as WebGLCommandBuffer).cmdPackage); // opted out
            this.numDrawCalls += cmdBuff.numDrawCalls;
            this.numInstances += cmdBuff.numInstances;
            this.numTris += cmdBuff.numTris;
        }
    }

    public clear () {
        this.numDrawCalls = 0;
        this.numInstances = 0;
        this.numTris = 0;
    }
}
