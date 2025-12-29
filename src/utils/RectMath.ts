export const RectMath= {
    /** is a contains b */
    IsContain(a: DOMRect, b: DOMRect): boolean {
        return (
            b.left   >= a.left   &&
            b.right  <= a.right  &&
            b.top    >= a.top    &&
            b.bottom <= a.bottom
        );
    },
    /** return closest b that a contains b */
    ClosestContain(a: DOMRect, b: DOMRect): DOMRect {
        return new DOMRect(
            Math.min(Math.max(b.left, a.left), a.right  - b.width ),
            Math.min(Math.max(b.top , a.top ), a.bottom - b.height),
            b.width,
            b.height
        );
    },
    IsIntersection(a:DOMRect, b:DOMRect): boolean{
        return (
            a.left   < b.right  &&
            a.right  > b.left   &&
            a.top    < b.bottom &&
            a.bottom > b.top
        );
    },
    GetIntersection(a:DOMRect, b:DOMRect): DOMRect{
        const left   = Math.max(a.left  , b.left  );
        const right  = Math.min(a.right , b.right );
        const top    = Math.max(a.top   , b.top   );
        const bottom = Math.min(a.bottom, b.bottom);

        if (right <= left || bottom <= top) {
            return new DOMRect(0,0,0,0);
        }

        return new DOMRect(left, top, right - left, bottom - top);
    }
}
Object.freeze(RectMath);