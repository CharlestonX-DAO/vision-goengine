

import CANNON from '@cocos/cannon';
import '../vision/physics/cannon/instantiate';

if (window) window.CANNON = CANNON;

// polyfill config
(CANNON as any).CC_CONFIG = {
    numSegmentsCone: 12,
    numSegmentsCylinder: 12,
    ignoreSelfBody: true,
    correctInelastic: 3,
};

// overwrite
(CANNON as any).ArrayCollisionMatrix.prototype.reset = function reset () {
    for (const key in this.matrix) {
        delete this.matrix[key];
    }
};

(CANNON.Ray as any).perBodyFilter = function (r: CANNON.Ray, b: CANNON.Body) {
    return ((r as any).collisionFilterMask & b.collisionFilterGroup) !== 0;
};
