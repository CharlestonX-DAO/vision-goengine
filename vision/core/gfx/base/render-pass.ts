

/**
 * @packageDocumentation
 * @module gfx
 */

import { murmurhash2_32_gc } from '../../utils/murmurhash2_gc';
import {
    GFXObject,
    ObjectType,
    ColorAttachment,
    DepthStencilAttachment,
    SubpassInfo,
    RenderPassInfo,
} from './define';

/**
 * @en GFX render pass.
 * @zh GFX 渲染过程。
 */
export abstract class RenderPass extends GFXObject {
    protected _colorInfos: ColorAttachment[] = [];
    protected _depthStencilInfo: DepthStencilAttachment | null = null;
    protected _subpasses: SubpassInfo[] = [];
    protected _hash = 0;

    get colorAttachments () : Readonly<ColorAttachment[]> { return this._colorInfos; }
    get depthStencilAttachment () : Readonly<DepthStencilAttachment> | null { return this._depthStencilInfo; }
    get subPasses () : Readonly<SubpassInfo[]> { return this._subpasses; }
    get hash () { return this._hash; }

    constructor () {
        super(ObjectType.RENDER_PASS);
    }

    // Based on render pass compatibility
    protected computeHash (): number {
        let res = '';
        if (this._subpasses.length) {
            for (let i = 0; i < this._subpasses.length; ++i) {
                const subpass = this._subpasses[i];
                if (subpass.inputs.length) {
                    res += 'ia';
                    for (let j = 0; j < subpass.inputs.length; ++j) {
                        const ia = this._colorInfos[subpass.inputs[j]];
                        res += `,${ia.format},${ia.sampleCount}`;
                    }
                }
                if (subpass.colors.length) {
                    res += 'ca';
                    for (let j = 0; j < subpass.inputs.length; ++j) {
                        const ca = this._colorInfos[subpass.inputs[j]];
                        res += `,${ca.format},${ca.sampleCount}`;
                    }
                }
                if (subpass.depthStencil >= 0) {
                    const ds = this._colorInfos[subpass.depthStencil];
                    res += `ds,${ds.format},${ds.sampleCount}`;
                }
            }
        } else {
            res += 'ca';
            for (let i = 0; i < this._colorInfos.length; ++i) {
                const ca = this._colorInfos[i];
                res += `,${ca.format},${ca.sampleCount}`;
            }
            const ds = this._depthStencilInfo;
            if (ds) {
                res += `ds,${ds.format},${ds.sampleCount}`;
            }
        }

        return murmurhash2_32_gc(res, 666);
    }

    public abstract initialize (info: Readonly<RenderPassInfo>): void;

    public abstract destroy (): void;
}
