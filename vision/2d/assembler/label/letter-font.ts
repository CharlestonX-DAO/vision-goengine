

import { mixin } from '../../../core/utils/js';
import { Label, LabelOutline } from '../../components';
import { bmfontUtils } from './bmfontUtils';
import { shareLabelInfo, LetterAtlas, computeHash } from './font-utils';

const _atlasWidth = 1024;
const _atlasHeight = 1024;
const _isBold = false;

let _shareAtlas: LetterAtlas | null  = null;

export const letterFont = mixin(bmfontUtils, {
    getAssemblerData () {
        if (!_shareAtlas) {
            _shareAtlas = new LetterAtlas(_atlasWidth, _atlasHeight);
        }

        return _shareAtlas.getTexture();
    },

    _updateFontFamily (comp) {
        shareLabelInfo.fontAtlas = _shareAtlas;
        shareLabelInfo.fontFamily = this._getFontFamily(comp);

        // outline
        const outline = comp.getComponent(LabelOutline);
        if (outline && outline.enabled) {
            shareLabelInfo.isOutlined = true;
            shareLabelInfo.margin = outline.width;
            shareLabelInfo.out = outline.color.clone();
            shareLabelInfo.out.a = outline.color.a * comp.color.a / 255.0;
        } else {
            shareLabelInfo.isOutlined = false;
            shareLabelInfo.margin = 0;
        }
    },

    _getFontFamily (comp: Label) {
        let fontFamily = 'Arial';
        if (!comp.useSystemFont) {
            if (comp.font) {
                fontFamily = comp.font._nativeAsset || 'Arial';
            }
        } else {
            fontFamily = comp.fontFamily || 'Arial';
        }

        return fontFamily;
    },

    _updateLabelInfo (comp) {
        shareLabelInfo.fontDesc = this._getFontDesc();
        shareLabelInfo.color = comp.color;
        shareLabelInfo.hash = computeHash(shareLabelInfo);
    },

    _getFontDesc () {
        let fontDesc = `${shareLabelInfo.fontSize.toString()}px `;
        fontDesc += shareLabelInfo.fontFamily;
        if (_isBold) {
            fontDesc = `bold ${fontDesc}`;
        }

        return fontDesc;
    },
    _computeHorizontalKerningForText () {},
    _determineRect (tempRect) {
        return false;
    },
});
