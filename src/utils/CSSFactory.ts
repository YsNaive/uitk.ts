
export class CSSBlock {
    /** { parent: styleElement } */
    private readonly m_registeredElement: Map<HTMLElement | ShadowRoot, HTMLStyleElement> = new Map(); 
    private m_cssText: string = "";

    public get cssText()  : string   { return this.m_cssText; }
    public set cssText(css: string) { 
        this.m_cssText = css;
        for(let pair of this.m_registeredElement){
            pair[1].textContent = css;
        }    
    }

    /** @param element document.head, shadowRoot, etc. */
    public RegisterElement(element: HTMLElement | ShadowRoot){
        if(this.m_registeredElement.has(element))
            return;
        const styleElement = document.createElement("style");
        element.appendChild(styleElement);
        styleElement.textContent = this.m_cssText;
        this.m_registeredElement.set(element, styleElement);
    }

    public UnregisterElement(element: HTMLElement | ShadowRoot){
        const styleElement = this.m_registeredElement.get(element);
        if(!styleElement)
            return;
        element.removeChild(styleElement);
        this.m_registeredElement.delete(element);
    }
}

export interface ICSSFactory {
    BeginBlock(selector: string): void;
    EndBlock(): void;
    AddLine(text: string): void;
    Build(): CSSBlock;
    BuildString(): string;

    width?: string;
    minWidth?: string;
    maxWidth?: string;
    height?: string;
    minHeight?: string;
    maxHeight?: string;
    display?: string;
    position?: string;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    zIndex?: string;
    margin?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    padding?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    overflow?: string;
    overflowX?: string;
    overflowY?: string;
    color?: string;
    content?: string;
    background?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundRepeat?: string;
    backgroundPosition?: string;
    
    border?: string;
    borderTop?: string;
    borderRight?: string;
    borderBottom?: string;
    borderLeft?: string;
    borderWidth?: string;
    borderTopWidth?: string;
    borderRightWidth?: string;
    borderBottomWidth?: string;
    borderLeftWidth?: string;
    borderStyle?: string;
    borderTopStyle?: string;
    borderRightStyle?: string;
    borderBottomStyle?: string;
    borderLeftStyle?: string;
    borderColor?: string;
    borderTopColor?: string;
    borderRightColor?: string;
    borderBottomColor?: string;
    borderLeftColor?: string;
    borderRadius?: string;
    borderTopLeftRadius?: string;
    borderTopRightRadius?: string;
    borderBottomRightRadius?: string;
    borderBottomLeftRadius?: string;
    
    resize?: string;
    outline?: string;
    boxShadow?: string;
    boxSizing?: string;
    font?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: string;
    textDecoration?: string;
    textTransform?: string;
    whiteSpace?: string;
    wordBreak?: string;
    visibility?: string;
    opacity?: string;
    transition?: string;
    transform?: string;
    transformOrigin?: string;
    cursor?: string;
    pointerEvents?: string;
    flex?: string;
    flexDirection?: string;
    flexWrap?: string;
    flexGrow?: string;
    flexShrink?: string;
    flexBasis?: string;
    justifyContent?: string;
    alignItems?: string;
    alignContent?: string;
    gap?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    gridColumn?: string;
    gridRow?: string;
    objectFit?: string;
    objectPosition?: string;
    clipPath?: string;
    filter?: string;
    mixBlendMode?: string;
    userSelect?: string;
}

const blockFactoryBuffer: string[] = [];

export const CSSFactory: ICSSFactory = {
    BeginBlock: (selector: string) => {
        const value = CSSFactory as any;
        for (const key in CSSFactory) {
            if (key === "BeginBlock"  ||
                key === "EndBlock"    ||
                key === "Build"       ||
                key === "BuildString" ||
                key === "AddLine"     ) continue;
            delete value[key];
        }
        blockFactoryBuffer.push(`${selector} {`);
    },

    EndBlock: (): void => {
        const value = CSSFactory as any;
        for (const key in CSSFactory) {
            if (key === "BeginBlock" || key === "EndBlock" || key === "Build") continue;
            const cssProp = key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
            blockFactoryBuffer.push(`    ${cssProp}: ${value[key]};`);
            delete value[key];
        }
        blockFactoryBuffer.push(`}`);
    },

    AddLine: (text: string): void=>{
        console.log("add", text);
        
        blockFactoryBuffer.push(text);
    },

    Build: (): CSSBlock =>{
        const block = new CSSBlock();
        block.cssText = blockFactoryBuffer.join("\n");
        blockFactoryBuffer.length = 0;
        return block;
    },

    BuildString: (): string =>{
        const str = blockFactoryBuffer.join("\n");
        blockFactoryBuffer.length = 0;
        return str;
    },
};