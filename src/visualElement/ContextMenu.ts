import { CSSFactory } from "../utils/CSSFactory";
import { EventHandler, type Action, type Func } from "../utils/Event";
import { RectMath } from "../utils/RectMath";
import { UpdateScheduler } from "../utils/Scheduler";
import { SR } from "../utils/SR";
import { StyleManager } from "../utils/StyleManager";
import type { PopupBackdrop } from "./PopupBackdrop";
import { ScrollView } from "./ScrollView";
import { TextElement } from "./TextElement";
import { VisualElement } from "./VisualElement";

CSSFactory.BeginBlock(`.${SR.class.ChoiceContainer}`);
CSSFactory.minWidth     = SR.cssVar.labelWidth;
CSSFactory.maxWidth     = "50vw";
CSSFactory.maxHeight    = "50vh";
CSSFactory.borderWidth  = SR.cssVar.borderWidth;
CSSFactory.borderRadius = SR.cssVar.borderRadius;
CSSFactory.borderColor  = SR.cssVar.color_foreground1;
CSSFactory.backgroundColor = SR.cssVar.color_background1;
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.ChoiceItem}`);
CSSFactory.paddingLeft = SR.cssVar.textPadding;
CSSFactory.minHeight   = SR.cssVar.lineHeight;
CSSFactory.minWidth    = "fit-content";
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.ChoiceItem}:nth-child(even)`);
CSSFactory.backgroundColor = SR.cssVar.color_background2;
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.ChoiceItem}:hover`);
CSSFactory.backgroundColor = SR.cssVar.color_background3;
CSSFactory.EndBlock();
CSSFactory.BeginBlock(`.${SR.class.ChoiceItem}>.${SR.class.IconElement}`);
CSSFactory.backgroundImage = SR.cssVar.icon_unexpand;
CSSFactory.marginRight     = "0px";
CSSFactory.marginLeft      = "auto";
CSSFactory.EndBlock();
StyleManager.RegisterCSSBlock(CSSFactory.Build());

export class ContextMenuItem{
    private readonly m_path: string;
    private readonly m_name: string;
    private readonly m_callback: Action<[]> | undefined;
    
    constructor(path: string, callback?: Action<[]>, name?: string){
        this.m_path     = path;
        this.m_name     = name?? path.substring(path.lastIndexOf("/"));
        this.m_callback = callback;
    }

    public get callback(): Action<[]> | undefined { return this.m_callback; }
    public get path(): string { return this.m_path };
    public get name(): string { return this.m_name };
}

class ContextMenuNode{
    public source  : ContextMenuItem;
    public children: ContextMenuNode[] = [];

    constructor(source: ContextMenuItem){
        this.source = source;
    }

    public Insert(menuItem: ContextMenuItem): void {
        const pathParts = menuItem.path.split(/[\\/]/);
        this._insertRecursive(menuItem, pathParts, 0);
    }

    private _insertRecursive(menuItem: ContextMenuItem, pathParts: string[], depth: number): void {
        if (depth === pathParts.length - 1) {
            this.children.push(new ContextMenuNode(menuItem));
            return;
        }

        const nextPath = pathParts.slice(0, depth + 1).join('/');
        let child = this.children.find(c => c.source.path === nextPath);

        if (!child) {
            const dummyItem = new ContextMenuItem(nextPath);
            child = new ContextMenuNode(dummyItem);
            this.children.push(child);
        }

        child._insertRecursive(menuItem, pathParts, depth + 1);
    }
}

class MenuViewEventHandler extends VisualElement._EventHandler{
    public Selected(callback: Action<[ContextMenuItem]>) { 
        if(this.isAdd)
            (this.target as ContextMenu)._onSelected.Register(callback); 
        else
            (this.target as ContextMenu)._onSelected.Unregister(callback); 
    }
    public DecorateItem(callback: Action<[VisualElement]>) { 
        if(this.isAdd)
            (this.target as ContextMenu)._onDecorateItem.Register(callback); 
        else
            (this.target as ContextMenu)._onDecorateItem.Unregister(callback); 
    }
}

export class ContextMenu extends ScrollView{
    public  readonly backdropElement  : PopupBackdrop;
    public  readonly _onSelected      : EventHandler<[ContextMenuItem]>;
    public  readonly _onDecorateItem  : EventHandler<[VisualElement]>;
    private readonly m_updateScheduler: UpdateScheduler;
    private readonly m_itemSet: Set<ContextMenuItem>;

    constructor(backdrop: PopupBackdrop, _onSelected?: EventHandler<[ContextMenuItem]>, _onDecorateItem?: EventHandler<[VisualElement]>){
        super();
        this.classList.add(SR.class.ChoiceContainer);
        this.backdropElement   = backdrop;
        this._onSelected       = _onSelected    ?? new EventHandler<[ContextMenuItem]>();
        this._onDecorateItem   = _onDecorateItem?? new EventHandler<[VisualElement  ]>();
        this.m_updateScheduler = new UpdateScheduler(()=>{
            const rootNode = new ContextMenuNode(new ContextMenuItem("root"));
            for(const item of this.m_itemSet){
                rootNode.Insert(item);
            }
            this.generateLayout(rootNode);
        });
        this.m_itemSet = new Set();

        this.enableHorizontal = true;
    }
    
    public AddItem(menuItem: ContextMenuItem){
        this.m_itemSet.add(menuItem);
        this.m_updateScheduler.MarkDirty();
    }
    public RemoveItem(itemOrPath: ContextMenuItem | string){
        let item: ContextMenuItem | undefined = undefined;
        if(itemOrPath instanceof ContextMenuItem){
            item = itemOrPath;
        }
        else{
            for(const menuItem of this.m_itemSet){
                if(menuItem.path === itemOrPath){
                    item = menuItem;
                    break;
                }
            }
        }
        if(item){
            this.m_itemSet.delete(item);
            this.m_updateScheduler.MarkDirty();
        }
    }

    private generateLayout(sourceNode: ContextMenuNode): ContextMenu{
        this.Clear();
        for(const node of sourceNode.children){
            const itemElement = new VisualElement();
            itemElement.classList.add(SR.class.ChoiceItem);
            itemElement.classList.add(SR.class.FlexRow);
            itemElement.classList.add(SR.class.FlexFill);
            itemElement.Add(new TextElement(node.source.name));
            this._onDecorateItem.Invoke(itemElement);

            if(node.source.callback){
                itemElement.on.Click(()=>{
                    node.source.callback!();
                    this._onSelected.Invoke(node.source);
                    this.backdropElement.Clear();
                });
            }
            if(node.children.length > 0){
                const icon = new VisualElement();
                icon.classList.add(SR.class.IconElement);
                icon.style.backgroundImage = SR.cssVar.icon_unexpand;
                itemElement.Add(icon);

                const subMenu = new ContextMenu(this.backdropElement, this._onSelected, this._onDecorateItem);
                const closeCheck = ()=>{
                    if(!subMenu.parent)
                        return;
                    let isHover = itemElement.hierarchy.htmlElement.matches(":hover") ||
                                  subMenu    .hierarchy.htmlElement.matches(":hover");
                    let current = subMenu.nextElement;
                    while(current && !isHover){ 
                        if(current.hierarchy.htmlElement.matches(":hover")){
                            isHover = true;
                            break;
                        }
                        current = current.nextElement;
                    }
                    if(!isHover){
                        subMenu.prevElement?.hierarchy.htmlElement.dispatchEvent(new MouseEvent("mouseleave"));   
                        subMenu.Close();
                    }
                }
                subMenu.generateLayout(node);
                subMenu    .on.MouseLeave(closeCheck);
                itemElement.on.MouseLeave(closeCheck);      
                itemElement.on.MouseEnter(()=>{
                    const itemBound = itemElement.clientRect;
                    subMenu.OpenAt(itemBound.right, itemBound.top);
                    const menuBound = subMenu.clientRect;
                    const parentBound = this.backdropElement.clientRect;
                    if(!RectMath.IsContain(parentBound, menuBound)){
                        subMenu.style.left = `${itemBound.left - menuBound.width}px`;
                    }
                });
            }
            this.Add(itemElement);
        }
        return this;
    }
    
    public override get on() : MenuViewEventHandler{ return new MenuViewEventHandler(this, true ); }
    public override get off(): MenuViewEventHandler{ return new MenuViewEventHandler(this, false); }

    public OpenAt(x:number, y:number){
        this.style.left = `${x}px`;
        this.style.top  = `${y}px`;
        this.backdropElement.Add(this);
    }
    public OpenFrom(element: VisualElement){
        this.backdropElement.Add(this);
        const parentBound = this.backdropElement.dstVisualTree.rootElement.clientRect;
        const fromBound   = element.clientRect;
        const selfBound   = this.clientRect;
        if(selfBound.height < (parentBound.height - fromBound.bottom))
            this.OpenAt(fromBound.left, fromBound.bottom);
        else
            this.OpenAt(fromBound.left, fromBound.top - selfBound.height);
    }
    public Close(){
        this.parent?.Remove(this);
    }
}