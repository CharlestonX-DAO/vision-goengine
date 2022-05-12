



import { Game, game } from '../../core';
import { selector } from '../framework/physics-selector';
import { BulletRigidBody } from './bullet-rigid-body';
import { BulletWorld } from './bullet-world';
import { BulletBoxShape } from './shapes/bullet-box-shape';
import { BulletSphereShape } from './shapes/bullet-sphere-shape';
import { BulletCapsuleShape } from './shapes/bullet-capsule-shape';
import { BulletTrimeshShape } from './shapes/bullet-trimesh-shape';
import { BulletCylinderShape } from './shapes/bullet-cylinder-shape';
import { BulletConeShape } from './shapes/bullet-cone-shape';
import { BulletTerrainShape } from './shapes/bullet-terrain-shape';
import { BulletSimplexShape } from './shapes/bullet-simplex-shape';
import { BulletPlaneShape } from './shapes/bullet-plane-shape';
import { BulletP2PConstraint } from './constraints/bullet-p2p-constraint';
import { BulletHingeConstraint } from './constraints/bullet-hinge-constraint';

game.once(Game.EVENT_ENGINE_INITED, () => {
    selector.register('bullet', {
        PhysicsWorld: BulletWorld,
        RigidBody: BulletRigidBody,

        BoxShape: BulletBoxShape,
        SphereShape: BulletSphereShape,
        CapsuleShape: BulletCapsuleShape,
        TrimeshShape: BulletTrimeshShape,
        CylinderShape: BulletCylinderShape,
        ConeShape: BulletConeShape,
        TerrainShape: BulletTerrainShape,
        SimplexShape: BulletSimplexShape,
        PlaneShape: BulletPlaneShape,

        PointToPointConstraint: BulletP2PConstraint,
        HingeConstraint: BulletHingeConstraint,
    });
});
