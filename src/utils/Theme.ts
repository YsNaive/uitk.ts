import { CSSBlock } from "./CSSFactory";
import { SR, SR_prefix } from "./SR";
import { StyleManager } from "./StyleManager";

const registeredID: Set<string> = new Set();

export interface IThemeProperty{
    fontFamily       : string;
    fontSize         : string;
    fontSizeH1       : string;
    fontSizeH2       : string;
    fontSizeH3       : string;
    lineHeight       : string;
    scrollbarSize    : string;
    containerPadding : string;
    textPadding      : string;
    drawerMargin     : string;
    labelWidth       : string;
    borderWidth      : string;
    borderRadius     : string;

    color_text       : string;
    color_background1: string;
    color_background2: string;
    color_background3: string;
    color_foreground1: string;
    color_foreground2: string;
    color_foreground3: string;

    icon_expand      : string;
    icon_unexpand    : string;
}

export class Theme implements IThemeProperty{
    public static readonly default: Theme = Theme.CreateNew("default");

    public readonly id: string;

    private readonly m_cssBlock: CSSBlock;
    private constructor(id:string){
        this.id = id;
        this.m_cssBlock = new CSSBlock();
    }
    
    public get cssClassName(): string { return `${SR.class.ThemePrefix}${this.id}`; }

    public fontFamily       : string = "consolas";
    public fontSize         : string = "24px";
    public fontSizeH1       : string = "32px";
    public fontSizeH2       : string = "30px";
    public fontSizeH3       : string = "28px";
    public lineHeight       : string = "30px";
    public scrollbarSize    : string = "14px";
    public containerPadding : string = "16px";
    public textPadding      : string = "12px";
    public drawerMargin     : string = "2px";
    public labelWidth       : string = "220px";
    public borderWidth      : string = "2px";
    public borderRadius     : string = "8px";

    public color_text       : string = "#222";
    public color_background1: string = "#EEE";
    public color_background2: string = "#DDD";
    public color_background3: string = "#CCC";
    public color_foreground1: string = "#888";
    public color_foreground2: string = "#666";
    public color_foreground3: string = "#444";

    public icon_expand      : string = "url(/icon/expand.png)";
    public icon_unexpand    : string = "url(/icon/unexpand.png)";

    public Apply(): void{
        const buffer: string[] = [];
        buffer.push(`.${SR.class.VisualElement}.${this.cssClassName} {`);
        
        for(const key in SR.cssID){
            buffer.push(`${(SR.cssID as any)[key]}: ${(this as any)[key]};`);
        }

        buffer.push("}");

        this.m_cssBlock.cssText = buffer.join("\n");
    }

    public static CreateNew(id: string): Theme{
        if(registeredID.has(id))
            throw new Error(`[Theme] already contains Theme id \"${id}\"`);
        registeredID.add(id);
        const theme = new Theme(id);
        StyleManager.RegisterCSSBlock(theme.m_cssBlock);
        return theme;
    }
};

Theme.default.Apply();