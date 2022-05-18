
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const generateArrayOfRandomNumbers = (len: number, max = 100) => Array.from(new Array(len)).map(() => Math.floor(Math.random() * max) + 1);
export function shuffleArray<Type = unknown>(arr: Type[]) {
    arr.sort(() => Math.random() - 0.5);
}


export * from "./createElement";
export * from "./time";