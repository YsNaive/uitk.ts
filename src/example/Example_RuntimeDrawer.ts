import { BoolDrawer, EmptyDrawer, EmptyFoldoutDrawer, IntDrawer, StringChoicesDrawer, StringDrawer, TextArea, VisualElement } from "../index";

export function Example_RuntimeDrawer(root: VisualElement){
    const emptyDrawer= new EmptyDrawer("Empty");
    const intDrawer  = new IntDrawer("Int");
    const strDrawer  = new StringDrawer("String");
    strDrawer.multiLine  = true;
    strDrawer.autoExpand = true;
    const boolDrawer = new BoolDrawer("Bool");
    boolDrawer.value = true;
    const choiceDrawer = new StringChoicesDrawer("Choice");
    choiceDrawer.AddChoice("None");
    choiceDrawer.AddChoice("Color/Red");
    choiceDrawer.AddChoice("Color/Blue");

    const foldout = new EmptyFoldoutDrawer("Foldout");
    foldout.Add(new StringDrawer("Name"));
    foldout.Add(new StringDrawer("ID"));
    foldout.Add(new StringDrawer("Score"));
    
    root.Add(emptyDrawer);
    root.Add(intDrawer);
    root.Add(strDrawer);
    root.Add(boolDrawer);
    root.Add(choiceDrawer);
    root.Add(foldout);
}