
import { EditBox } from './edit-box';

export class EditBoxImplBase {
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _editing = false;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _delegate: EditBox | null = null;

    public init (delegate: EditBox) {}

    public onEnable () {}

    public update () { }

    public onDisable () {
        if (this._editing) {
            this.endEditing();
        }
    }

    public clear () {
        this._delegate = null;
    }

    public setTabIndex (index: number) {}

    public setSize (width: number, height: number) {}

    public setFocus (value) {
        if (value) {
            this.beginEditing();
        } else {
            this.endEditing();
        }
    }

    public isFocused () {
        return this._editing;
    }

    public beginEditing () {}

    public endEditing () {}
}
