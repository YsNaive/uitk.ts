import { CSSFactory } from "../../utils/CSSFactory";
import type { Action } from "../../utils/Event";
import { UpdateScheduler } from "../../utils/Scheduler";
import { SR } from "../../utils/SR";
import { ContextMenu, ContextMenuItem } from "../ContextMenu";
import { InputElement } from "../InputElement";
import { PopupBackdrop } from "../PopupBackdrop";
import { SearchView } from "../SearchView";
import { TextElement } from "../TextElement";
import { VisualElement } from "../VisualElement";
import { RuntimeDrawer } from "./RuntimeDrawer";

export class StringChoicesDrawer extends RuntimeDrawer<string>{
    private m_choices: Set<string>;

    public readonly inputElement: InputElement;
    public readonly contextMenu : ContextMenu;
    public readonly searchView  : SearchView<string>; 

    constructor(label = ""){
        super(label);

        this.m_choices = new Set();

        this.inputElement = new InputElement("text");
        this.contextMenu  = new ContextMenu(new PopupBackdrop(this));
        const getChoices  = () => this.m_choices.keys();
        this.searchView = new SearchView<string>(getChoices, this._filter.bind(this), this._createElement.bind(this));
        this.searchView.classList.add(SR.class.ChoiceContainer);

        this.inputElement.on.Click(()=>{
            this.contextMenu.OpenFrom(this.inputElement);
            (this.inputElement.hierarchy.htmlElement as HTMLInputElement).select();
        });
        this.inputElement.on.Input(()=>{
            const backdrop = this.contextMenu.backdropElement;
            backdrop.Clear();
            if(this.inputElement.value === ""){
                this.contextMenu.OpenFrom(this.inputElement);
                return;
            }
            this.searchView.Search();
            backdrop.Clear();
            backdrop.Add(this.searchView);

            const backdropBound =      backdrop    .clientRect;
            const fieldBound    = this.inputElement.clientRect;
            const searchBound   = this.searchView  .clientRect;
            this.searchView.style.left = `${fieldBound.left}px`;
            if(searchBound.height < backdropBound.bottom - fieldBound.bottom)
                this.searchView.style.top = `${fieldBound.bottom}px`;
            else
                this.searchView.style.top = `${fieldBound.top - searchBound.height}px`;

        });
        this.inputElement.on.Unfocus(() => requestAnimationFrame(this.Repaint.bind(this)));
        const icon = new VisualElement();
        icon.classList.add(SR.class.IconElement);
        //TODO: make it css or better
        icon.style.backgroundImage = SR.cssVar.icon_expand;
        icon.style.position = "absolute";
        icon.style.left = "auto";
        icon.style.right = "0px";
            this.Add(this.inputElement);
            this.Add(icon);
    }

    public AddChoice(path: string){
        this.m_choices.add(path);
        this.contextMenu.AddItem(new ContextMenuItem(path, () => this.value = path));
        if(this.inputElement.value === "")
            this.value = path;
    }
    public RemoveChoice(path: string){
        this.m_choices.delete(path);
        this.contextMenu.RemoveItem(path);
    }

    protected override ValidValue(value: string): string {
        if(this.m_choices.has(value))
            return value;
        return this.inputElement.value;
    }

    protected RepaintLayout(): void { }
    public    Repaint(): void {
        this.inputElement.value = this.value?.substring(this.value.lastIndexOf("/")+1)?? '';
    }

    private _filter(match: string): number{
        const name = match.substring(match.lastIndexOf('/')+1);
        const distance = SR.LevenshteinDistance(this.inputElement.value.toLowerCase(), name.toLowerCase());
        return distance;
    }
    private _createElement(choice: string): VisualElement{
        const element = new TextElement(choice.substring(choice.lastIndexOf('/') + 1));
        element.classList.add(SR.class.ChoiceItem);
        element.on.Click(()=>{
            this.value = choice;
            this.contextMenu.backdropElement.Clear();
        });
        return element;
    }
}