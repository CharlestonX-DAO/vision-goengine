

/**
 * @packageDocumentation
 * @module component/web-view
 */

import { legacyCC } from '../core/global-exports';
import { WebViewImplWeb } from './web-view-impl-web';

export class WebViewImplManager {
    // default web
    static getImpl (component) {
        return new WebViewImplWeb(component);
    }
}

legacyCC.internal.WebViewImplManager = WebViewImplManager;
