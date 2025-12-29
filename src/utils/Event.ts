import { SR } from "./SR";

export type Action<Args extends any[]>      = (...args: Args) => void;
export type Func  <Args extends any[], Ret> = (...args: Args) => Ret;

export class EventHandler<Args extends any[] = [], Ret = void> {
    private callbacks: Set<Func<Args, Ret>> = new Set();

    public Register(callback: (...args: Args) => Ret) {
        this.callbacks.add(callback);
    }
    
    public Unregister(callback: (...args: Args) => Ret) {
        this.callbacks.delete(callback);
    }

    public Invoke(...args: Args): void {
        for (const cb of this.callbacks) {
            cb(...args);
        }
    }
}

export class ValueChangedEvent<T> extends Event {
    public readonly value: T;

    constructor(value: T) {
        super(SR.event.ValueChanged, {
            bubbles: true,
            composed: true,
        });
        this.value = value;
    }
}

export class GeometryChangedEvent extends Event{
    public readonly layout: DOMRect;
    constructor(layout: DOMRect){
        super(SR.event.GeometryChanged, {
            bubbles : false,
            composed: true
        });
        this.layout = layout;
    }
}