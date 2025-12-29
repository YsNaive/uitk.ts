import type { Func } from "../utils/Event";
import { SR } from "../utils/SR";
import { ScrollView } from "./ScrollView";
import { VisualElement } from "./VisualElement";
/**
 * T = choice data type
 */
export class SearchView<T> extends ScrollView{
    private m_choiceElementTable: Map<T, VisualElement>;
    private m_searching    : boolean = false;
    private m_pendingSearch: boolean = false;

    public maxDisplayCount: number = 20;
    public readonly getChoices   : Func<[ ], IterableIterator<T>>;
    public readonly filter       : Func<[T], number>;
    public readonly createElement: Func<[T], VisualElement>;
    
    /**
     * @param getChoices get a iterator that recive all choive
     * @param filter return pr, -1 is ignore, lower is display in front
     * @param createElement create element to show
     */
    constructor(getChoices: Func<[], IterableIterator<T>>, filter: Func<[T], number>, createElement: Func<[T], VisualElement>){
        super();
        this.m_choiceElementTable = new Map();
        this.getChoices    = getChoices;
        this.filter        = filter;
        this.createElement = createElement;
    }

    public async Search(): Promise<void> {
        if (this.m_searching) {
            this.m_pendingSearch = true;
            return;
        }

        this.m_searching = true;

        const toAdd: Array<[number, VisualElement]> = [];

        for (const item of this.getChoices()) {
            const pr = this.filter(item);
            if (pr !== -1) {
                let element = this.m_choiceElementTable.get(item);
                if (!element) {
                    element = this.createElement(item);
                    this.m_choiceElementTable.set(item, element);
                }
                toAdd.push([pr, element]);
            }
        }

        toAdd.sort((a, b) => a[0] - b[0]);
        let i = 0;
        this.Clear();
        for (const [, element] of toAdd) {
            this.Add(element);
            i++;
            if(i >= this.maxDisplayCount)
                break;
        }

        this.m_searching = false;

        if (this.m_pendingSearch) {
            this.m_pendingSearch = false;
            await this.Search();
        }
    }
}