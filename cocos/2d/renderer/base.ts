/**
 * ui 相关模块
 * @module ui
 */

import { Renderable2D } from '../framework/renderable-2d';

export interface IAssembler {
    [key: string]: any;
}

export interface IAssemblerManager {
    getAssembler (component: Renderable2D): IAssembler;
}
