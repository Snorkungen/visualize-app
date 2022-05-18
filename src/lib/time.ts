
export const time = Object.assign(async (promise: Promise<unknown>) => {
    let startTime = Date.now();
    await promise;
    let endTime = Date.now();
    return endTime - startTime;
}, {
    limitDecimals(num: number, limit = 2) {
        return Math.round(num * Math.pow(10, limit)) / Math.pow(10, limit)
    },
    async ms(promise: Promise<unknown>) {
        return time(promise);
    },
    async sec(promise: Promise<unknown>) {
        return time.limitDecimals((await time.ms(promise)) / 1000);
    },
    async min(promise: Promise<unknown>) {
        return time.limitDecimals((await time.sec(promise)) / 60);
    }
})