
import { CSSFactory } from "../utils/CSSFactory";
import { EventHandler, type Action, type GeometryChangedEvent } from "../utils/Event";
import { SR } from "../utils/SR";
import { StyleManager } from "../utils/StyleManager";
import { VisualElement } from "./VisualElement";

CSSFactory.BeginBlock(`.${SR.class.PopupBackdrop}`);
CSSFactory.position = "fixed";
CSSFactory.width    = "100vw";
CSSFactory.height   = "100vh";
CSSFactory.left     = "0px";
CSSFactory.top      = "0px";
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.PopupBackdrop}>*`);
CSSFactory.position = "absolute";
CSSFactory.EndBlock();
StyleManager.RegisterCSSBlock(CSSFactory.Build());

export class PopupBackdrop extends VisualElement{
    public  dstVisualTree: VisualElement;
    public  readonly onRepaint: EventHandler;
    private readonly m_observer: ResizeObserver;

    public closeOnClick = true;

    constructor(dstTree: VisualElement) {
        super();
        this.classList.add(SR.class.PopupBackdrop);
        this.dstVisualTree = dstTree;
        this.onRepaint  = new EventHandler();
        this.m_observer = new ResizeObserver(()=>{ this.onRepaint.Invoke(); });
        this.m_observer.observe(this.hierarchy.htmlElement);
        this.on.Click((evt)=>{
            if(evt.target !== this.hierarchy.htmlElement)
                return;
            if(this.closeOnClick)
                this.Clear();
        });
    }

    public override Add(ve: VisualElement) {
        this.m_observer.observe(ve.hierarchy.htmlElement);
        super.Add(ve);
        if(!this.parent)
            this.dstVisualTree.rootElement.Add(this);
    }

    public override Insert(index: number, ve: VisualElement) {
        this.m_observer.observe(ve.hierarchy.htmlElement);
        super.Insert(index, ve);
        if(!this.parent)
            this.dstVisualTree.rootElement.Add(this);
    }

    public override Remove(ve: VisualElement) {
        this.m_observer.unobserve(ve.hierarchy.htmlElement);
        super.Remove(ve);
        if(this.childrenCount === 0)
            this.parent?.Remove(this);
    }

    public override Clear() {
        for(let ve of this.Children())
            this.m_observer.unobserve(ve.hierarchy.htmlElement);
        super.Clear();
        this.parent?.Remove(this);
    }
}