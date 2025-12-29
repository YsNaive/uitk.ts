import type { CSSBlock } from "./CSSFactory";

const registeredCSSBlock: Set<CSSBlock>    = new Set();
const registeredElement : Set<HTMLElement | ShadowRoot> = new Set();

export const StyleManager = {
    /** @param element  document.head, shadowRoot, etc.*/
    RegisterElement: (element: HTMLElement | ShadowRoot): void=>{
        if(registeredElement.has(element))
            return;
        registeredElement.add(element);
        for(let block of registeredCSSBlock)
            block.RegisterElement(element);
    },

    RegisterCSSBlock: (block: CSSBlock): void=>{
        if(registeredCSSBlock.has(block))
            return;
        registeredCSSBlock.add(block);
        for(let element of registeredElement)
            block.RegisterElement(element);
    },

    /** @param element  document.head, shadowRoot, etc.*/
    UnregisterElement: (element: HTMLElement | ShadowRoot): void=>{
        if(!registeredElement.has(element))
            return;
        registeredElement.delete(element);
        for(let block of registeredCSSBlock)
            block.UnregisterElement(element);
    },

    UnregisterCSSBlock: (block: CSSBlock): void=>{
        if(!registeredCSSBlock.has(block))
            return;
        registeredCSSBlock.delete(block);
        for(let element of registeredElement)
            block.UnregisterElement(element);
    },
}