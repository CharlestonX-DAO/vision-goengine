

import { screenAdapter } from 'pal/screen-adapter';
import { markAsWarning, removeProperty, replaceProperty } from '../utils';
import { sys } from './sys';
import { View } from './view';
import { legacyCC } from '../global-exports';
import { screen } from './screen';
import { Size } from '../math';

// #region deprecation on view
removeProperty(View.prototype, 'View.prototype', [
    {
        name: 'isAntiAliasEnabled',
        suggest: 'The API of Texture2d have been largely modified, no alternative',
    },
    {
        name: 'enableAntiAlias',
        suggest: 'The API of Texture2d have been largely modified, no alternative',
    },
]);
markAsWarning(View.prototype, 'View.prototype', [
    {
        name: 'adjustViewportMeta',
    },
    {
        name: 'enableAutoFullScreen',
        suggest: 'use screen.requestFullScreen() instead.',
    },
    {
        name: 'isAutoFullScreenEnabled',
    },
    {
        name: 'setCanvasSize',
        suggest: 'setting size in CSS pixels is not recommended, please use screen.windowSize instead.',
    },
    {
        name: 'getCanvasSize',
        suggest: 'please use screen.windowSize instead.',
    },
    {
        name: 'getFrameSize',
        suggest: 'getting size in CSS pixels is not recommended, please use screen.windowSize instead.',
    },
    {
        name: 'setFrameSize',
        suggest: 'setting size in CSS pixels is not recommended, please use screen.windowSize instead.',
    },
    {
        name: 'getDevicePixelRatio',
        suggest: 'use screen.devicePixelRatio instead.',
    },
    {
        name: 'convertToLocationInView',
    },
    {
        name: 'enableRetina',
    },
    {
        name: 'isRetinaEnabled',
    },
]);
markAsWarning(legacyCC, 'cc', [
    {
        name: 'winSize',
        suggest: 'please use view.getVisibleSize() instead.',
    },
]);
// #endregion deprecation on view
// deprecate capabilities field
markAsWarning(sys, 'sys', [
    {
        name: 'capabilities',
        suggest: 'please use sys.hasFeature() method instead.',
    },
]);

// deprecate languageCode field
replaceProperty(sys, 'sys',
    ['UNKNOWN', 'ENGLISH', 'CHINESE', 'FRENCH', 'ITALIAN',
        'GERMAN', 'SPANISH', 'DUTCH', 'RUSSIAN', 'KOREAN',
        'JAPANESE', 'HUNGARIAN', 'PORTUGUESE', 'ARABIC', 'NORWEGIAN',
        'POLISH', 'TURKISH', 'UKRAINIAN', 'ROMANIAN', 'BULGARIAN'].map((item) => ({
        name: `LANGUAGE_${item}`,
        newName: item,
        target: sys.Language,
        targetName: 'sys.Language',
    })));

// deprecate os field
replaceProperty(sys, 'sys',
    ['UNKNOWN', 'IOS', 'ANDROID', 'WINDOWS', 'LINUX', 'OSX'].map((item) => ({
        name: `OS_${item}`,
        newName: item,
        target: sys.OS,
        targetName: 'sys.OS',
    })));

// deprecate browserType field
replaceProperty(sys, 'sys',
    ['UNKNOWN', 'WECHAT', 'ANDROID', 'IE', 'EDGE', 'QQ', 'MOBILE_QQ',
        'UC', 'UCBS', 'BAIDU_APP', 'BAIDU', 'MAXTHON', 'OPERA',
        'OUPENG', 'MIUI', 'FIREFOX', 'SAFARI', 'CHROME', 'LIEBAO',
        'QZONE', 'SOUGOU', 'HUAWEI'].map((item) => ({
        name: `BROWSER_TYPE_${item}`,
        newName: item,
        target: sys.BrowserType,
        targetName: 'sys.BrowserType',
    })));
replaceProperty(sys, 'sys', [
    {
        name: 'BROWSER_TYPE_360',
        newName: 'BROWSER_360',
        target: sys.BrowserType,
        targetName: 'sys.BrowserType',
    },
]);

// deprecate platform field
replaceProperty(sys, 'sys',
    ['UNKNOWN', 'EDITOR_PAGE', 'EDITOR_CORE', 'MOBILE_BROWSER', 'DESKTOP_BROWSER', 'WIN32', 'MACOS', 'IOS', 'ANDROID', 'OHOS',
        'WECHAT_GAME', 'BAIDU_MINI_GAME', 'XIAOMI_QUICK_GAME', 'ALIPAY_MINI_GAME', 'BYTEDANCE_MINI_GAME',
        'OPPO_MINI_GAME', 'VIVO_MINI_GAME', 'HUAWEI_QUICK_GAME', 'COCOSPLAY',  'LINKSURE_MINI_GAME', 'QTT_MINI_GAME'].map((item) => ({
        name: item,
        target: sys.Platform,
        targetName: 'sys.Platform',
    })));

// remove platform field
replaceProperty(sys, 'sys', [
    {
        name: 'IPHONE',
        newName: 'IOS',
        target: sys.Platform,
        targetName: 'sys.Platform',
    },
    {
        name: 'IPAD',
        newName: 'IOS',
        target: sys.Platform,
        targetName: 'sys.Platform',
    },
]);
removeProperty(sys, 'sys',
    ['LINUX', 'BLACKBERRY', 'NACL', 'EMSCRIPTEN', 'TIZEN',
        'WINRT', 'WP8', 'QQ_PLAY', 'FB_PLAYABLE_ADS'].map((item) => ({
        name: item,
    })));
replaceProperty(sys, 'sys', [
    {
        name: 'windowPixelResolution',
        target: screen,
        targetName: 'screen',
        newName: 'windowSize',
    },
]);

// deprecate screen API
markAsWarning(screen, 'screen', [
    {
        name: 'autoFullScreen',
        suggest: 'please use screen.requestFullScreen() instead.',
    },
    {
        name: 'disableAutoFullScreen',
    },
]);