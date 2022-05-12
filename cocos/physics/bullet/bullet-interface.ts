



import { BulletShape } from './shapes/bullet-shape';

export interface IBulletBodyStruct {
    readonly id: number;
    readonly body: Bullet.ptr;
    readonly compound: Bullet.ptr;
    readonly motionState: Bullet.ptr;
    readonly wrappedShapes: BulletShape[];
    useCompound: boolean;
}

export interface IBulletGhostStruct {
    readonly id: number;
    readonly ghost: Bullet.ptr;
    readonly compound: Bullet.ptr;
    readonly wrappedShapes: BulletShape[];
}
