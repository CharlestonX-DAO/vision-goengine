


import { getError } from '../platform/debug';
import { CompleteCallback, IDownloadParseOptions } from './shared';

export default function downloadDomImage (
    url: string,
    options: IDownloadParseOptions,
    onComplete: CompleteCallback<HTMLImageElement>,
): HTMLImageElement {
    const img = new Image();

    if (window.location.protocol !== 'file:') {
        img.crossOrigin = 'anonymous';
    }

    function loadCallback () {
        img.removeEventListener('load', loadCallback);
        img.removeEventListener('error', errorCallback);
        if (onComplete) { onComplete(null, img); }
    }

    function errorCallback () {
        img.removeEventListener('load', loadCallback);
        img.removeEventListener('error', errorCallback);
        if (onComplete) { onComplete(new Error(getError(4930, url))); }
    }

    img.addEventListener('load', loadCallback);
    img.addEventListener('error', errorCallback);
    img.src = url;
    return img;
}
