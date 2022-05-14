

import b2 from '@cocos/box2d';
import { remove } from '../../../core/utils/array';

export class PhysicsContactListener extends b2.ContactListener {
    _contactFixtures: b2.Fixture[] = [];

    _BeginContact: Function | null = null;
    _EndContact: Function | null = null;
    _PreSolve: Function | null = null;
    _PostSolve: Function | null = null;

    setBeginContact (cb) {
        this._BeginContact = cb;
    }

    setEndContact (cb) {
        this._EndContact = cb;
    }

    setPreSolve (cb) {
        this._PreSolve = cb;
    }

    setPostSolve (cb) {
        this._PostSolve = cb;
    }

    BeginContact (contact: b2.Contact) {
        if (!this._BeginContact) return;

        const fixtureA = contact.GetFixtureA();
        const fixtureB = contact.GetFixtureB();
        const fixtures = this._contactFixtures;

        (contact as any)._shouldReport = false;

        if (fixtures.indexOf(fixtureA) !== -1 || fixtures.indexOf(fixtureB) !== -1) {
            (contact as any)._shouldReport = true; // for quick check whether this contact should report
            this._BeginContact(contact);
        }
    }

    EndContact (contact: b2.Contact) {
        if (this._EndContact && (contact as any)._shouldReport) {
            (contact as any)._shouldReport = false;
            this._EndContact(contact);
        }
    }

    PreSolve (contact: b2.Contact, oldManifold: b2.Manifold) {
        if (this._PreSolve && (contact as any)._shouldReport) {
            this._PreSolve(contact, oldManifold);
        }
    }

    PostSolve (contact: b2.Contact, impulse: b2.ContactImpulse) {
        if (this._PostSolve && (contact as any)._shouldReport) {
            this._PostSolve(contact, impulse);
        }
    }

    registerContactFixture (fixture) {
        this._contactFixtures.push(fixture);
    }

    unregisterContactFixture (fixture) {
        remove(this._contactFixtures, fixture);
    }
}
