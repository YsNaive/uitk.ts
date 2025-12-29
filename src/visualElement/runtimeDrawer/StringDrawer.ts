import { SR } from "../../utils/SR";
import { Type } from "../../utils/Type";
import { TextArea } from "../TextArea";
import { TextElement } from "../TextElement";
import { RuntimeDrawer } from "./RuntimeDrawer";
import { RuntimeDrawerFactory } from "./RuntimeDrawerFactory";


export class StringDrawer extends RuntimeDrawer<string> {
    private m_inputElement: TextArea;
    private m_autoExpand = false;

    public get multiLine(): boolean {
        return this.m_inputElement.multiLine;
    }
    public set multiLine(value: boolean) {
        this.m_inputElement.multiLine = value;
        this.Repaint();
    }

    public get autoExpand(): boolean{
        return this.m_autoExpand;
    }
    public set autoExpand(value:boolean){
        this.m_autoExpand = value;
        this.Repaint();
    }

    constructor(label = "") {
        super(label);

        this.m_inputElement = new TextArea();
        this.m_inputElement.on.Input(() => {
            this.value = this.m_inputElement.value;
        });
        this.multiLine = false;

        this.Add(this.m_inputElement);
    }

    protected override RepaintLayout(): void { }
    public    override Repaint(): void {
        this.value ??= '';
        this.m_inputElement.value  = this.value;
        if(this.m_autoExpand){
            if(this.value.match(SR.regex.newLine))
                this.LayoutExpand();
            else
                this.LayoutInline();
        }
    }
}

RuntimeDrawerFactory.RegisterDrawer(String, StringDrawer, false, 9999);
