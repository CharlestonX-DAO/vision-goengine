

/// physics namespace ///

import * as physics from '../vision/physics/framework';
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
} from '../vision/physics/framework';

export type {
    ITriggerEvent,
    ICollisionEvent,
    IContactEquation,
    CollisionEventType,
    CollisionCallback,
    TriggerEventType,
    TriggerCallback,
} from '../vision/physics/framework';

export * from '../vision/physics/framework/deprecated';
