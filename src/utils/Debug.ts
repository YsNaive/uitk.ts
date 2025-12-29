
export const Debug = {
    Log(...args: unknown[]): void {
        console.log(...args);
    },

    LogIf(condition: boolean, ...args: unknown[]): void {
        if (condition) {
            console.log(...args);
        }
    }
};