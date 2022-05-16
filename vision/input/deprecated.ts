


import { markAsWarning, replaceProperty } from '../core/utils/x-deprecated';
import { Event, EventKeyboard, EventMouse, EventTouch, SystemEventType } from './types';
import { SystemEvent } from './system-event';
import { macro } from '../core/platform/macro';

replaceProperty(SystemEventType, 'Node.EventType', [
    {
        name: 'POSITION_PART',
        newName: 'TRANSFORM_CHANGED',
    },
    {
        name: 'ROTATION_PART',
        newName: 'TRANSFORM_CHANGED',
    },
    {
        name: 'SCALE_PART',
        newName: 'TRANSFORM_CHANGED',
    },
]);

// deprecate Event property
replaceProperty(Event, 'Event', [
    {
        name: 'ACCELERATION',
        newName: 'DEVICEMOTION',
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    },
]);

markAsWarning(Event, 'Event', [
    {
        name: 'TOUCH',
        suggest: 'please use SystemEvent.EventType.TOUCH_START, SystemEvent.EventType.TOUCH_MOVE, SystemEvent.EventType.TOUCH_END and SystemEvent.EventType.TOUCH_CANCEL instead',
    },
    {
        name: 'MOUSE',
        suggest: 'please use SystemEvent.EventType.MOUSE_DOWN, SystemEvent.EventType.MOUSE_MOVE, SystemEvent.EventType.MOUSE_UP, SystemEvent.EventType.MOUSE_WHEEL, Node.EventType.MOUSE_ENTER and Node.EventType.MOUSE_LEAVE instead',
    },
    {
        name: 'KEYBOARD',
        suggest: 'please use SystemEvent.EventType.KEY_DOWN and SystemEvent.EventType.KEY_UP instead',
    },
]);

// depracate EventMouse property
replaceProperty(EventMouse, 'EventMouse',
    ['DOWN', 'UP', 'MOVE'].map((item) => ({
        name: item,
        newName: `MOUSE_${item}`,
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    })));
replaceProperty(EventMouse, 'EventMouse', [
    {
        name: 'SCROLL',
        newName: 'MOUSE_WHEEL',
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    },
]);
markAsWarning(EventMouse.prototype, 'EventMouse.prototype', [
    {
        name: 'eventType',
        suggest: 'please use EventMouse.prototype.type instead',
    },
]);

// depracate EventTouch property
replaceProperty(EventTouch, 'EventTouch', [
    {
        name: 'BEGAN',
        newName: 'TOUCH_START',
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    },
]);
replaceProperty(EventTouch, 'EventTouch', [
    {
        name: 'MOVED',
        newName: 'TOUCH_MOVE',
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    },
]);
replaceProperty(EventTouch, 'EventTouch', [
    {
        name: 'ENDED',
        newName: 'TOUCH_END',
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    },
]);
replaceProperty(EventTouch, 'EventTouch', [
    {
        name: 'CANCELLED',
        newName: 'TOUCH_CANCEL',
        target: SystemEvent.EventType,
        targetName: 'SystemEvent.EventType',
    },
]);
markAsWarning(EventTouch.prototype, 'EventTouch.prototype', [
    {
        name: 'getEventCode',
        suggest: 'please use EventTouch.prototype.type instead',
    },
]);
replaceProperty(EventTouch.prototype, 'EventTouch.prototype', [
    {
        name: 'getUILocationInView',
        newName: 'getLocationInView',
        target: EventTouch,
        targetName: 'EventTouch',
    },
]);

markAsWarning(macro.KEY, 'macro.KEY',
    [
        'back',
        'menu',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
        '*', '+', '-', '/', ';', '=', ',', '.', '[', ']',
        'dpadLeft', 'dpadRight', 'dpadUp', 'dpadDown', 'dpadCenter',
    ].map((item) => ({
        name: item,
    })));

markAsWarning(macro.KEY, 'macro.KEY', [
    {
        name: 'shift',
        suggest: 'please use KeyCode.SHIFT_LEFT instead',
    },
]);

markAsWarning(macro.KEY, 'macro.KEY', [
    {
        name: 'ctrl',
        suggest: 'please use KeyCode.CTRL_LEFT instead',
    },
]);

markAsWarning(macro.KEY, 'macro.KEY', [
    {
        name: 'alt',
        suggest: 'please use KeyCode.ALT_LEFT instead',
    },
]);

markAsWarning(macro, 'macro', [
    {
        name: 'KEY',
        suggest: 'please use KeyCode instead',
    },
]);
