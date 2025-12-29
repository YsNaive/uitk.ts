import type { IThemeProperty } from "./Theme";

export const SR_prefix = "";

const cssID: IThemeProperty = {
    fontFamily       : `--${SR_prefix}font-family`,
    fontSize         : `--${SR_prefix}font-size`,
    fontSizeH1       : `--${SR_prefix}font-size-h1`,
    fontSizeH2       : `--${SR_prefix}font-size-h2`,
    fontSizeH3       : `--${SR_prefix}font-size-h3`,
    lineHeight       : `--${SR_prefix}line-height`,
    scrollbarSize    : `--${SR_prefix}scrollbar-size`,
    textPadding      : `--${SR_prefix}text-padding`,
    containerPadding : `--${SR_prefix}container-padding`,
    drawerMargin     : `--${SR_prefix}content-padding`,
    labelWidth       : `--${SR_prefix}label-width`,
    borderWidth      : `--${SR_prefix}border-width`,
    borderRadius     : `--${SR_prefix}border-radius`,

    color_text       : `--${SR_prefix}color-text`,
    color_background1: `--${SR_prefix}color-bg-1`,
    color_background2: `--${SR_prefix}color-bg-2`,
    color_background3: `--${SR_prefix}color-bg-3`,
    color_foreground1: `--${SR_prefix}color-fg1`,
    color_foreground2: `--${SR_prefix}color-fg2`,
    color_foreground3: `--${SR_prefix}color-fg3`,

    icon_expand      : `--${SR_prefix}icon-expand`,
    icon_unexpand    : `--${SR_prefix}icon-unexpand`,
}; Object.freeze(cssID);
const cssVar: IThemeProperty = Object.keys(cssID).reduce((result, key) => {
    result[key as keyof IThemeProperty] = `var(${cssID[key as keyof IThemeProperty]})`
    return result;
}, {} as IThemeProperty); Object.freeze(cssVar);

let requestTempNameCounter = 0;
const classSR = {
    VisualElement  : `${SR_prefix}ve`         , // style in: VisualElement.ts
    InputElement   : `${SR_prefix}input`      , // style in: TextField.ts
    CheckBox       : `${SR_prefix}check-box`  , // style in: TextField.ts
    PopupBackdrop  : `${SR_prefix}popup-bg`   , // style in: PopupBackdrop.ts
    TextElement    : `${SR_prefix}text`       , // style in: TextElement.ts
    LabelElement   : `${SR_prefix}label`      , // style in: LabelElement.ts
    Button         : `${SR_prefix}btn`        , // style in: Button.ts
    ScrollView     : `${SR_prefix}scroll-view`, // style in: ScrollView.ts
    SplitView      : `${SR_prefix}split-view` , // style in: SplitView.ts
    TabView        : `${SR_prefix}tab-view`   , // style in: TabView.ts
    ChoiceContainer: `${SR_prefix}menu`       , // style in: ContextMenu.ts
    ChoiceItem     : `${SR_prefix}menu-item`  , // style in: ContextMenu.ts
    RuntimeDrawer  : `${SR_prefix}drawer`     , // style in: RuntimeDrawer.ts
    FoldoutDrawer  : `${SR_prefix}foldout`    , // style in: FoldoutDrawer.ts
    IconElement    : `${SR_prefix}icon`       , // style in: RuntimeDrawer.ts
    RD_Label       : `${SR_prefix}rd-label`   , // style in: RuntimeDrawer.ts
  
    Container      : `${SR_prefix}container`  , // uesd in: RuntimeDrawer.ts
    FlexFill       : `${SR_prefix}flex1`      , // uesd in: VisualElement.ts
    FlexRow        : `${SR_prefix}row`        , // uesd in: VisualElement.ts
    Horizontal     : `${SR_prefix}hor`        , // uesd in: ScrollView.ts SplitView.ts
    Vertical       : `${SR_prefix}ver`        , // uesd in: ScrollView.ts SplitView.ts
    Expand         : `${SR_prefix}expand`     , // uesd in: RuntimeDrawer.ts
    Locked         : `${SR_prefix}lock`       , // uesd in: SplitView.ts
  
    ThemePrefix    : `${SR_prefix}theme-`     ,

    RequestUniqueClass(): string{
        const ret = `${SR_prefix}t${requestTempNameCounter}`;
        requestTempNameCounter += 1;
        return ret;
    }
}; Object.freeze(classSR);

const regexSR = {
    newLine: /[\r\n]+/g,
}

export const SR = {
    class : classSR,
    cssID : cssID  ,
    cssVar: cssVar ,
    regex : regexSR ,
    event: {
        GeometryChanged: "geometryChanged",
        ValueChanged   : "valuechanged"   ,
    },
    dynamicField: {
        VisualElement : "visualElement" , // used in: VisualElement.ts
        GeometryObInfo: "geometryOBInfo", // used in: VisualElement.ts
        CallbackHolder: "callbackHolder", // used in: PopupDropback.ts
    },
    LevenshteinDistance(a: string, b: string): number {
        const lenA = a.length;
        const lenB = b.length;

        if (lenA === 0) return lenB;
        if (lenB === 0) return lenA;

        // 確保 a 是較短字串，優化空間使用
        let strA = a;
        let strB = b;
        if (lenA > lenB) {
            [strA, strB] = [strB, strA];
        }

        const prev: number[] = new Array(strA.length + 1);
        for (let i = 0; i <= strA.length; i++) {
            prev[i] = i;
        }

        for (let j = 1; j <= strB.length; j++) {
            let prevDiag = prev[0];
            prev[0] = j;
            for (let i = 1; i <= strA.length; i++) {
                const temp = prev[i];
                const cost = strA[i - 1] === strB[j - 1] ? 0 : 1;
                prev[i] = Math.min(
                    prev[i] + 1,       // 刪除
                    prev[i - 1] + 1,   // 插入
                    prevDiag + cost    // 替換
                );
                prevDiag = temp;
            }
        }

        return prev[strA.length];
    },

}; Object.freeze(SR);