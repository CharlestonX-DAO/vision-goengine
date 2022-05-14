

import b2 from '@cocos/box2d';
import { Vec2 } from '../../../core';
import { ERaycast2DType } from '../../framework';

export class PhysicsRayCastCallback extends b2.RayCastCallback {
    _type = ERaycast2DType.Closest;
    _fixtures: b2.Fixture[] = [];
    _points: Vec2[] = [];
    _normals: Vec2[] = [];
    _fractions: number[] = [];

    _mask = 0xffffffff;

    init (type: ERaycast2DType, mask: number) {
        this._type = type;
        this._mask = mask;
        this._fixtures.length = 0;
        this._points.length = 0;
        this._normals.length = 0;
        this._fractions.length = 0;
    }

    ReportFixture (fixture: b2.Fixture, point, normal, fraction) {
        if ((fixture.GetFilterData().categoryBits & this._mask) === 0) {
            return 0;
        }

        if (this._type === ERaycast2DType.Closest) {
            this._fixtures[0] = fixture;
            this._points[0] = point;
            this._normals[0] = normal;
            this._fractions[0] = fraction;
            return fraction;
        }

        this._fixtures.push(fixture);
        this._points.push(new Vec2(point.x, point.y));
        this._normals.push(new Vec2(normal.x, normal.y));
        this._fractions.push(fraction);

        if (this._type === ERaycast2DType.Any) {
            return 0;
        } else if (this._type >= ERaycast2DType.All) {
            return 1;
        }

        return fraction;
    }

    getFixtures () {
        return this._fixtures;
    }

    getPoints () {
        return this._points;
    }

    getNormals () {
        return this._normals;
    }

    getFractions () {
        return this._fractions;
    }
}
