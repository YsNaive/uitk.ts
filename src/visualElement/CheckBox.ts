import { CSSFactory } from "../utils/CSSFactory";
import { ValueChangedEvent, type Action } from "../utils/Event";
import { SR } from "../utils/SR";
import { StyleManager } from "../utils/StyleManager";
import { VisualElement } from "./VisualElement";

CSSFactory.BeginBlock(`.${SR.class.CheckBox}`)
CSSFactory.justifyContent  = 'center';
CSSFactory.alignItems      = 'center';
CSSFactory.backgroundColor = SR.cssVar.color_background2;
CSSFactory.width           = SR.cssVar.lineHeight;
CSSFactory.height          = SR.cssVar.lineHeight;
CSSFactory.maxWidth        = SR.cssVar.lineHeight;
CSSFactory.maxHeight       = SR.cssVar.lineHeight;
CSSFactory.transition      = "0.15s";
CSSFactory.borderWidth     = "2px";
CSSFactory.borderStyle     = "solid";
CSSFactory.borderColor     = SR.cssVar.color_background3;
CSSFactory.borderRadius    = "4px";
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.CheckBox}.true`)
CSSFactory.backgroundColor = SR.cssVar.color_foreground1;
CSSFactory.borderColor     = SR.cssVar.color_foreground2;
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.CheckBox}.true::after`);
CSSFactory.content        = `"\\2714"`;
CSSFactory.fontSize       = `calc(${SR.cssVar.lineHeight} * 0.65)`;
CSSFactory.color          = SR.cssVar.color_background1;
CSSFactory.position       = 'absolute';
CSSFactory.top            = '0';
CSSFactory.left           = '0';
CSSFactory.width          = '100%';
CSSFactory.height         = '100%';
CSSFactory.display        = 'flex';
CSSFactory.justifyContent = 'center';
CSSFactory.alignItems     = 'center';
CSSFactory.EndBlock();
StyleManager.RegisterCSSBlock(CSSFactory.Build());

class CheckBoxEventHandler extends VisualElement._EventHandler{
    public ValueChanged(callback: Action<[ValueChangedEvent<boolean>]>) { this.apply(SR.event.ValueChanged, callback); }
}

export class Checkbox extends VisualElement {
    private  m_value      : boolean = false;
    public get value()    : boolean { return this.m_value; }
    public set value(value: boolean){
        if(this.m_value === value)
            return;
        this.m_value = value;
        this.hierarchy.htmlElement.dispatchEvent(new ValueChangedEvent<boolean>(value));
        if(value)
            this.classList.add("true");
        else
            this.classList.remove("true");
    }
    constructor(){
        super();
        this.classList.add(SR.class.CheckBox);
        this.on.Click(this.doToggle.bind(this));
    }

    public override get on() : CheckBoxEventHandler{ return new CheckBoxEventHandler(this, true ); }
    public override get off(): CheckBoxEventHandler{ return new CheckBoxEventHandler(this, false); }

    private doToggle(evt: MouseEvent){
        if(evt.target !== this.hierarchy.htmlElement)
            return;
        evt.stopImmediatePropagation();
        this.value = !this.value;
    }
}