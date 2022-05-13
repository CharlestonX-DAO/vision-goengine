

/**
 * @packageDocumentation
 * @module tween
 */

import { EDITOR } from 'internal:constants';
import { System, Director, director } from '../core';
import { ActionManager } from './actions/action-manager';
import { legacyCC } from '../core/global-exports';

/**
 * @en
 * Tween system.
 * @zh
 * 缓动系统。
 */
export class TweenSystem extends System {
    /**
     * @en
     * The ID flag of the system.
     * @zh
     * 此系统的 ID 标记。
     */
    static readonly ID = 'TWEEN';

    /**
     * @en
     * Gets the instance of the tween system.
     * @zh
     * 获取缓动系统的实例。
     */
    static readonly instance: TweenSystem;

    /**
     * @en
     * Gets the action manager.
     * @zh
     * 获取动作管理器。
     */
    get ActionManager () {
        return this.actionMgr;
    }

    private readonly actionMgr = new ActionManager();

    /**
     * @en
     * The update will auto execute after all compnents update.
     * @zh
     * 此方法会在组件 update 之后自动执行。
     * @param dt 间隔时间
     */
    update (dt: number) {
        if (!EDITOR || legacyCC.GAME_VIEW || this._executeInEditMode) {
            this.actionMgr.update(dt);
        }
    }
}

director.on(Director.EVENT_INIT, () => {
    const sys = new TweenSystem();
    (TweenSystem.instance as any) = sys;
    director.registerSystem(TweenSystem.ID, sys, System.Priority.MEDIUM);
});
