

// eslint-disable-next-line import/no-extraneous-dependencies
import bulletModule, { bulletType } from '@cocos/bullet';
import { WECHAT } from 'internal:constants';
import { physics } from '../../../exports/physics-framework';
import { sys } from '../../core/platform';
import { pageSize, pageCount, importFunc } from './bullet-env';

let bulletLibs: any = bulletModule;
if (globalThis.BULLET) {
    console.log('[Physics][Bullet]: Using the external Bullet libs.');
    bulletLibs = globalThis.BULLET;
}

if (!physics.selector.runInEditor) bulletLibs = () => ({});

interface instanceExt extends Bullet.instance {
    CACHE: any,
    BODY_CACHE_NAME: string,
}

export const bt: instanceExt = {} as any;
globalThis.Bullet = bt;
bt.BODY_CACHE_NAME = 'body';

export function waitForAmmoInstantiation (dirRoot: string) {
    // refer https://stackoverflow.com/questions/47879864/how-can-i-check-if-a-browser-supports-webassembly
    const supported = (() => {
        // iOS 15.4 has some wasm memory issue, can not use wasm for bullet
        const isiOS15_4 = (sys.os === sys.OS.IOS || sys.os === sys.OS.OSX) && sys.isBrowser
        && /(OS 15_4)|(Version\/15.4)/.test(window.navigator.userAgent);
        if (isiOS15_4) {
            return false;
        }
        try {
            if (typeof WebAssembly === 'object'
                && typeof WebAssembly.instantiate === 'function') {
                const module = new WebAssembly.Module(new Uint8Array([0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]));
                if (module instanceof WebAssembly.Module) {
                    return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
                }
            }
        } catch (e) {
            return false;
        }
        return false;
    })();
    return Promise.resolve().then(() => {
        if (bulletType === 'fallback') {
            return (bulletModule as any)(supported) as string | typeof bulletModule;
        }
        return bulletLibs as string | typeof bulletModule;
    }).then((module) => {
        if (typeof module === 'string') {
            console.info('[Physics][Bullet]: Using wasm Bullet libs.');
            const infoReport = (msg: any) => { console.info(msg); };
            const errorReport = (msg: any) => { console.error(msg); };
            const memory = new WebAssembly.Memory({ initial: pageCount });
            const importObject = {
                cc: importFunc,
                wasi_snapshot_preview1: { fd_close: infoReport, fd_seek: infoReport, fd_write: infoReport },
                env: { memory },
            };
            return new Promise<void>((resolve, reject) => {
                function instantiateWasm (buff: any) {
                    WebAssembly.instantiate(buff, importObject).then((results) => {
                        const btInstance = results.instance.exports as unknown as Bullet.instance;
                        Object.assign(bt, btInstance);
                        resolve();
                    }, errorReport);
                }

                if (WECHAT) {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    const wasmFilePath = `${dirRoot}${module}` as any;
                    instantiateWasm(wasmFilePath);
                } else {
                    fetch(module).then((response) => {
                        response.arrayBuffer().then((buff) => {
                            instantiateWasm(buff);
                        }, errorReport);
                    }, errorReport);
                }
            });
        } else {
            console.info('[Physics][Bullet]: Using asmjs Bullet libs.');
            const env: any = importFunc;
            const wasmMemory: any = {};
            wasmMemory.buffer = new ArrayBuffer(pageSize * pageCount);
            env.memory = wasmMemory;
            const btInstance = module(env, wasmMemory);
            Object.assign(bt, btInstance);
            return new Promise<void>((resolve, reject) => { resolve(); });
        }
    });
}
