



export enum EBtSharedBodyDirty {
    BODY_RE_ADD = 1,
    GHOST_RE_ADD = 2,
}

export enum btCollisionFlags {
    CF_STATIC_OBJECT = 1,
    CF_KINEMATIC_OBJECT = 2,
    CF_NO_CONTACT_RESPONSE = 4,
    CF_CUSTOM_MATERIAL_CALLBACK = 8, // this allows per-triangle material (friction/restitution)
    CF_CHARACTER_OBJECT = 16,
    CF_DISABLE_VISUALIZE_OBJECT = 32, // disable debug drawing
    CF_DISABLE_SPU_COLLISION_PROCESSING = 64// disable parallel/SPU processing
}

export enum btCollisionObjectTypes {
    CO_COLLISION_OBJECT = 1,
    CO_RIGID_BODY = 2,
    /// CO_GHOST_OBJECT keeps track of all objects overlapping its AABB and that pass its collision filter
    /// It is useful for collision sensors, explosion objects, character controller etc.
    CO_GHOST_OBJECT = 4,
    CO_SOFT_BODY = 8,
    CO_HF_FLUID = 16,
    CO_USER_TYPE = 32,
    CO_FEATHERSTONE_LINK = 64
}

export enum btCollisionObjectStates {
    ACTIVE_TAG = 1,
    ISLAND_SLEEPING = 2,
    WANTS_DEACTIVATION = 3,
    DISABLE_DEACTIVATION = 4,
    DISABLE_SIMULATION = 5,
}

export enum btRigidBodyFlags {
    BT_DISABLE_WORLD_GRAVITY = 1,
    /// The BT_ENABLE_GYROPSCOPIC_FORCE can easily introduce instability
    /// So generally it is best to not enable it.
    /// If really needed, run at a high frequency like 1000 Hertz:
    /// See Demos/GyroscopicDemo for an example use
    BT_ENABLE_GYROPSCOPIC_FORCE = 2
}
