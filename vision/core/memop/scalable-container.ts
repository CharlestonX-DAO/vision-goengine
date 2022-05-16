
import { containerManager } from './container-manager';

export abstract class ScalableContainer {
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _poolHandle = -1;
    constructor () {
        containerManager.addContainer(this);
    }

    abstract tryShrink (): void;

    destroy () {
        containerManager.removeContainer(this);
    }
}
