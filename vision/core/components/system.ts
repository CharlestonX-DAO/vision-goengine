



import { ISchedulable } from '../scheduler';
import { Enum } from '../value-types/enum';

/**
 * @en Base class for all functional system managed by [[Director]].
 * @zh 功能系统的基类，由 [[Director]] 管理。
 */
export default class System implements ISchedulable {
    static Priority = Enum({
        LOW: 0,
        MEDIUM: 100,
        HIGH: 200,
        SCHEDULER: (1 << 31) >>> 0,
    });

    protected _id = '';
    protected _priority = 0;
    protected _executeInEditMode = false;

    set priority (value:number) {
        this._priority = value;
    }
    get priority ():number {
        return this._priority;
    }

    set id (id:string) {
        this._id = id;
    }
    get id ():string {
        return this._id;
    }

    /**
     * @en Sorting between different systems.
     * @zh 不同系统间排序。
     * @param a System a
     * @param b System b
     */
    public static sortByPriority (a:System, b:System) {
        if (a._priority < b._priority) {
            return 1;
        } else if (a._priority > b.priority) {
            return -1;
        } else {
            return 0;
        }
    }

    /**
     * @en Init the system, will be invoked by [[Director]] when registered, should be implemented if needed.
     * @zh 系统初始化函数，会在注册时被 [[Director]] 调用，如果需要的话应该由子类实现
     */
    init () {}
    /**
     * @en Update function of the system, it will be invoked between all components update phase and late update phase.
     * @zh 系统的帧更新函数，它会在所有组件的 update 和 lateUpdate 之间被调用
     * @param dt Delta time after the last frame
     */
    update (dt: number) {}
    /**
     * @en Post update function of the system, it will be invoked after all components late update phase and before the rendering process.
     * @zh 系统的帧后处理函数，它会在所有组件的 lateUpdate 之后以及渲染之前被调用
     * @param dt Delta time after the last frame
     */
    postUpdate (dt: number) {}
}
