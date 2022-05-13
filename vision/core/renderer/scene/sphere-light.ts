

import { JSB } from 'internal:constants';
import { AABB } from '../../geometry';
import { legacyCC } from '../../global-exports';
import { Vec3 } from '../../math';
import { Light, LightType, nt2lm } from './light';
import { NativeSphereLight } from '../native-scene';

export class SphereLight extends Light {
    protected _init (): void {
        super._init();
        if (JSB) {
            (this._nativeObj! as NativeSphereLight).setPosition(this._pos);
            (this._nativeObj! as NativeSphereLight).setAABB(this._aabb.native);
        }
    }

    protected _destroy (): void {
        super._destroy();
    }

    get position () {
        return this._pos;
    }

    set size (size: number) {
        this._size = size;
        if (JSB) {
            (this._nativeObj! as NativeSphereLight).setSize(size);
        }
    }

    get size (): number {
        return this._size;
    }

    set range (range: number) {
        this._range = range;
        if (JSB) {
            (this._nativeObj! as NativeSphereLight).setRange(range);
        }

        this._needUpdate = true;
    }

    get range (): number {
        return this._range;
    }

    get luminance (): number {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._luminanceHDR;
        } else {
            return this._luminanceLDR;
        }
    }
    set luminance (value: number) {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this.luminanceHDR = value;
        } else {
            this.luminanceLDR = value;
        }
    }

    get luminanceHDR () {
        return this._luminanceHDR;
    }
    set luminanceHDR (value: number) {
        this._luminanceHDR = value;

        if (JSB) {
            (this._nativeObj! as NativeSphereLight).setLuminanceHDR(value);
        }
    }

    set luminanceLDR (value: number) {
        this._luminanceLDR = value;

        if (JSB) {
            (this._nativeObj! as NativeSphereLight).setLuminanceLDR(value);
        }
    }

    get aabb () {
        return this._aabb;
    }

    protected _needUpdate = false;
    protected _size = 0.15;
    protected _range = 1.0;
    protected _luminanceHDR = 0;
    protected _luminanceLDR = 0;
    protected _pos: Vec3;
    protected _aabb: AABB;

    constructor () {
        super();
        this._aabb = AABB.create();
        this._pos = new Vec3();
        this._type = LightType.SPHERE;
    }

    public initialize () {
        super.initialize();

        const size = 0.15;
        this.size = size;
        this.range = 1.0;
        this.luminanceHDR = 1700 / nt2lm(size);
        this.luminanceLDR = 1.0;
    }

    public update () {
        if (this._node && (this._node.hasChangedFlags || this._needUpdate)) {
            this._node.getWorldPosition(this._pos);
            const range = this._range;
            AABB.set(this._aabb, this._pos.x, this._pos.y, this._pos.z, range, range, range);
            this._needUpdate = false;
        }
    }
}
