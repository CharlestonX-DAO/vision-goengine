

declare const gfx: any;
declare const global: any;

interface Window {

    [x: string]: any;

    WebGL2RenderingContext: any;

    sharedCanvas: any;
    __canvas: any;
    canvas: any;

    XMLHttpRequest: any;
    mozRequestAnimationFrame(callback: any, element?: any): any;
    oRequestAnimationFrame(callback: any, element?: any): any;
    msRequestAnimationFrame(callback: any, element?: any): any;
    cancelRequestAnimationFrame(callback: any, element?: any): any;
    msCancelRequestAnimationFrame(callback: any, element?: any): any;
    mozCancelRequestAnimationFrame(callback: any, element?: any): any;
    oCancelRequestAnimationFrame(callback: any, element?: any): any;
    webkitCancelRequestAnimationFrame(callback: any, element?: any): any;
    msCancelAnimationFrame(callback: any, element?: any): any;
    mozCancelAnimationFrame(callback: any, element?: any): any;
    ocancelAnimationFrame(callback: any, element?: any): any;
}

interface Document {
    mozHidden: any;
    msHidden: any;
    webkitHidden: any;
}

interface HTMLElement {
    content: any;
    name: any;
}

declare type CompareFunction<T> = (a: T, b: T) => number;

declare type RecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends Array<infer U> ? Array<RecursivePartial<U>> :
        T[P] extends ReadonlyArray<infer V> ? ReadonlyArray<RecursivePartial<V>> : RecursivePartial<T[P]>;
};

declare type TypedArray = Uint8Array | Uint8ClampedArray | Int8Array | Uint16Array |
Int16Array | Uint32Array | Int32Array | Float32Array | Float64Array;

declare type TypedArrayConstructor = Uint8ArrayConstructor | Uint8ClampedArrayConstructor |
Int8ArrayConstructor | Uint16ArrayConstructor | Int16ArrayConstructor | Uint32ArrayConstructor |
Int32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor;

declare interface IWritableArrayLike<T> {
    readonly length: number;
    [index: number]: T;
}

declare type Constructor<T = unknown> = new (...args: any[]) => T;

/**
 * Alias of `Function` but suppress eslint warning.
 * Please avoid using it and explicitly specify function signatures as possible.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
declare type AnyFunction = Function;

declare type Mutable<T> = { -readonly [P in keyof T]: T[P] };

declare type Getter = () => any;

declare type Setter = (value: any) => void;

declare const Buffer: any;

declare type EnumAlias<EnumT> = EnumT[keyof EnumT];
