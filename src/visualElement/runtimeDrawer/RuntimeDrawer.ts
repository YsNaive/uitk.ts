import { CSSFactory } from "../../utils/CSSFactory";
import { ValueChangedEvent, type Action } from "../../utils/Event";
import { SR } from "../../utils/SR";
import { StyleManager } from "../../utils/StyleManager";
import { TextElement } from "../TextElement";
import { VisualElement } from "../VisualElement";

// drawer
CSSFactory.BeginBlock(`.${SR.class.RuntimeDrawer}`);
CSSFactory.width           = "100%";
CSSFactory.flexDirection   = "row";
CSSFactory.minHeight       = SR.cssVar.lineHeight;
CSSFactory.marginBottom    = SR.cssVar.drawerMargin;
CSSFactory.borderLeftWidth = "2px";
CSSFactory.borderLeftColor = "rgba(0,0,0,0)";
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.RuntimeDrawer}:first-child, :not(.${SR.class.RuntimeDrawer}) + .${SR.class.RuntimeDrawer}`);
CSSFactory.marginTop  = SR.cssVar.drawerMargin;
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.RuntimeDrawer}.${SR.class.Expand}`);
CSSFactory.flexDirection   = "column";
CSSFactory.EndBlock();
// content container
CSSFactory.BeginBlock(`.${SR.class.RuntimeDrawer}>.${SR.class.Container}`);
CSSFactory.flexGrow   = "1";
CSSFactory.flexDirection   = "row";
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.RuntimeDrawer}>.${SR.class.Container}>*`);
CSSFactory.flexGrow   = "1";
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.RuntimeDrawer}.${SR.class.Expand}>.${SR.class.Container}`);
CSSFactory.marginLeft      = `calc(2 * ${SR.cssVar.lineHeight})`;
CSSFactory.flexDirection   = "column";
CSSFactory.EndBlock();
// label & icon
CSSFactory.BeginBlock(`.${SR.class.RD_Label}`);
CSSFactory.minHeight     = SR.cssVar.lineHeight;
CSSFactory.width         = SR.cssVar.labelWidth;
CSSFactory.minWidth      = SR.cssVar.labelWidth;
CSSFactory.maxWidth      = SR.cssVar.labelWidth;
CSSFactory.flexDirection = "row";
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.IconElement}`);
CSSFactory.width     = SR.cssVar.lineHeight;
CSSFactory.height    = SR.cssVar.lineHeight;
CSSFactory.maxWidth  = SR.cssVar.lineHeight;
CSSFactory.maxHeight = SR.cssVar.lineHeight;
CSSFactory.backgroundSize     = "contain";
CSSFactory.backgroundPosition = "center";
CSSFactory.EndBlock();
StyleManager.RegisterCSSBlock(CSSFactory.Build());

class RuntimeDrawerEventHandler<T> extends VisualElement._EventHandler{
    public ValueChanged(callback: Action<[ValueChangedEvent<T | null>]>) { this.apply(SR.event.ValueChanged, callback); }
}

export abstract class RuntimeDrawer<T> extends VisualElement{
    private m_value: T | null = null;

    public readonly m_contentContainer: VisualElement;
    public readonly labelContainer    : VisualElement;
    public readonly labelElement      : TextElement;
    public readonly iconElement       : VisualElement;
    public readonly stateIconElement  : VisualElement;

    public get contentContainer() { return this.m_contentContainer; }

    constructor(label = ""){
        super();
        this.m_contentContainer = new VisualElement();
        this.labelContainer     = new VisualElement();
        this.labelElement       = new TextElement();
        this.iconElement        = new VisualElement();
        this.stateIconElement   = new VisualElement();

        this.classList.add(SR.class.RuntimeDrawer);
        this.m_contentContainer.classList.add(SR.class.Container);
        this.labelContainer    .classList.add(SR.class.RD_Label);
        this.iconElement       .classList.add(SR.class.IconElement);
        this.stateIconElement  .classList.add(SR.class.IconElement);

        this.labelContainer.Add(this.stateIconElement);
        this.labelContainer.Add(this.iconElement);
        this.labelContainer.Add(this.labelElement);
        this.hierarchy.Add(this.labelContainer);
        this.hierarchy.Add(this.m_contentContainer);

        this.label = label;
    }

    public override get on() : RuntimeDrawerEventHandler<T>{ return new RuntimeDrawerEventHandler<T>(this, true ); }
    public override get off(): RuntimeDrawerEventHandler<T>{ return new RuntimeDrawerEventHandler<T>(this, false); }

    public get label()    : string  { return  this.labelElement.text; }
    public set label(value: string | null) { 
        if(this.label === value)
            return;
        if(!value){
            this.hierarchy.Remove(this.labelContainer);
        }
        else{
            this.labelElement.text = value; 
            if(!this.labelContainer.parent)
                this.hierarchy.Insert(0, this.labelContainer);
        }
    }

    /** Repaint your HTMLElement here, you may want to call this func in sub drawer. */
    public    abstract Repaint(): void;
    /** Repaint hierarchy here if you need */
    protected abstract RepaintLayout(): void;

    public NotifyValueChanged(){
        const evt = new ValueChangedEvent<T | null>(this.m_value);
        this.hierarchy.htmlElement.dispatchEvent(evt);
    }

    /** override if you need to process value before set (usually is checking) */
    protected ValidValue(value: T): T { return value; }

    private _setValue(value: T | null, isNotify: boolean, isRepaint: boolean){
        if(value)
            value = this.ValidValue(value);
        if(value === this.m_value)
            return;
        this.m_value = value;
        if(isNotify)
            this.NotifyValueChanged();
        if(isRepaint){
            this.RepaintLayout();
            this.Repaint();
        }
    }

    public get value()    : T | null { return this.m_value; }
    public set value(value: T | null){
        this._setValue(value, true, true);
    }
    public SetValueWithoutNotify(value: T | null){
        this._setValue(value, false, true);
    }
    public SetValueWithoutRepaint(value: T | null){
        this._setValue(value, true, false);
    }

    public LayoutExpand(){
        this.classList.add(SR.class.Expand);
    }
    public LayoutInline(){
        this.classList.remove(SR.class.Expand);
    }
}

/**
 * Act as a container allow you to use as RuntimeDrawer
 */
export class EmptyDrawer extends RuntimeDrawer<null>{
    public constructor(label = ""){
        super(label);
    }

    public    override Repaint(): void { }
    protected override RepaintLayout(): void { }
}