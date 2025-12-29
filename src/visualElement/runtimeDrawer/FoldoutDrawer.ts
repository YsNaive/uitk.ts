import { CSSFactory } from "../../utils/CSSFactory";
import { SR } from "../../utils/SR";
import { StyleManager } from "../../utils/StyleManager";
import { RuntimeDrawer } from "./RuntimeDrawer";

CSSFactory.BeginBlock(`.${SR.class.RuntimeDrawer}.${SR.class.FoldoutDrawer}.${SR.class.Expand}>.${SR.class.Container}`);
CSSFactory.marginLeft = SR.cssVar.lineHeight;
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.FoldoutDrawer}>.${SR.class.RD_Label}`);
CSSFactory.flexGrow = "1";
CSSFactory.width    = "auto";
CSSFactory.maxWidth = "none";
CSSFactory.EndBlock();
StyleManager.RegisterCSSBlock(CSSFactory.Build());

export abstract class FoldoutDrawer<T> extends RuntimeDrawer<T>{
    private  m_expand      : boolean = true;
    public get expand()    : boolean { return this.m_expand; }
    public set expand(value: boolean) {
        if(value === this.m_expand)
            return;
        this.m_expand = value;
        if(value){
            this.contentContainer.style.display = "";
            this.stateIconElement.style.backgroundImage = SR.cssVar.icon_expand;
        }else{
            this.contentContainer.style.display = "none";
            this.stateIconElement.style.backgroundImage = SR.cssVar.icon_unexpand;
        }
    }
    
    constructor(label = ""){
        super(label);
        this.classList.add(SR.class.FoldoutDrawer);
        this.LayoutExpand();
        this.expand = false;
        this.labelContainer.on.Click(()=> this.expand = !this.expand);
    }
}

/**
 * Act as a container allow you to use as FoldoutDrawer
 */
export class EmptyFoldoutDrawer extends FoldoutDrawer<null>{
    public constructor(label = ""){
        super(label);
    }

    public    override Repaint(): void { }
    protected override RepaintLayout(): void { }
}