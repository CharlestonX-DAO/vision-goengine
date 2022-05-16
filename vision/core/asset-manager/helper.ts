
import { legacyCC } from '../global-exports';
import { error } from '../platform/debug';
import RequestItem from './request-item';
import { bundles, Request, IOptions, transformPipeline } from './shared';
import Task from './task';

const _uuidRegex = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-@]{8,}).*/;

export { default as decodeUuid } from '../utils/decode-uuid';

/**
 * @packageDocumentation
 * @module asset-manager
 */

/**
 * @en
 * Extract uuid from url
 *
 * @zh
 * 从 url 中提取 uuid
 *
 * @param url - url
 * @returns the uuid parsed from url
 *
 * @example
 * var url = 'res/import/fc/fc991dd7-0033-4b80-9d41-c8a86a702e59.json';
 * var uuid = getUuidFromURL(url); // fc991dd7-0033-4b80-9d41-c8a86a702e59
 */
export function getUuidFromURL (url: string): string {
    const matches = _uuidRegex.exec(url);
    if (matches) {
        return matches[1];
    }
    return '';
}

/**
 * @en
 * Transform uuid to url
 *
 * @zh
 * 转换 uuid 为 url
 *
 * @param uuid - The uuid of asset
 * @param options - Some optional parameters
 * @param options.isNative - Indicates whether the path you want is a native resource path
 * @param options.nativeExt - Extension of the native resource path, it is required when isNative is true
 * @returns url
 *
 * @example
 * // json path, 'assets/main/import/fc/fc991dd7-0033-4b80-9d41-c8a86a702e59.json';
 * var url = getUrlWithUuid('fcmR3XADNLgJ1ByKhqcC5Z', {isNative: false});
 *
 * // png path, 'assets/main/native/fc/fc991dd7-0033-4b80-9d41-c8a86a702e59.png';
 * var url = getUrlWithUuid('fcmR3XADNLgJ1ByKhqcC5Z', {isNative: true, nativeExt: '.png'});
 *
 */
export function getUrlWithUuid (uuid: string, options?: { [k: string]: any, isNative: boolean, nativeExt?: string } | null): string {
    options = options || Object.create(null);

    options!.__isNative__ = options!.isNative;
    if (options!.nativeExt) {
        options!.ext = options!.nativeExt;
    }
    const bundle = bundles.find((b) => !!b.getAssetInfo(uuid));
    if (bundle) {
        options!.bundle = bundle.name;
    }

    return transform(uuid, options) as string;
}

/**
 * @en
 * Check if the type of asset is scene
 *
 * @zh
 * 检查资源类型是否是场景
 *
 * @method isScene
 * @param {*} asset - asset
 * @returns {boolean} - whether or not type is cc.SceneAsset
 *
 */
export function isScene (asset) {
    return !!asset && (asset instanceof legacyCC.SceneAsset || asset instanceof legacyCC.Scene);
}

/**
 * @en
 * Normalize url, strip './' and '/'
 *
 * @zh
 * 标准化 url ，去除 './' 和 '/'
 *
 * @param url - url
 * @returns - The normalized url
 */
export function normalize (url: string): string {
    if (url) {
        if (url.charCodeAt(0) === 46 && url.charCodeAt(1) === 47) {
            // strip './'
            url = url.slice(2);
        } else if (url.charCodeAt(0) === 47) {
            // strip '/'
            url = url.slice(1);
        }
    }
    return url;
}

export function transform (input: Request, options?: IOptions | null): string | string[] {
    const subTask = Task.create({ input, options });
    const urls: string[] = [];
    try {
        const result: RequestItem[] = transformPipeline.sync(subTask);
        for (const requestItem of result) {
            const url = requestItem.url;
            requestItem.recycle();
            urls.push(url);
        }
    } catch (e) {
        for (const item of subTask.output) {
            item.recycle();
        }
        error((e as Error).message, (e as Error).stack);
    }
    subTask.recycle();
    return urls.length > 1 ? urls : urls[0];
}
