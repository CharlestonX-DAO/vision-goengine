

/**
 * @packageDocumentation
 * @module core
 */

import { systemInfo } from 'pal/system-info';
import { OS } from '../../../pal/system-info/enum-type';

const EXTNAME_RE = /(\.[^\.\/\?\\]*)(\?.*)?$/;
const DIRNAME_RE = /((.*)(\/|\\|\\\\))?(.*?\..*$)?/;
const NORMALIZE_RE = /[^\.\/]+\/\.\.\//;

/**
 * @en Join strings to be a path.
 * @zh 拼接字符串为路径。
 * @example {@link vision/core/utils/CCPath/join.js}
 */
export function join (...segments: string[]) {
    let result = '';
    for (const segment of segments) {
        result = (result + (result === '' ? '' : '/') + segment).replace(/(\/|\\\\)$/, '');
    }
    return result;
}

/**
 * @en Get the ext name of a path including '.', like '.png'.
 * @zh 返回 Path 的扩展名，包括 '.'，例如 '.png'。
 * @example {@link vision/core/utils/CCPath/extname.js}
 */
export function extname (path: string) {
    const temp = EXTNAME_RE.exec(path);
    return temp ? temp[1] : '';
}

/**
 * @en Get the main name of a file name.
 * @zh 获取文件名的主名称。
 * @deprecated
 */
export function mainFileName (fileName: string) {
    if (fileName) {
        const idx = fileName.lastIndexOf('.');
        if (idx !== -1) {
            return fileName.substring(0, idx);
        }
    }
    return fileName;
}

/**
 * @en Get the file name of a file path.
 * @zh 获取文件路径的文件名。
 * @example {@link vision/core/utils/CCPath/basename.js}
 */
export function basename (path: string, extName?: string) {
    const index = path.indexOf('?');
    if (index > 0) {
        path = path.substring(0, index);
    }
    const reg = /(\/|\\)([^\/\\]+)$/g;
    const result = reg.exec(path.replace(/(\/|\\)$/, ''));
    if (!result) {
        return path;
    }
    const baseName = result[2];
    if (extName && path.substring(path.length - extName.length).toLowerCase() === extName.toLowerCase()) {
        return baseName.substring(0, baseName.length - extName.length);
    }
    return baseName;
}

/**
 * @en Get dirname of a file path.
 * @zh 获取文件路径的目录名。
 * @example {@link vision/core/utils/CCPath/dirname.js}
 */
export function dirname (path: string) {
    const temp = DIRNAME_RE.exec(path);
    return temp ? temp[2] : '';
}

/**
 * @en Change extname of a file path.
 * @zh 更改文件路径的扩展名。
 * @example {@link vision/core/utils/CCPath/changeExtname.js}
 */
export function changeExtname (path: string, extName?: string) {
    extName = extName || '';
    let index = path.indexOf('?');
    let tempStr = '';
    if (index > 0) {
        tempStr = path.substring(index);
        path = path.substring(0, index);
    }
    index = path.lastIndexOf('.');
    if (index < 0) {
        return path + extName + tempStr;
    }
    return path.substring(0, index) + extName + tempStr;
}

/**
 * @en Change file name of a file path.
 * @zh 更改文件路径的文件名。
 * @example {@link vision/core/utils/CCPath/changeBasename.js}
 */
export function changeBasename (path: string, baseName: string, isSameExt?: boolean) {
    if (baseName.indexOf('.') === 0) {
        return changeExtname(path, baseName);
    }
    let index = path.indexOf('?');
    let tempStr = '';
    const ext = isSameExt ? extname(path) : '';
    if (index > 0) {
        tempStr = path.substring(index);
        path = path.substring(0, index);
    }
    index = path.lastIndexOf('/');
    index = index <= 0 ? 0 : index + 1;
    return path.substring(0, index) + baseName + ext + tempStr;
}

// todo make public after verification
export function _normalize (url) {
    let oldUrl = url = String(url);

    // removing all ../
    do {
        oldUrl = url;
        url = url.replace(NORMALIZE_RE, '');
    } while (oldUrl.length !== url.length);
    return url;
}

export function stripSep (path: string) {
    return path.replace(/[\/\\]$/, '');
}

export function getSeperator () {
    return systemInfo.os === OS.WINDOWS ? '\\' : '/';
}
