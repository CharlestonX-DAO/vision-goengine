

/**
 * @packageDocumentation
 * @module component/web-view
 */

export enum EventType {
    /**
     * @en None
     * @zh 无
     */
    NONE = 'none',
    /**
     * @en Web page Load completed.
     * @zh 网页加载完成
     */
    LOADING = 'loading',
    /**
     * @en Web page is loading.
     * @zh 网页加载中
     */
    LOADED = 'loaded',
    /**
     * @en Web page error occurs when loading.
     * @zh 网页加载出错
     */
    ERROR = 'error',
}
