

/// physics namespace ///

import * as physics from '../cocos/physics/framework';
import { cclegacy } from './base';

export { physics };
cclegacy.physics = physics;

/// cc namespace ///

export {
    PhysicsSystem,
    RigidBody,
    ConstantForce,
    PhysicsMaterial,
    PhysicsRayResult,

    Collider,
    BoxCollider,
    SphereCollider,
    CapsuleCollider,
    MeshCollider,
    CylinderCollider,
    ConeCollider,
    TerrainCollider,
    SimplexCollider,
    PlaneCollider,

    Constraint,
    HingeConstraint,
    PointToPointConstraint,

    EAxisDirection,
    ERigidBodyType,
} from '../cocos/physics/framework';

export type {
    ITriggerEvent,
    ICollisionEvent,
    IContactEquation,
    CollisionEventType,
    CollisionCallback,
    TriggerEventType,
    TriggerCallback,
} from '../cocos/physics/framework';

export * from '../cocos/physics/framework/deprecated';
