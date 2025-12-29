import { CSSFactory } from "../utils/CSSFactory";
import { SR } from "../utils/SR";
import { StyleManager } from "../utils/StyleManager";
import { VisualElement } from "./VisualElement";

CSSFactory.BeginBlock(`.${SR.class.TextElement}`);
CSSFactory.fontFamily = SR.cssVar.fontFamily;
CSSFactory.fontSize   = SR.cssVar.fontSize;
CSSFactory.color      = SR.cssVar.color_text;
CSSFactory.whiteSpace = "pre-wrap";
CSSFactory.wordBreak  = "break-word";
CSSFactory.EndBlock();
StyleManager.RegisterCSSBlock(CSSFactory.Build());

export class TextElement extends VisualElement{
    private  m_text      : string = "";
    public get text()    : string  { return this.m_text; }
    public set text(value: string) {        
        this.m_text = value;
        this.hierarchy.htmlElement.textContent = value.replace(/(\r\n|\n|\r)/g, '<br>');
    }
    
    constructor(text = ""){
        super();
        this.classList.add(SR.class.TextElement);
        this.text = text;
    }
}