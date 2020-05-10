declare global {
    interface ArrayConstructor {
        range(start: number, end: number): Array<number>;
    }
}

Array.range = (start: number, end: number) => Array.from({ length: end - start }, (v, k) => k + start);

export {};
