export type Constructor        <T = any, Args extends any[] = []> =          new (...args: Args) => T;
export type AbstractConstructor<T = any, Args extends any[] = []> = abstract new (...args: Args) => T;

export const Type = {
    /**
     * Get the constructor of a given value.
     */
    Ctor(value: any): Constructor<any> {
        if (value === null) {
            return Object;
        }

        const typeStr = typeof value;
        if (typeStr === 'object') {
            return value.constructor;
        }
        // primitive types (boxed constructors)
        switch (typeStr) {
            case 'string' : return String;
            case 'number' : return Number;
            case 'boolean': return Boolean;
            default:
        }
        
        if (typeStr === 'function') 
            throw new Error("[Type] you can't get ctor from a function");
        throw new Error(`[Type] Ctor not found from ${value}`);
    },

    TypeNameof(value: any): string{
        return Type.Ctor(value).name;
    },

    Is(a: any, b: any): boolean{
        return Type.Ctor(a) === Type.Ctor(b);
    },

    IsPrimitive(ctor: Constructor): boolean{
        if(ctor === String ) return true;
        if(ctor === Number ) return true;
        if(ctor === Boolean) return true;
        return false;
    },

    IsExtends(sub: any, base: any): boolean {
        const protoSub  = this.Ctor(sub) .prototype;
        const protoBase = this.Ctor(base).prototype;

        if (protoSub === protoBase) return false;

        let current = protoSub;
        while (current) {
            if (current === protoBase) return true;
            current = Object.getPrototypeOf(current);
        }
        return false;
    },

    IsAssignable(a: any, b: any): boolean {
        const protoA = this.Ctor(a);
        const protoB = this.Ctor(b);

        if (protoA === protoB) return true;

        if (Type.IsPrimitive(protoA) || Type.IsPrimitive(protoB)) {
            return false;
        }

        return this.IsExtends(a, b);
    },

    DynamicCast<T>(obj: any, ctor: Constructor | AbstractConstructor): T | null {
        if (obj instanceof ctor) {
            return obj as T;
        }
        return null;
    },

    GetPropertyDescriptor(obj: any, key: string): PropertyDescriptor | undefined {
        while (obj) {
            const descriptor = Object.getOwnPropertyDescriptor(obj, key);
            if (descriptor) return descriptor;
            obj = Object.getPrototypeOf(obj);
        }
        return undefined;
    },
}
