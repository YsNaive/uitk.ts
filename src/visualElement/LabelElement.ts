import { CSSFactory } from "../utils/CSSFactory";
import { SR } from "../utils/SR";
import { StyleManager } from "../utils/StyleManager";
import { VisualElement } from "./VisualElement";

CSSFactory.BeginBlock(`.${SR.class.LabelElement}`);
CSSFactory.fontFamily = SR.cssVar.fontFamily;
CSSFactory.fontSize   = SR.cssVar.fontSizeH1;
CSSFactory.color      = SR.cssVar.color_text;
CSSFactory.EndBlock();
StyleManager.RegisterCSSBlock(CSSFactory.Build());

export class LabelElement extends VisualElement{
    public get text()    : string  { return this.hierarchy.htmlElement.textContent?? ""   ; }
    public set text(value: string) {        this.hierarchy.htmlElement.textContent = value; }

    constructor(text = ""){
        super();
        this.classList.add(SR.class.LabelElement);
        this.text = text;
    }
}