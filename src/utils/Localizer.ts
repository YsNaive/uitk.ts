// import type { ISerializable } from "./ISerializable";

// export class LocalizeString {
//     private m_value: string;
//     private m_key: string; 
//     private readonly m_owner: Localizer;

//     constructor(owner: Localizer, key: string, value: string = "") {
//         this.m_owner = owner;
//         this.m_key = key;
//         this.m_value = value;
//     }

//     public get value(): string {
//         return this.m_value;
//     }

//     public set value(value: string) {
//         this.m_value = value;
//     }

//     public get key(): string {
//         return this.m_key;
//     }

//     public RenameKey(newKey: string): boolean {
//         return this.m_owner.RenameKey(this.m_key, newKey);
//     }
// }

// export class Localizer implements ISerializable {
//     private m_docStringMap: Map<string, LocalizeString>;

//     constructor() {
//         this.m_docStringMap = new Map();
//     }

//     public Request(): LocalizeString {
//         let len = 6;
//         let key: string;

//         do {
//             key = this._generateKey(len);
//             len++;
//         } while (this.m_docStringMap.has(key));

//         const docString = new LocalizeString(this, key, "");
//         this.m_docStringMap.set(key, docString);
//         return docString;
//     }

//     public Get(key: string): LocalizeString | undefined {
//         return this.m_docStringMap.get(key);
//     }

//     public GetOrAdd(key: string): LocalizeString {
//         let docString = this.m_docStringMap.get(key);
//         if (!docString) {
//             docString = new LocalizeString(this, key, "");
//             this.m_docStringMap.set(key, docString);
//         }
//         return docString;
//     }

//     public Has(key: string): boolean {
//         return this.m_docStringMap.has(key);
//     }

//     public RenameKey(oldKey: string, newKey: string): boolean {
//         const docString = this.m_docStringMap.get(oldKey);
//         if (!docString) return false;
//         if (this.m_docStringMap.has(newKey))
//             return false;
//         this.m_docStringMap.delete(oldKey);
//         this.m_docStringMap.set(newKey, docString);
//         docString["m_key"] = newKey;
//         return true;
//     }

//     toJSON(): object {
//         const obj: Record<string, string> = {};
//         for (const [key, docString] of this.m_docStringMap.entries()) {
//             obj[key] = docString.value;
//         }
//         return obj;
//     }

//     /** call this function multiple times with different table to act as fallback */
//     fromJSON(obj: object): void {
//         const newKeys = new Set(Object.keys(obj));

//         // update exist or create new
//         for (const [key, value] of Object.entries(obj)) {
//             if (typeof value === "string") {
//                 const docString = this.m_docStringMap.get(key);
//                 if (docString) {
//                     docString.value = value;
//                 } else {
//                     this.m_docStringMap.set(key, new LocalizeString(this, key, value));
//                 }
//             }
//         }
//     }


//     private _generateKey(length: number): string {
//         const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
//         let result = '';
//         for (let i = 0; i < length; i++) {
//             result += chars.charAt(Math.floor(Math.random() * chars.length));
//         }
//         return result;
//     }
// }
