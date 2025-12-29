import { CSSFactory } from "../utils/CSSFactory";
import { SR } from "../utils/SR";
import { StyleManager } from "../utils/StyleManager";
import { VisualElement } from "./VisualElement";

CSSFactory.BeginBlock(`.${SR.class.ScrollView}`);
CSSFactory.overflow  = "hidden";
CSSFactory.maxWidth  = "100%";
CSSFactory.maxHeight = "100%";
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.ScrollView}::-webkit-scrollbar`);
CSSFactory.width  = SR.cssVar.scrollbarSize;
CSSFactory.height = SR.cssVar.scrollbarSize;
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.ScrollView}::-webkit-scrollbar-track`);
CSSFactory.backgroundColor = SR.cssVar.color_background2;
CSSFactory.borderRadius= `calc(0.4*${SR.cssVar.scrollbarSize})`;
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.ScrollView}::-webkit-scrollbar-thumb`);
CSSFactory.backgroundColor = SR.cssVar.color_background3;
CSSFactory.borderColor = SR.cssVar.color_background2;
CSSFactory.borderWidth = `calc(0.2*${SR.cssVar.scrollbarSize})`;
CSSFactory.borderRadius= `calc(0.4*${SR.cssVar.scrollbarSize})`;
CSSFactory.borderStyle = "solid";
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.ScrollView}::-webkit-scrollbar-thumb:hover`);
CSSFactory.backgroundColor = SR.cssVar.color_foreground1;
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.ScrollView}.${SR.class.Vertical}`);
CSSFactory.overflowY = "auto";
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.ScrollView}.${SR.class.Horizontal}`);
CSSFactory.overflowX = "auto";
CSSFactory.EndBlock();
StyleManager.RegisterCSSBlock(CSSFactory.Build());

export class ScrollView extends VisualElement {
    public get enableHorizontal()    : boolean  { return this.classList.contains(SR.class.Horizontal); } 
    public set enableHorizontal(value: boolean) { 
        if(value) this.classList.add   (SR.class.Horizontal);
        else      this.classList.remove(SR.class.Horizontal);
    } 

    public get enableVertical  ()    : boolean  { return this.classList.contains(SR.class.Vertical); } 
    public set enableVertical  (value: boolean) { 
        if(value) this.classList.add   (SR.class.Vertical);
        else      this.classList.remove(SR.class.Vertical);
    } 

    constructor(enableVer = true, enableHor = false) {
        super();
        this.classList.add(SR.class.ScrollView);
        this.enableHorizontal = enableHor;
        this.enableVertical   = enableVer;
    }

    public ScrollToElement(element: VisualElement): void {
        const childEl  = element.hierarchy.htmlElement;
        const parentEl = this.hierarchy.htmlElement;

        if (this.enableHorizontal) {
            parentEl.scrollTo({ left: childEl.offsetLeft, behavior: 'smooth' });
        } 
        if (this.enableVertical) {
            parentEl.scrollTo({ top: childEl.offsetTop, behavior: 'smooth' });
        }
    }

    public ScrollToPosition(px: number): void {
        const parentEl = this.hierarchy.htmlElement;
        if (this.enableHorizontal) {
            parentEl.scrollTo({ left: px, behavior: 'smooth' });
        }
        if (this.enableVertical) {
            parentEl.scrollTo({ top: px, behavior: 'smooth' });
        }
    }
}