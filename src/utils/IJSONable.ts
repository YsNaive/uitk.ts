import type { Action } from "./Event";

export interface IJSONable{
    toJSON(): any;
    fromJSON(jsonObj: any): boolean;
}