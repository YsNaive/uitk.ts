import { SplitView } from "../visualElement/SplitView";
import { VisualElement } from "../visualElement/VisualElement";

export function Example_SplitView(root: VisualElement){
    // create container that will add into view
    const panel1 = new VisualElement();
    panel1.style.backgroundColor = "rgb(100,50,50)";
    const panel2 = new VisualElement();
    panel2.style.backgroundColor = "rgb(50,100,50)";
    const panel3 = new VisualElement();
    panel3.style.backgroundColor = "rgb(50,50,100)";
    const panel4 = new VisualElement();
    panel4.style.backgroundColor = "rgb(100,100,50)";

    // create split view
    const split1 = new SplitView();
    split1.isHorizontal = true; // flex row, default is column
    split1.minFixedSize = 250;  // pixel unit
    split1.minFlexSize  = 500;
    const split2 = new SplitView();
    split2.isHorizontal = true;
    split2.isReverse    = true; // swap fixed and flex
    split2.minFixedSize = 200;
    split2.minFlexSize  = 200;
    const split3 = new SplitView();
    split3.minFixedSize = 200;
    split3.minFlexSize  = 200;

    // assign element
    split1.Add(panel1); // 1st is fixed item
    split1.Add(split2); // 2nd is flex  item

    split2.Add(split3);
    split2.Add(panel2);

    split3.Add(panel3);
    split3.Add(panel4);

    root.Add(split1);
}