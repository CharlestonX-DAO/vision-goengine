


import { replaceProperty, removeProperty } from '../utils/x-deprecated';
import { legacyCC } from '../global-exports';

// Deprecated CC polyfill
const polyfills = {
    GFXDevice: true,
    GFXBuffer: true,
    GFXTexture: true,
    GFXSampler: true,
    GFXShader: true,
    GFXInputAssembler: true,
    GFXRenderPass: true,
    GFXFramebuffer: true,
    GFXPipelineState: true,
    GFXCommandBuffer: true,
    GFXQueue: true,
    GFXObjectType: true,
    GFXObject: false,
    GFXAttributeName: true,
    GFXType: true,
    GFXFormat: true,
    GFXBufferUsageBit: true,
    GFXMemoryUsageBit: true,
    GFXBufferFlagBit: true,
    GFXBufferAccessBit: 'MemoryAccessBit',
    GFXPrimitiveMode: true,
    GFXPolygonMode: true,
    GFXShadeModel: true,
    GFXCullMode: true,
    GFXComparisonFunc: true,
    GFXStencilOp: true,
    GFXBlendOp: true,
    GFXBlendFactor: true,
    GFXColorMask: true,
    GFXFilter: true,
    GFXAddress: true,
    GFXTextureType: true,
    GFXTextureUsageBit: true,
    GFXSampleCount: true,
    GFXTextureFlagBit: true,
    GFXShaderStageFlagBit: true,
    GFXDescriptorType: true,
    GFXCommandBufferType: true,
    GFXLoadOp: true,
    GFXStoreOp: true,
    GFXPipelineBindPoint: true,
    GFXDynamicStateFlagBit: true,
    GFXStencilFace: true,
    GFXQueueType: true,
    GFXRect: true,
    GFXViewport: true,
    GFXColor: true,
    GFXClearFlag: true,
    GFXOffset: true,
    GFXExtent: true,
    GFXTextureSubres: 'TextureSubresLayers',
    GFXTextureCopy: true,
    GFXBufferTextureCopy: true,
    GFXFormatType: true,
    GFXFormatInfo: true,
    GFXMemoryStatus: true,
    GFXFormatInfos: true,
    GFXFormatSize: true,
    GFXFormatSurfaceSize: true,
    GFXGetTypeSize: true,
    getTypedArrayConstructor: false,
};
for (const name in polyfills) {
    let newName = polyfills[name];
    if (newName === true) {
        newName = name.slice(3);
    } else if (newName === false) {
        newName = name;
    }
    // Deprecation
    replaceProperty(legacyCC, 'cc', [
        {
            name,
            newName,
            target: legacyCC.gfx,
            targetName: 'cc.gfx',
        },
    ]);
}

removeProperty(legacyCC, 'cc', [
    { name: 'GFX_MAX_VERTEX_ATTRIBUTES' },
    { name: 'GFX_MAX_TEXTURE_UNITS' },
    { name: 'GFX_MAX_ATTACHMENTS' },
    { name: 'GFX_MAX_BUFFER_BINDINGS' },
    { name: 'GFXTextureLayout' },
]);
