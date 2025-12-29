import type { Action } from '../utils/Event';
import { SR } from '../utils/SR';
import { VisualElement } from './VisualElement';

class TextAreaEventHandler extends VisualElement._EventHandler {
    public Change(callback: Action<[Event]>) { this.apply('change', callback); }
    public Input (callback: Action<[Event]>) { this.apply('input' , callback); }
}

export class TextArea extends VisualElement {
    private m_multiLine = true;

    constructor() {
        super(document.createElement('textarea'));
        this.classList.add(SR.class.InputElement);
        this.classList.add(SR.class.TextElement);

        this.on.Input (this.processValue.bind(this));
        this.on.Change(this.processValue.bind(this));
    }

    public override get on(): TextAreaEventHandler { return new TextAreaEventHandler(this, true); }
    public override get off(): TextAreaEventHandler { return new TextAreaEventHandler(this, false); }

    public get value(): string {
        return (this.hierarchy.htmlElement as HTMLTextAreaElement).value;
    }

    public set value(value: string) {
        (this.hierarchy.htmlElement as HTMLTextAreaElement).value = value;
        this.updateHeight();
    }

    public get multiLine(): boolean {
        return this.m_multiLine;
    }

    public set multiLine(value: boolean) {
        this.m_multiLine = value;
        this.processValue();
        this.style.height = value? 'auto' : "";
    }

    private processValue() {
        const el = this.hierarchy.htmlElement as HTMLTextAreaElement;

        if (!this.m_multiLine) {
            const original = el.value;
            const filtered = original.replace(SR.regex.newLine, '');
            if (original !== filtered) {
                el.value = filtered;
            }
        }

        this.updateHeight();
    }

    private updateHeight() {
        if(!this.multiLine || !this.value.match(SR.regex.newLine)){
            this.style.height = "";
            return;
        }
        this.style.height = 'auto';
        this.style.height = `${this.hierarchy.htmlElement.scrollHeight+4}px`;
    }
}
