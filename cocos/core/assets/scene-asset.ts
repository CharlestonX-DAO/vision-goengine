

/**
 * @packageDocumentation
 * @module asset
 */

import { ccclass, editable, serializable } from 'cc.decorator';
import { Scene } from '../scene-graph';
import { Asset } from './asset';
import { legacyCC } from '../global-exports';

/**
 * @en Class for scene loading.
 * @zh 场景资源类。
 *
 */
@ccclass('cc.SceneAsset')
export class SceneAsset extends Asset {
    /**
     * @en The scene node
     * @zh 场景节点。
     */
    @editable
    @serializable
    public scene: Scene | null = null;

    public initDefault (uuid?: string) {
        super.initDefault(uuid);
        this.scene = new Scene('New Scene');
    }

    public validate () {
        return !!this.scene;
    }
}

legacyCC.SceneAsset = SceneAsset;
