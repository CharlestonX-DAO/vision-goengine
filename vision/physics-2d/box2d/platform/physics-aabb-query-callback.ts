

import b2 from '@cocos/box2d';
import { Vec2 } from '../../../core';

export class PhysicsAABBQueryCallback extends b2.QueryCallback {
    _point = new b2.Vec2();
    _isPoint = false;
    _fixtures: b2.Fixture[] = [];

    init (point?: Vec2) {
        if (point) {
            this._isPoint = true;
            this._point.x = point.x;
            this._point.y = point.y;
        } else {
            this._isPoint = false;
        }

        this._fixtures.length = 0;
    }

    ReportFixture (fixture: b2.Fixture) {
        if (this._isPoint) {
            if (fixture.TestPoint(this._point)) {
                this._fixtures.push(fixture);
            }
        } else {
            this._fixtures.push(fixture);
        }

        // True to continue the query, false to terminate the query.
        return true;
    }

    getFixture () {
        return this._fixtures[0];
    }

    getFixtures () {
        return this._fixtures;
    }
}
