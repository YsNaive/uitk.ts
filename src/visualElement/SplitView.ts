import { CSSFactory } from "../utils/CSSFactory";
import { UpdateScheduler } from "../utils/Scheduler";
import { SR } from "../utils/SR";
import { StyleManager } from "../utils/StyleManager";
import { VisualElement } from "./VisualElement";

const dragLineClass = SR.class.RequestUniqueClass();

CSSFactory.BeginBlock(`.${SR.class.SplitView}`);
CSSFactory.flexGrow = "1";
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${dragLineClass}`);
CSSFactory.backgroundColor = SR.cssVar.color_background3;
CSSFactory.position = "absolute";
CSSFactory.height   = "4px";
CSSFactory.width    = "100%";
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${dragLineClass}.${SR.class.Horizontal}`);
CSSFactory.height   = "100%";
CSSFactory.width    = "4px";
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${dragLineClass}:not(.${SR.class.Locked}):hover`);
CSSFactory.backgroundColor = SR.cssVar.color_foreground1;
CSSFactory.EndBlock();
StyleManager.RegisterCSSBlock(CSSFactory.Build());

export class SplitView extends VisualElement {
    private m_layoutUpdater: UpdateScheduler;

    private  m_contentContainer    : VisualElement;
    public get contentContainer()  : VisualElement { return this.m_contentContainer; }
    public readonly dragLineElement: VisualElement;

    private  m_minFixedSize      : number = 50;
    public get minFixedSize()    : number  { return this.m_minFixedSize; }
    public set minFixedSize(value: number) { 
        this.m_minFixedSize = value; 
        this.fixedSize = this.m_fixedSize;
    }
    private  m_minFlexSize: number = 50;
    public get minFlexSize()    : number  { return this.m_minFlexSize; }
    public set minFlexSize(value: number) { 
        this.m_minFlexSize = value; 
        this.fixedSize = this.m_fixedSize;
    }

    private  m_fixedSize      : number = 0;
    public get fixedSize()    : number { return this.m_fixedSize; }
    public set fixedSize(value: number){
        const limit = this._getDragLimit();
        const clampValue = this.m_isReverse?
            Math.max(this.m_minFlexSize, Math.min(limit - this.m_minFixedSize, value)):
            Math.min(limit - this.m_minFlexSize, Math.max(this.m_minFixedSize, value));
        
        if(this.m_fixedSize === clampValue) return;
        this.m_fixedSize = clampValue;
        this.m_layoutUpdater.MarkDirty();
    }

    private  m_isResizable      : boolean = true;
    public get isResizable()    : boolean  { return this.m_isResizable; };
    public set isResizable(value: boolean) { 
        if(value === this.m_isResizable)
            return;
        this.m_isResizable = value;
        if(value)
            this.dragLineElement.classList.remove(SR.class.Locked);
        else
            this.dragLineElement.classList.add(SR.class.Locked);
    };

    // layout in row or colume
    private  m_isHorizontal      : boolean = false;
    public get isHorizontal()    : boolean { return this.m_isHorizontal; }
    public set isHorizontal(value: boolean){
        if(this.m_isHorizontal === value) return;
        this.m_isHorizontal = value;

        if(value){
            this.contentContainer.classList.add(SR.class.FlexRow);
            this.dragLineElement .classList.add(SR.class.Horizontal);
        }
        else{
            this.contentContainer.classList.remove(SR.class.FlexRow);
            this.dragLineElement .classList.remove(SR.class.Horizontal);
        }
        this.m_layoutUpdater.MarkDirty();
    }
    
    // fixed item at begin or end
    private  m_isReverse      : boolean = false;
    public get isReverse()    : boolean { return this.m_isReverse; }
    public set isReverse(value: boolean){
        if(this.m_isReverse === value) return;
        this.m_isReverse = value;
        this.m_layoutUpdater.MarkDirty();
    }

    public get fixedElement(): VisualElement | null{
        return this.ChildAt(this.m_isReverse? 1 : 0);
    }
    public get flexElement(): VisualElement | null{
        return this.ChildAt(this.m_isReverse? 0 : 1);
    }

    constructor(){
        super();
        this.classList.add(SR.class.SplitView);
        this.m_contentContainer = new VisualElement();
        this.m_contentContainer.classList.add(SR.class.FlexFill);
        this.dragLineElement    = new VisualElement();
        this.dragLineElement.classList.add(dragLineClass);

        this.hierarchy.Add(this.m_contentContainer);
        this.hierarchy.Add(this.dragLineElement);

        this.m_layoutUpdater = new UpdateScheduler(this._resolveLayout.bind(this));
        this.on.GeometryChanged(()=>{
            this.fixedSize = this.m_fixedSize;
            this._resolveLayout();
        });
        this.dragLineElement.on.MouseDown(this._onDragStart.bind(this));
    }

    private _clearStyle(element: VisualElement){
        element.style.width    = "";
        element.style.height   = "";
        element.style.flexGrow = "0";
    }
    private _setFixed(element: VisualElement){
        if(this.m_isHorizontal){
            element.style.width  = `${this.m_fixedSize}px`;
        }
        else{
            element.style.height = `${this.m_fixedSize}px`;
        }
    }
    private _setFlex(element: VisualElement){
        element.style.flexGrow = "1";
    }
    private _getDragLimit(){
        if(this.m_isHorizontal)
            return this.clientRect.width;
        else
            return this.clientRect.height;
    }
    private _resolveLayout(): void{
        const fixed = this.fixedElement;
        const flex  = this.flexElement;
        const pos = `${(this.m_isReverse? this._getDragLimit() - this.m_fixedSize : this.m_fixedSize) - 2}px`;
        if(this.m_isHorizontal){
            this.dragLineElement.style.left = pos;
            this.dragLineElement.style.top  = "";
        }else{
            this.dragLineElement.style.left = "";
            this.dragLineElement.style.top  = pos;
        }

        if(!fixed) return;
        this._clearStyle(fixed);
        this._setFixed  (fixed);

        if(!flex)  return;
        this._clearStyle(flex);
        this._setFlex   (flex);
    }

    private _onDragStart(e: MouseEvent) {
        if(!this.m_isResizable)
            return;
        e.preventDefault();
        const bound = this.clientRect;

        const onMove = (moveEvent: MouseEvent) => {
            const pos = this.m_isHorizontal ? moveEvent.clientX - bound.left : moveEvent.clientY - bound.top;
            this.fixedSize = this.m_isReverse ? (this.m_isHorizontal ? bound.width : bound.height) - pos : pos;
        };

        const onUp = () => {
            window.removeEventListener("mousemove" , onMove);
            window.removeEventListener("mouseup"   , onUp  );
            window.removeEventListener("mouseleave", onUp  );
        };

        window.addEventListener("mousemove" , onMove);
        window.addEventListener("mouseup"   , onUp  );
        window.addEventListener("mouseleave", onUp  );
    }

    public override Add(ve: VisualElement) {
        if(this.childrenCount >= 2)
            throw new Error("[SplitView] can only has 2 child as fixed/flex item");
        super.Add(ve);
    }

    public override Insert(index: number, ve: VisualElement) {
        if(this.childrenCount >= 2)
            throw new Error("[SplitView] can only has 2 child as fixed/flex item");
        super.Insert(index, ve);
    }

    public override Remove(ve: VisualElement) {
        super.Remove(ve);
    }

    public override Clear() {
        super.Clear();
    }
}
