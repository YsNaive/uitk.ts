import { Checkbox } from "../CheckBox";
import { RuntimeDrawer } from "./RuntimeDrawer";
import { RuntimeDrawerFactory } from "./RuntimeDrawerFactory";

export class BoolDrawer extends RuntimeDrawer<boolean> {
    public readonly checkBox: Checkbox;

    constructor(label: string = '') {
        super();
        this.label = label;

        this.checkBox = new Checkbox();
        this.Add(this.checkBox);

        this.checkBox.on.ValueChanged((evt) => {
            evt.stopImmediatePropagation();
            this.value = evt.value;
        });
    }

    protected override RepaintLayout(): void { }
    public    override Repaint(): void {
        this.value ??= false;
        this.checkBox.value = this.value;
    }

}

RuntimeDrawerFactory.RegisterDrawer(Boolean, BoolDrawer, false, 9999);
