

/**
 * @packageDocumentation
 * @module tiledmap
 */

import { ccclass, type, serializable } from 'cc.decorator';
import { Asset } from '../core/assets/asset';
import { CCString, Size, TextAsset } from '../core';
import { SpriteFrame } from '../2d/assets';
/**
 * Class for tiled map asset handling.
 * @class TiledMapAsset
 * @extends Asset
 *
 */
@ccclass('cc.TiledMapAsset')
export class TiledMapAsset extends Asset {
    @serializable
    tmxXmlStr = '';

    @serializable
    @type([TextAsset])
    tsxFiles: TextAsset[] = [];

    @serializable
    @type([CCString])
    tsxFileNames: string[] = [];

    /**
     * @zh s
     */
    @serializable
    @type([SpriteFrame])
    spriteFrames: SpriteFrame[] = [];

    /**
     * @property {SpriteFrame[]} imageLayerSpriteFrame
     */
    @serializable
    @type([SpriteFrame])
    imageLayerSpriteFrame: SpriteFrame[] = []

    /**
     * @property {String[]} imageLayerTextureNames
     */
    @serializable
    @type([CCString])
    imageLayerSpriteFrameNames: string[] = [];

    /**
     * @property {String[]} spriteFrameNames
     */
    @serializable
    @type([CCString])
    spriteFrameNames: string[] = [];

    /**
     * @property {Size[]} spriteFrameSizes
     */
    @serializable
    @type([Size])
    spriteFrameSizes: Size[] = [];
}
