
export interface IHierarchyNode<T> {
    Add   (child: T): void;
    Insert(index: number, child: T): void;
    Remove(child: T): void;
    Clear (): void;

    IndexOf(child: T): number;
    ChildAt(index: number): T | null;
    Children(): IterableIterator<T>;
    ChildrenRecursive(): IterableIterator<T>;
    
    readonly childrenCount: number;
    readonly parent: T | null;
}

export class HierarchyNode<T extends HierarchyNode<T>> implements IHierarchyNode<T> {
    private m_parent: T | null = null;
    private m_children: T[] = [];

    public Add(child: T): void {
        if (child.m_parent) {
            child.m_parent.Remove(child);
        }
        this.m_children.push(child);
        child.m_parent = this as unknown as T;
    }

    public Insert(index: number, child: T): void {
        if (child.m_parent) {
            child.m_parent.Remove(child);
        }
        this.m_children.splice(index, 0, child);
        child.m_parent = this as unknown as T;
    }

    public Remove(child: T): void {
        const index = this.m_children.indexOf(child);
        if (index !== -1) {
            this.m_children.splice(index, 1);
            child.m_parent = null;
        }
    }

    public Clear(): void {
        for (let child of this.m_children) {
            child.m_parent = null;
        }
        this.m_children = [];
    }

    public IndexOf(child: T): number {
        return this.m_children.indexOf(child);
    }

    public ChildAt(index: number): T | null {
        if (index < 0 || index >= this.m_children.length) {
            return null;
        }
        return this.m_children[index];
    }

    public *Children(): IterableIterator<T> {
        for (let child of this.m_children) {
            yield child;
        }
    }

    public *ChildrenRecursive(): IterableIterator<T> {
        for (let child of this.m_children) {
            yield child;
            yield* child.ChildrenRecursive();
        }
    }

    public get childrenCount(): number {
        return this.m_children.length;
    }

    public get parent(): T | null {
        return this.m_parent;
    }
}
