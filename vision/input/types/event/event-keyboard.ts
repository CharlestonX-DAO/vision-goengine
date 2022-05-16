

/**
 * @packageDocumentation
 * @module event
 */

import { Event } from './event';
import { SystemEventTypeUnion, SystemEventType } from '../event-enum';
import { KeyCode } from '../key-code';

/**
 * @en
 * The keyboard event.
 * @zh
 * 键盘事件。
 */
export class EventKeyboard extends Event {
    /**
     * @en The KeyCode enum value of current keyboard event.
     * @zh 当前键盘事件的 KeyCode 枚举值
     */
    public keyCode: KeyCode;

    /**
     * @en Raw DOM KeyboardEvent.
     * @zh 原始 DOM KeyboardEvent 事件对象
     *
     * @deprecated since v3.3, can't access rawEvent anymore
     */
    public rawEvent?: KeyboardEvent;

    private _isPressed: boolean;
    /**
     * @en Indicates whether the current key is being pressed
     * @zh 表示当前按键是否正在被按下
     */
    public get isPressed () {
        return this._isPressed;
    }

    /**
     * @param keyCode - The key code of the current key or the DOM KeyboardEvent
     * @param isPressed - Indicates whether the current key is being pressed, this is the DEPRECATED parameter.
     * @param bubbles - Indicates whether the event bubbles up through the hierarchy or not.
     */
    constructor (keyCode: number | KeyboardEvent, isPressed: boolean, bubbles?: boolean);
    /**
     * @param keyCode - The key code of the current key or the DOM KeyboardEvent
     * @param eventType - The type of the event
     * @param bubbles - Indicates whether the event bubbles up through the hierarchy or not.
     */
    constructor (keyCode: KeyCode | KeyboardEvent, eventType: SystemEventTypeUnion, bubbles?: boolean);
    constructor (keyCode: any, eventType: SystemEventTypeUnion | boolean, bubbles?: boolean) {
        if (typeof eventType === 'boolean') {
            const isPressed = eventType;
            eventType = isPressed ? SystemEventType.KEY_DOWN : SystemEventType.KEY_UP;
        }
        super(eventType, bubbles);
        this._isPressed = eventType !== SystemEventType.KEY_UP;

        if (typeof keyCode === 'number') {
            this.keyCode = keyCode;
        } else {
            this.keyCode = keyCode.keyCode;
            this.rawEvent = keyCode;
        }
    }
}

// @ts-expect-error TODO
Event.EventKeyboard = EventKeyboard;
