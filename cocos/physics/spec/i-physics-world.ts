



import { IVec3Like } from '../../core/math/type-define';
import { PhysicsRayResult } from '../framework/physics-ray-result';
import { Ray } from '../../core/geometry';
import { RecyclePool } from '../../core';
import { PhysicsMaterial } from '../framework';

export interface IRaycastOptions {
    mask: number;
    group: number;
    queryTrigger: boolean;
    maxDistance: number;
}

export interface IPhysicsWorld {
    readonly impl: any;
    setGravity: (v: IVec3Like) => void;
    setAllowSleep: (v: boolean) => void;
    setDefaultMaterial: (v: PhysicsMaterial) => void;
    step (fixedTimeStep: number, timeSinceLastCalled?: number, maxSubSteps?: number): void;
    raycast (worldRay: Ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean
    raycastClosest (worldRay: Ray, options: IRaycastOptions, out: PhysicsRayResult): boolean;
    emitEvents (): void;
    syncSceneToPhysics (): void;
    syncAfterEvents (): void;
    destroy (): void;
}
