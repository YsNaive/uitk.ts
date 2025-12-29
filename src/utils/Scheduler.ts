import type { Action } from "./Event";

export class UpdateScheduler {
    private m_isDirty: boolean = false;
    private m_callback: Action<[]>;

    public get isDirty(): boolean { return this.m_isDirty; }

    constructor(callback: Action<[]>){
        this.m_callback = callback;
    }

    public MarkDirty(): void {
        if (this.m_isDirty) return;
        this.m_isDirty = true;

        setTimeout(() => {
            this.m_isDirty = false;
            this.m_callback();
        }, 0);
    }
}