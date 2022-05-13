

/**
 * @packageDocumentation
 * @module asset
 */

import { EDITOR, TEST } from 'internal:constants';
import { ccclass, serializable, editable } from 'cc.decorator';
import * as js from '../../core/utils/js';
import { Asset } from '../../core/assets';
import { SpriteFrame } from './sprite-frame';
import { legacyCC } from '../../core/global-exports';

interface ISpriteAtlasSerializeData{
    name: string;
    spriteFrames: string[];
}

interface ISpriteFrameList {
    [key: string]: SpriteFrame | null;
}

/**
 * @en
 * Class for sprite atlas handling.
 * @zh
 * 精灵图集资源类。
 */
@ccclass('cc.SpriteAtlas')
export class SpriteAtlas extends Asset {
    @serializable
    @editable
    public spriteFrames: ISpriteFrameList = js.createMap();

    /**
     * @en Get the [[Texture2D]] asset of the atlas.
     * @zh 获取精灵图集的贴图。请注意，由于结构调整优化，在 v1.1 版本之前，此函数的返回值为 imageAsset，在 v1.1 版本之后修正为 texture，想要获取 imageAsset 可使用 getTexture().image 获取
     * @returns The texture2d asset
     */
    public getTexture () {
        const keys = Object.keys(this.spriteFrames);
        if (keys.length > 0) {
            const spriteFrame = this.spriteFrames[keys[0]];
            return spriteFrame && spriteFrame.texture;
        } else {
            return null;
        }
    }

    /**
     * @en Gets the [[SpriteFrame]] correspond to the given key in sprite atlas.
     * @zh 根据键值获取精灵。
     *
     * @param key The SpriteFrame name
     * @returns The SpriteFrame asset
     */
    public getSpriteFrame (key: string) {
        const sf = this.spriteFrames[key];
        if (!sf) {
            return null;
        }
        if (!sf.name) {
            sf.name = key;
        }
        return sf;
    }

    /**
     * @en Returns all sprite frames in the sprite atlas.
     * @zh 获取精灵图集所有精灵。
     * @returns All sprite frames
     */
    public getSpriteFrames () {
        const frames: Array<SpriteFrame | null> = [];
        const spriteFrames = this.spriteFrames;

        for (const key of Object.keys(spriteFrames)) {
            frames.push(spriteFrames[key]);
        }

        return frames;
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _serialize (ctxForExporting: any): any {
        if (EDITOR || TEST) {
            const frames: string[] = [];
            for (const key of Object.keys(this.spriteFrames)) {
                const spriteFrame = this.spriteFrames[key];
                let id = spriteFrame ? spriteFrame._uuid : '';
                if (id && ctxForExporting && ctxForExporting._compressUuid) {
                    id = EditorExtends.UuidUtils.compressUuid(id, true);
                }
                frames.push(key);
                frames.push(id);
            }

            return {
                name: this._name,
                spriteFrames: frames,
            };
        }
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _deserialize (serializeData: any, handle: any) {
        const data = serializeData as ISpriteAtlasSerializeData;
        this._name = data.name;
        const frames = data.spriteFrames;
        this.spriteFrames = js.createMap();
        for (let i = 0; i < frames.length; i += 2) {
            handle.result.push(this.spriteFrames, frames[i], frames[i + 1], js._getClassId(SpriteFrame));
        }
    }
}

legacyCC.SpriteAtlas = SpriteAtlas;
