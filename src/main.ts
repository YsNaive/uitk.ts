import { Example_RuntimeDrawer, Example_SplitView, SR, StyleManager, Theme, VisualElement } from "./index"

StyleManager.RegisterElement(document.head);

const root = new VisualElement(document.body);
root.SetTheme(Theme.default);
root.style.height = "100vh";
root.style.width  = "100vw";
root.style.backgroundColor = SR.cssVar.color_background1;

Example_SplitView(root);
Example_RuntimeDrawer(root);
