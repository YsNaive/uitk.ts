import { CSSFactory } from '../utils/CSSFactory';
import type { Action } from '../utils/Event';
import { SR } from '../utils/SR';
import { StyleManager } from '../utils/StyleManager';
import { VisualElement } from './VisualElement';

CSSFactory.BeginBlock(`.${SR.class.InputElement}`);
CSSFactory.backgroundColor = SR.cssVar.color_background2;
CSSFactory.borderWidth  = "2px";
CSSFactory.borderColor  = SR.cssVar.color_background3;
CSSFactory.borderRadius = "5px";
CSSFactory.outline      = "none";
CSSFactory.height       = SR.cssVar.lineHeight;
CSSFactory.minHeight    = SR.cssVar.lineHeight;
CSSFactory.paddingLeft  = SR.cssVar.textPadding;
CSSFactory.paddingRight = SR.cssVar.textPadding;
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.InputElement}:focus`);
CSSFactory.borderColor  = SR.cssVar.color_foreground1;
CSSFactory.EndBlock();
StyleManager.RegisterCSSBlock(CSSFactory.Build());

class InputElementEventHandler extends VisualElement._EventHandler{
    public Change (callback: Action<[Event]>) { this.apply('change', callback); }
    public Input  (callback: Action<[Event]>) { this.apply('input' , callback); }
    public Unfocus(callback: Action<[]>     ) { this.apply('blur'  , callback); }
}

export class InputElement extends VisualElement {
    constructor(type: string = "text") {
        super(document.createElement('input'));
        this.classList.add(SR.class.InputElement);
        this.classList.add(SR.class.TextElement);

        this.type = type;
    }

    public override get on() : InputElementEventHandler{ return new InputElementEventHandler(this, true ); }
    public override get off(): InputElementEventHandler{ return new InputElementEventHandler(this, false); }

    public get type(): string {
        return (this.hierarchy.htmlElement as HTMLInputElement).type;
    }

    public set type(value: string) {
        (this.hierarchy.htmlElement as HTMLInputElement).type = value;
    }

    public get value(): string {
        return (this.hierarchy.htmlElement as HTMLInputElement).value;
    }

    public set value(value: string) {
        (this.hierarchy.htmlElement as HTMLInputElement).value = value;
    }
}
