import { CSSFactory } from "../utils/CSSFactory";
import { GeometryChangedEvent, ValueChangedEvent, type Action } from "../utils/Event";
import type { IHierarchyNode } from "../utils/Hierarchy";
import { SR } from "../utils/SR";
import { StyleManager } from "../utils/StyleManager";
import { Theme } from "../utils/Theme";

CSSFactory.BeginBlock(`.${SR.class.VisualElement}`);
CSSFactory.padding       = "0px";
CSSFactory.margin        = "0px";
CSSFactory.display       = "flex";
CSSFactory.position      = "relative";
CSSFactory.flexDirection = "column";
CSSFactory.userSelect    = "none";
CSSFactory.overflow      = "hidden";
CSSFactory.flexShrink    = "0";
CSSFactory.boxSizing     = "border-box";
CSSFactory.borderStyle   = "solid";
CSSFactory.borderWidth   = "0px";
CSSFactory.resize        = "none";
CSSFactory.EndBlock()
CSSFactory.BeginBlock(`.${SR.class.FlexRow}`);
CSSFactory.flexDirection = "row";
CSSFactory.EndBlock()
CSSFactory.BeginBlock(`.${SR.class.FlexFill}`);
CSSFactory.flexGrow   = "1";
CSSFactory.flexShrink = "1";
CSSFactory.flexBasis  = "0";
CSSFactory.minWidth   = "0";
CSSFactory.minHeight  = "0";
CSSFactory.EndBlock()
StyleManager.RegisterCSSBlock(CSSFactory.Build())

class VisualElementEventHandler {
    protected readonly target: VisualElement;
    protected readonly isAdd: boolean;

    constructor(target: VisualElement, isAdd: boolean) {
        this.target = target;
        this.isAdd = isAdd;
    }

    protected apply(event: string, callback: Action<any>) {
        if (this.isAdd)
            this.target.hierarchy.htmlElement.addEventListener(event, callback);
        else
            this.target.hierarchy.htmlElement.removeEventListener(event, callback);
    }

    public Click      (callback: Action<[MouseEvent]>) { this.apply("click"      , callback); }

    public DblClick   (callback: Action<[MouseEvent]>) { this.apply("dblclick"   , callback); }

    public MouseDown  (callback: Action<[MouseEvent]>) { this.apply("mousedown"  , callback); }

    public MouseUp    (callback: Action<[MouseEvent]>) { this.apply("mouseup"    , callback); }

    public MouseEnter (callback: Action<[MouseEvent]>) { this.apply("mouseenter" , callback); }

    public MouseLeave (callback: Action<[MouseEvent]>) { this.apply("mouseleave" , callback); }

    public MouseOver  (callback: Action<[MouseEvent]>) { this.apply("mouseover"  , callback); }

    public MouseOut   (callback: Action<[MouseEvent]>) { this.apply("mouseout"   , callback); }

    public MouseMove  (callback: Action<[MouseEvent]>) { this.apply("mousemove"  , callback); }

    public ContextMenu(callback: Action<[MouseEvent]>) { this.apply("contextmenu", callback); }

    public Wheel      (callback: Action<[WheelEvent]>) { this.apply("wheel"      , callback); }

    public GeometryChanged(callback: Action<[GeometryChangedEvent]>) {
        interface IGeometryObInfo {
            ob: ResizeObserver;
            callbacks: Set<Action<[GeometryChangedEvent]>>;
        }
        
        const htmlTarget = this.target.hierarchy.htmlElement;
        let info = (this.target as any)[SR.dynamicField.GeometryObInfo] as IGeometryObInfo

        if (this.isAdd) { // add
            if (!info) {
                info = {
                    ob: new ResizeObserver(([entry]) => {
                        htmlTarget.dispatchEvent(new GeometryChangedEvent(entry.contentRect));
                    }),
                    callbacks: new Set()
                }
                info.ob.observe(htmlTarget);
                (this.target as any)[SR.dynamicField.GeometryObInfo] = info;
            }
            this.apply(SR.event.GeometryChanged, callback);
            info.callbacks.add(callback);
        } 
        else { // remove
            if (!info) return;

            this.apply(SR.event.GeometryChanged, callback);
            info.callbacks.delete(callback);

            if (info.callbacks.size === 0) {
                info.ob.disconnect();
                delete (this.target as any)[SR.dynamicField.GeometryObInfo];
            }
        }
    }
}

class VisualElementHierarchy implements IHierarchyNode<VisualElement>{
    public readonly htmlElement: HTMLElement;

    constructor(element: HTMLElement){
        this.htmlElement = element;
    }

    public Add(ve: VisualElement){
        this.htmlElement.appendChild(ve.hierarchy.htmlElement);
    }
    
    public Insert(index: number, ve: VisualElement) {
        const children = this.htmlElement.children;
        if (index >= children.length) {
            this.htmlElement.appendChild(ve.hierarchy.htmlElement);
        } else {
            this.htmlElement.insertBefore(ve.hierarchy.htmlElement, children[index]);
        }
    }

    public Remove(ve: VisualElement) {
        if (this.htmlElement.contains(ve.hierarchy.htmlElement)) {
            this.htmlElement.removeChild(ve.hierarchy.htmlElement);
        }
    }

    public Clear() {
        while (this.htmlElement.firstChild) {
            this.htmlElement.removeChild(this.htmlElement.firstChild);
        }
    }

    public IndexOf(ve: VisualElement): number{
        let i = 0;
        for(let child of this.htmlElement.children){
            if(child === ve.hierarchy.htmlElement)
                return i;
            i++;
        }
        return -1;
    }

    public ChildAt(index: number): VisualElement | null{
        if(index < 0 || index >= this.childrenCount)
            return null;
        return (this.htmlElement.children[index] as any)[SR.dynamicField.VisualElement];
    }

    public *Children(): IterableIterator<VisualElement> {
        for (let i = 0; i < this.htmlElement.children.length; i++) {
            yield (this.htmlElement.children[i] as any)[SR.dynamicField.VisualElement];
        }
    }

    public *ChildrenRecursive(): IterableIterator<VisualElement> {
        for (let i = 0; i < this.htmlElement.children.length; i++) {
            const childVE = (this.htmlElement.children[i] as any)[SR.dynamicField.VisualElement];
            yield childVE;
            yield* childVE.hierarchy.ChildrenRecursive();
        }
    }

    public get childrenCount(): number {
        return this.htmlElement.childElementCount;
    }

    public get parent(): VisualElement | null {
        const parentElement = this.htmlElement.parentElement;
        return parentElement ? (parentElement as any)[SR.dynamicField.VisualElement] ?? null : null;
    }
}

export class VisualElement implements IHierarchyNode<VisualElement>{
    public static _HierarchyHandler = VisualElementHierarchy;
    public static _EventHandler = VisualElementEventHandler;

    public readonly hierarchy: VisualElementHierarchy;

    public get contentContainer(): VisualElement { return this; }

    constructor(htmlElement?: HTMLElement){
        this.hierarchy = new VisualElementHierarchy(htmlElement?? document.createElement('div'));
        (this.hierarchy.htmlElement as any)[SR.dynamicField.VisualElement] = this;

        this.classList.add(SR.class.VisualElement);
    }

    //#region HTMLElement operate

    public get style(): CSSStyleDeclaration { return this.hierarchy.htmlElement.style; }

    public get classList(): DOMTokenList { return this.hierarchy.htmlElement.classList; }

    public get on (){ return new VisualElementEventHandler(this, true ); }
    public get off(){ return new VisualElementEventHandler(this, false); }

    public get clientRect(): DOMRect { return this.hierarchy.htmlElement.getBoundingClientRect(); }

    public get prevElement(): VisualElement | null{
        return (this.hierarchy.htmlElement.previousElementSibling as any)?.[SR.dynamicField.VisualElement]
    }

    public get nextElement(): VisualElement | null{
        return (this.hierarchy.htmlElement.nextElementSibling as any)?.[SR.dynamicField.VisualElement]
    }

    public SetTheme(theme: Theme){
        this.hierarchy.htmlElement.className = Array
            .from(this.hierarchy.htmlElement.classList)
            .filter(name => !name.startsWith(SR.class.ThemePrefix))
            .join(' ');
        this.classList.add(theme.cssClassName);
    }

    //#endregion 

    //#region Hierarchy operate

    // logical parent, real parent is this.hierarchy.parent
    private m_logicalParent: VisualElement | null = null;

    public Add(ve: VisualElement) {
        ve.m_logicalParent = this;
        this._add(ve);
    }

    private _add(ve: VisualElement) {
        if (this.contentContainer === this) {
            this.hierarchy.Add(ve);
        } else {
            this.contentContainer._add(ve);
        }
    }

    public Insert(index: number, ve: VisualElement) {
        ve.m_logicalParent = this;
        this._insert(index, ve);
    }

    private _insert(index: number, ve: VisualElement) {
        if (this.contentContainer === this) {
            this.hierarchy.Insert(index, ve);
        } else {
            this.contentContainer._insert(index, ve);
        }
    }

    public Remove(ve: VisualElement) {
        if (this.contentContainer === this) {
            this.hierarchy.Remove(ve);
            ve.m_logicalParent = null;
        } else {
            this.contentContainer.Remove(ve);
        }
    }

    public Clear() {
        if (this.contentContainer === this) {
            // clear logical parent
            for (const child of this.hierarchy.Children()) {
                child.m_logicalParent = null;
            }
            this.hierarchy.Clear();
        } else {
            this.contentContainer.Clear();
        }
    }

    public IndexOf(ve: VisualElement): number{
        if (this.contentContainer === this) {
            return this.hierarchy.IndexOf(ve);
        } else {
            return this.contentContainer.IndexOf(ve);
        }
    }

    public ChildAt(index: number): VisualElement | null{
        if (this.contentContainer === this) {
            return this.hierarchy.ChildAt(index);
        } else {
            return this.contentContainer.ChildAt(index);
        }
    }

    public *Children(): IterableIterator<VisualElement> {
        if (this.contentContainer === this) {
            yield* this.hierarchy.Children();
        } else {
            yield* this.contentContainer.Children();
        }
    }

    public *ChildrenRecursive(): IterableIterator<VisualElement> {
        if (this.contentContainer === this) {
            yield* this.hierarchy.ChildrenRecursive();
        } else {
            yield* this.contentContainer.ChildrenRecursive();
        }
    }

    public get childrenCount(): number {
        if (this.contentContainer === this) {
            return this.hierarchy.childrenCount;
        }
        return this.contentContainer.childrenCount;
    }

    public get parent(): VisualElement | null  { return this.m_logicalParent; }

    public get rootElement(): VisualElement { return this.parent?? this; }

    //#endregion
}