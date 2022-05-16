

import { Event } from './event';
import { Acceleration } from '../acceleration';
import { SystemEventType } from '../event-enum';

/**
 * @en
 * The acceleration event.
 * @zh
 * 加速计事件。
 */
export class EventAcceleration extends Event {
    /**
     * @en The acceleration object
     * @zh 加速度对象
     */
    public acc: Acceleration;

    /**
     * @param acc - The acceleration
     * @param bubbles - Indicate whether the event bubbles up through the hierarchy or not.
     */
    constructor (acc: Acceleration, bubbles?: boolean) {
        super(SystemEventType.DEVICEMOTION, bubbles);
        this.acc = acc;
    }
}

// @ts-expect-error TODO
Event.EventAcceleration = EventAcceleration;
