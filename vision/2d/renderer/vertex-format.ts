

import { AttributeName, Format, FormatInfos, Attribute } from '../../core/gfx';
import { legacyCC } from '../../core/global-exports';

export const vfmt = [
    new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),
];

export const vfmtPosColor = [
    new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),
    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA32F),
];

export const vfmtPosUvColor = [
    new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),
    new Attribute(AttributeName.ATTR_TEX_COORD, Format.RG32F),
    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA32F),
];

export const vfmtPosUvTwoColor = [
    new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),
    new Attribute(AttributeName.ATTR_TEX_COORD, Format.RG32F),
    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA32F),
    new Attribute(AttributeName.ATTR_COLOR2, Format.RGBA32F),
];

export function getComponentPerVertex (attrs: Attribute[]) {
    let count = 0;
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        const info = FormatInfos[attr.format];
        count += info.count;
    }

    return count;
}

export function getAttributeStride (attrs: Attribute[]) {
    let count = 0;
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        const info = FormatInfos[attr.format];
        count += info.size;
    }

    return count;
}

legacyCC.internal.vfmtPosUvColor = vfmtPosUvColor;
legacyCC.internal.vfmtPosUvTwoColor = vfmtPosUvTwoColor;
