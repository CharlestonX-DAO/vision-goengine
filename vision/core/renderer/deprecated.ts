

import { replaceProperty, removeProperty } from '../utils/x-deprecated';
import { RenderScene } from './core/render-scene';
import { Layers } from '../scene-graph/layers';
import { legacyCC } from '../global-exports';
import { Pass } from './core/pass';
import { Camera } from './scene/camera';
import { Shadows } from './scene/shadows';

removeProperty(RenderScene.prototype, 'RenderScene.prototype', [
    { name: 'raycastUI2DNode' },
    { name: 'raycastUINode' },
]);

removeProperty(RenderScene.prototype, 'RenderScene.prototype', [
    { name: 'raycastAll', suggest: 'using intersect.rayModel in geometry' },
    { name: 'raycastAllModels', suggest: 'using intersect.rayModel in geometry' },
    { name: 'raycastSingleModel', suggest: 'using intersect.rayModel in geometry' },
    { name: 'raycastAllCanvas', suggest: 'using intersect.rayAABB in geometry' },
    { name: 'rayResultCanvas' },
    { name: 'rayResultModels' },
    { name: 'rayResultAll' },
    { name: 'rayResultSingleModel' },
]);

const CameraVisFlags = {};

removeProperty(CameraVisFlags, 'CameraVisFlags', [
    {
        name: 'GENERAL',
    },
]);

replaceProperty(CameraVisFlags, 'CameraVisFlags', [
    {
        name: 'PROFILER',
        newName: 'PROFILER',
        target: Layers.BitMask,
        targetName: 'PROFILER',
    },
    {
        name: 'GIZMOS',
        newName: 'GIZMOS',
        target: Layers.BitMask,
        targetName: 'GIZMOS',
    },
    {
        name: 'EDITOR',
        newName: 'EDITOR',
        target: Layers.BitMask,
        targetName: 'EDITOR',
    },
    {
        name: 'UI',
        newName: 'UI',
        target: Layers.BitMask,
        targetName: 'UI_3D',
    },
    {
        name: 'UI2D',
        newName: 'UI2D',
        target: Layers.BitMask,
        targetName: 'UI_2D',
    },
]);

legacyCC.CameraVisFlags = CameraVisFlags;

export { CameraVisFlags };

const VisibilityFlags = {};

removeProperty(VisibilityFlags, 'VisibilityFlags', [
    {
        name: 'GENERAL',
    },
]);

replaceProperty(VisibilityFlags, 'VisibilityFlags', [
    {
        name: 'ALWALS',
        newName: 'ALWALS',
        target: Layers.Enum,
        targetName: 'ALWALS',
    },
    {
        name: 'PROFILER',
        newName: 'PROFILER',
        target: Layers.Enum,
        targetName: 'PROFILER',
    },
    {
        name: 'GIZMOS',
        newName: 'GIZMOS',
        target: Layers.Enum,
        targetName: 'GIZMOS',
    },
    {
        name: 'EDITOR',
        newName: 'EDITOR',
        target: Layers.Enum,
        targetName: 'EDITOR',
    },
    {
        name: 'UI',
        newName: 'UI',
        target: Layers.Enum,
        targetName: 'UI_3D',
    },
    {
        name: 'UI2D',
        newName: 'UI2D',
        target: Layers.Enum,
        targetName: 'UI_2D',
    },
]);

legacyCC.VisibilityFlags = VisibilityFlags;

export { VisibilityFlags };

replaceProperty(Pass.prototype, 'Pass.prototype', [
    {
        name: 'getBindingTypeFromHandle',
        newName: 'getDescriptorTypeFromHandle',
    },
]);

removeProperty(Camera.prototype, 'Camera.prototype', [
    {
        name: 'getSplitFrustum',
    },
    {
        name: 'setMatView',
    },
    {
        name: 'setMatViewInv',
    },
    {
        name: 'setMatProjInv',
    },
    {
        name: 'setMatViewProjInv',
    },
    {
        name: 'setMatProj',
    },
    {
        name: 'setMatViewProj',
    },
    {
        name: 'getMatViewInv',
    },
]);

removeProperty(Shadows.prototype, 'Shadows.prototype', [
    {
        name: 'aspect',
    },
    {
        name: 'selfShadow',
    },
    {
        name: 'linear',
    },
    {
        name: 'packing',
    },
    {
        name: 'autoAdapt',
    },
    {
        name: 'fixedArea',
    },
    {
        name: 'pcf',
    },
    {
        name: 'bias',
    },
    {
        name: 'normalBias',
    },
    {
        name: 'near',
    },
    {
        name: 'far',
    },
    {
        name: 'shadowDistance',
    },
    {
        name: 'invisibleOcclusionRange',
    },
    {
        name: 'orthoSize',
    },
    {
        name: 'saturation',
    },
]);
