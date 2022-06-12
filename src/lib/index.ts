
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const generateArrayOfRandomNumbers = (len: number, max = 100) => Array.from(new Array(len > 0 ? len : 0)).map(() => Math.floor(Math.random() * max) + 1);
export function shuffleArray<Type = unknown>(arr: Type[]) {
    arr.sort(() => Math.random() - 0.5);
}
export const makePositive = (n: number) => n < 0 ? n * -1 : n;

export * from "./createElement";
export * from "./time";
export * from "./rgbtohex";