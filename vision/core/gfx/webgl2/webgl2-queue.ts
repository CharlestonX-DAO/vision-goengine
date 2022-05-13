

import { QueueInfo } from '../base/define';
import { CommandBuffer } from '../base/command-buffer';
import { Queue } from '../base/queue';
import { WebGL2CommandBuffer } from './webgl2-command-buffer';

export class WebGL2Queue extends Queue {
    public numDrawCalls = 0;
    public numInstances = 0;
    public numTris = 0;

    public initialize (info: Readonly<QueueInfo>) {
        this._type = info.type;
    }

    public destroy () {
    }

    public submit (cmdBuffs: Readonly<CommandBuffer[]>) {
        for (let i = 0; i < cmdBuffs.length; i++) {
            const cmdBuff = cmdBuffs[i] as WebGL2CommandBuffer;
            // WebGL2CmdFuncExecuteCmds(this._device as WebGL2Device, cmdBuff.cmdPackage); // opted out
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
