import { CSSFactory } from "../utils/CSSFactory";
import type { Action } from "../utils/Event";
import { SR } from "../utils/SR";
import { StyleManager } from "../utils/StyleManager";
import { TextElement } from "./TextElement";

CSSFactory.BeginBlock(`.${SR.class.Button}`);
CSSFactory.alignItems      = "center";
CSSFactory.backgroundColor = SR.cssVar.color_background3;
CSSFactory.borderRadius    = "10px";
CSSFactory.borderWidth     = "2px";
CSSFactory.borderColor     = SR.cssVar.color_background1;
CSSFactory.transition      = "0.3s";
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.Button}:hover`);
CSSFactory.borderColor     = SR.cssVar.color_foreground1;
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.Button}:active`);
CSSFactory.backgroundColor = SR.cssVar.color_foreground1;
CSSFactory.EndBlock();
StyleManager.RegisterCSSBlock(CSSFactory.Build());

export class Button extends TextElement{
    constructor(label = "", callback?: Action<[]>){
        super(label);
        this.classList.add(SR.class.Button);
        if(callback)
            this.on.Click(callback);
    }
}