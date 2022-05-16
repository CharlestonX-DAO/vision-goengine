

import { ActionInstant } from './actions/action-instant';

export class SetAction extends ActionInstant {
    private _props: any;

    constructor (props?: any) {
        super();
        this._props = {};
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        props !== undefined && this.init(props);
    }

    init (props) {
        for (const name in props) {
            this._props[name] = props[name];
        }
        return true;
    }

    update () {
        const props = this._props;
        const target = this.target;
        for (const name in props) {
            target![name] = props[name];
        }
    }

    clone () {
        const action = new SetAction();
        action.init(this._props);
        return action;
    }
}
