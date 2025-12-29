import { InputElement } from "../InputElement";
import { RuntimeDrawer } from "./RuntimeDrawer";
import { RuntimeDrawerFactory } from "./RuntimeDrawerFactory";

export class IntDrawer extends RuntimeDrawer<number> {
    public readonly inputElement: InputElement;

    constructor(label = "") {
        super(label);
        this.inputElement = new InputElement("number");
        this.inputElement.value = "0";

        this.Add(this.inputElement);

        this.inputElement.on.Input((evt) => {
            const valStr = (evt.target as HTMLInputElement).value;
            const num = Number.parseInt(valStr);
            if (Number.isInteger(num)) {
                this.value = num;
            }
        });

        this.labelContainer.on.MouseDown(() => {
            this.value ??= 0;
            let startValue = this.value;

            const onMouseMove = (e: MouseEvent) => {
                const deltaValue = Math.floor(e.movementX / 4);
                this.value = startValue + deltaValue;
                startValue = this.value;
            };

            const onMouseUp = () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });
    }

    public override Repaint(): void {
        const input = this.inputElement.hierarchy.htmlElement as HTMLInputElement;
        if (Number.isInteger(this.value)) {
            input.value = this.value?.toString() ?? "0";
        } else {
            input.value = "0";
        }
    }

    protected override RepaintLayout(): void {
    }
}

RuntimeDrawerFactory.RegisterDrawer(Number, IntDrawer, false, 9999);
