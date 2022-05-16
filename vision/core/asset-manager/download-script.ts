

import { getError } from '../platform/debug';
import { CompleteCallback, IBundleOptions } from './shared';

const downloaded = {};

export default function downloadScript (
    url: string,
    options: IBundleOptions,
    onComplete: CompleteCallback,
): HTMLScriptElement | null{
    // no need to load script again
    if (downloaded[url]) {
        if (onComplete) { onComplete(null); }
        return null;
    }

    const script = document.createElement('script');

    if (window.location.protocol !== 'file:') {
        script.crossOrigin = 'anonymous';
    }

    script.async = options.scriptAsyncLoading || false;
    script.src = url;
    function loadHandler () {
        script.parentNode!.removeChild(script);
        script.removeEventListener('load', loadHandler, false);
        script.removeEventListener('error', errorHandler, false);
        downloaded[url] = true;
        if (onComplete) { onComplete(null); }
    }

    function errorHandler () {
        script.parentNode!.removeChild(script);
        script.removeEventListener('load', loadHandler, false);
        script.removeEventListener('error', errorHandler, false);
        if (onComplete) { onComplete(new Error(getError(4928, url))); }
    }

    script.addEventListener('load', loadHandler, false);
    script.addEventListener('error', errorHandler, false);
    document.body.appendChild(script);
    return script;
}
