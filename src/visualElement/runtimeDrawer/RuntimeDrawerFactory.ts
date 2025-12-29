import { Type, type Constructor } from "../../utils/Type";
import type { RuntimeDrawer } from "./RuntimeDrawer";

interface DrawerEntry{
    drawerCtor     : Constructor<RuntimeDrawer<any>>;
    valueCtor      : Constructor;
    allowAssignable: boolean;
    priority       : number;
};
const drawerRegistry: DrawerEntry[] = [];
const drawerMap     : Map<Constructor, Constructor<RuntimeDrawer<any>>> = new Map();

function matchDrawer(valueCtor: Constructor){
    let matched = drawerMap.get(valueCtor);
    if(matched)
        return matched;
    let maxPr = Number.MIN_SAFE_INTEGER;
    for(const entry of drawerRegistry){
        if(entry.allowAssignable){
            if(!Type.IsAssignable(valueCtor, entry.valueCtor))
                continue;
        }else{
            if(valueCtor !== entry.valueCtor )
                continue;
        }
        if(maxPr < entry.priority){
            maxPr = entry.priority;
            matched = entry.drawerCtor;
        }
    }
    if(!matched)
        throw new Error(`[RuntimeDrawerFactory] can't found drawer for type \"${valueCtor.name}\"`);

    drawerMap.set(valueCtor, matched);
    return matched;
}

export const RuntimeDrawerFactory = {
    /**
     * @param drawerCtor drawer type: ctor
     * @param valueCtor  valueType: prototype
     * @param allowAssignable can childType inherit from valueType use this drawer?
     * @param priority whem matched drawer more than 1, use higher priority
     */
    RegisterDrawer(valueCtor:Constructor, drawerCtor: Constructor<RuntimeDrawer<any>>, allowAssignable: boolean = false, priority: number = 0){
        drawerRegistry.push({
            drawerCtor,
            valueCtor: valueCtor,
            allowAssignable,
            priority,
        });
    },

    FromValue(value: any, label = ""): RuntimeDrawer<any>{
        const drawer = RuntimeDrawerFactory.FromValueCtor(Type.Ctor(value), label);
        drawer.SetValueWithoutNotify(value);
        return drawer;
    },

    FromValueCtor(valueCtor: Constructor, label = ""): RuntimeDrawer<any>{
        const ctor = matchDrawer(valueCtor);
        const drawer = new ctor();
        drawer.label = label;
        return drawer;
    },
}