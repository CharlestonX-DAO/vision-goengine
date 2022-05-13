

import { QueueInfo } from '../base/define';
import { CommandBuffer } from '../base/command-buffer';
import { Queue } from '../base/queue';

export class EmptyQueue extends Queue {
    public initialize (info: Readonly<QueueInfo>) {
        this._type = info.type;
    }
    public destroy () {}
    public submit (cmdBuffs: Readonly<CommandBuffer[]>) {}
}
