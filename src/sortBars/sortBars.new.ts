import { createElement, generateArrayOfRandomNumbers, shuffleArray, sleep, time } from "../lib";

let SORT_SLEEP_DELAY = 150;
let canvasWidth = 400, canvasHeight = canvasWidth, canvasColor = "#303030";
let barCount = 30, isSorting = false;
let data = generateArrayOfRandomNumbers(barCount, canvasHeight);
let regularBarColor = "red", activeBarColor = "blue";
let grabbedBar: null | { i: number, n: number } = null, grabbingBarColor = "green";

const getCanvasMousePos = (event: MouseEvent): [x: number, y: number] => {
    const rect = canvas.getBoundingClientRect();
    return [
        event.clientX - rect.left,
        event.clientY - rect.top
    ];
}
const getBarX = (x: number): number => x - (canvasWidth / barCount * 0.5), mouseIsOnBar = (n: number, y: number): boolean => n > (canvasHeight - y);

const canvas = createElement(null, "canvas", {
    attributes: { width: canvasWidth, height: canvasHeight }, eventListeners: [{
        type: "mousemove", listener: (event) => {
            if (isSorting) return;
            if (!(event instanceof MouseEvent)) return;
            const [x, y] = getCanvasMousePos(event), barX = getBarX(x);

            let index = Math.floor(x / (canvasWidth / barCount))
            let n = data[index];

            if (grabbedBar) {
                canvas.style.cursor = "grabbing";

                requestAnimationFrame(() => {
                    draw(index, grabbedBar ? grabbedBar?.i : canvasWidth);
                    drawBar(grabbedBar ? grabbedBar?.n : 0, barX, grabbingBarColor);
                });
                return;
            }

            if (!mouseIsOnBar(n, y)) {
                canvas.style.cursor = "default";
                requestAnimationFrame(draw);
                return;
            };
            canvas.style.cursor = "pointer";
            requestAnimationFrame(() => {
                draw();
                drawTooltip(event, n);
            });
        }
    }, {
        type: "mouseleave", listener() {
            if (isSorting) return;
            requestAnimationFrame(draw)
        }
    }, {
        type: "mousedown", listener(event) {
            if (isSorting) return;
            if (!(event instanceof MouseEvent)) return;
            if (grabbedBar) return;

            const [x, y] = getCanvasMousePos(event), barX = getBarX(x), i = Math.floor(x / (canvasWidth / barCount));
            const n = data[i];

            if (!mouseIsOnBar(n, y)) return;

            grabbedBar = { i, n };
            canvas.style.cursor = "grabbing";
            requestAnimationFrame(() => {
                draw();
                drawBar(n, barX, grabbingBarColor);
            });
        }
    }, {
        type: "mouseup", listener(event) {
            if (!(event instanceof MouseEvent)) return;
            if (!grabbedBar) return;
            /* Swap */
            const [x] = getCanvasMousePos(event), i = Math.floor(x / (canvasWidth / barCount));

            swap(data, i, grabbedBar.i);

            grabbedBar = null;
            canvas.style.cursor = "default";
            requestAnimationFrame(draw);
        }
    }]
}) as HTMLCanvasElement, ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const drawBar = (n: number, x: number, color = regularBarColor) => {
    let barWidth = canvasWidth / barCount, barHeight = n;
    let y = canvasHeight - n, w = barWidth - 2;
    let barRadius = 3;

    // https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-using-html-canvas
    // rounded Rect
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.moveTo(x + barRadius, y);
    ctx.lineTo(x + w - barRadius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + barRadius);
    ctx.lineTo(x + w, y + barHeight);
    ctx.lineTo(x, y + barHeight);
    ctx.lineTo(x, y + barRadius);
    ctx.quadraticCurveTo(x, y, x + barRadius, y);
    ctx.closePath();
    ctx.fill();
}

const drawTooltip = (event: MouseEvent, text: string | number) => {
    if (typeof text === "number") text = text + "";

    const [x, y] = getCanvasMousePos(event);
    let offset = 30;
    let textX = x, textY = y;
    /*
        if (y - offset < 0) textY += offset;
        if (x - offset < 0) textX += offset;
        if (x + offset > canvasWidth) textX -= offset;
    */
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(text, textX, textY - offset);

}

const draw = (...activeIndices: number[]) => {
    if (!ctx) return;

    /* Background */
    ctx.beginPath();
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    data.forEach((n, i) => drawBar(n, i * (canvasWidth / barCount), activeIndices.includes(i) ? activeBarColor : regularBarColor));
}

const swap = <Type = unknown>(arr: Type[], n1: number, n2: number) => {
    let temp = arr[n1];
    arr[n1] = arr[n2];
    arr[n2] = temp;

    return arr;
}

const bubbleSort = async (data: number[], n = data.length): Promise<number[]> => {
    // https://www.javatpoint.com/bubble-sort
    let swapped = false;
    for (let i = 1; i <= n; i++) {
        await sleep(SORT_SLEEP_DELAY)
        requestAnimationFrame(() => draw(i - 1, i))
        if (data[i - 1] > data[i]) {
            swap(data, i - 1, i);
            swapped = true;
        }
    }
    if (!swapped) return data;
    return bubbleSort(data, n - 1);
}

const combSort = async (arr: number[]) => {
    // https://www.javatpoint.com/comb-sort
    let gap = arr.length;
    let shrink = 1.3;
    let swapped = true;

    while (gap != 1 || swapped) {
        gap = Math.floor(gap / shrink);
        if (gap < 1) gap = 1;
        swapped = false;

        for (let i = 0; i < arr.length - gap; i++) {
            await sleep(SORT_SLEEP_DELAY)
            requestAnimationFrame(() => draw(i, i + gap));

            if (arr[i] > arr[i + gap]) {
                swap(arr, i, i + gap);
                swapped = true;
            }
        }

    }

    return arr;
}

const minMaxSort = async (arr: number[], p = 0, q = arr.length - 1) => {
    // https://www.ijert.org/a-new-approach-to-sorting-min-max-sorting-algorithm
    while (p < q) {
        let minIndex = p, maxIndex = q;

        for (let i = p; i <= q; i++) {
            await sleep(SORT_SLEEP_DELAY);
            requestAnimationFrame(() => draw(p, q, i, maxIndex, minIndex));

            if (arr[i] < arr[minIndex]) {
                minIndex = i;
            } else if (arr[i] > arr[maxIndex]) {
                maxIndex = i;
            }
        }

        if (p === maxIndex) {
            swap(arr, p, minIndex);
            swap(arr, q, minIndex);
        } else if (q === minIndex) {
            swap(arr, q, maxIndex);
            swap(arr, p, maxIndex);
        } else {
            swap(arr, p, minIndex);
            swap(arr, q, maxIndex);
        }

        p++;
        q--;
    }

    return arr;
}

export const createSortBarsContainerNew = () => {
    const container = createElement(null, "div");

    /*Top Bar Element*/createElement(container, "div", "style=display:flex;justify-content:center;", {
        children: [
            createElement(null, "button", "content=Shuffle", "class=btn", {
                eventListeners: [{
                    type: "click",
                    listener: () => {
                        if (isSorting) return;
                        shuffleArray(data);
                        requestAnimationFrame(draw)
                    }
                }]
            }),
            createElement(null, "button", "content=new data", "class=btn", {
                eventListeners: [{
                    type: "click",
                    listener: () => {
                        if (isSorting) return;
                        data = generateArrayOfRandomNumbers(barCount, canvasHeight);
                        requestAnimationFrame(draw)
                    }
                }]
            }),
            createElement(null, "label", "content=Bars count", {
                children: [
                    createElement(null, "input", "type=number", `value=${barCount}`, {
                        eventListeners: [{
                            type: "input",
                            listener: (event) => {
                                let target = event.target as HTMLInputElement;
                                if (isSorting || target.valueAsNumber > (canvasWidth / 2)) return target.valueAsNumber = barCount;
                                barCount = target.valueAsNumber;
                                data = generateArrayOfRandomNumbers(barCount, canvasHeight);

                                requestAnimationFrame(draw)
                                return;
                            }
                        }]
                    })
                ]
            }),
        ]
    });

    container.appendChild(canvas);
    if (!ctx) return container;

    requestAnimationFrame(draw)
    let buttonDivElement = createElement(container, "div");
    const createSortButton = (func: (arr: number[]) => Promise<number[]>, buttonContent: string) => createElement(buttonDivElement, "button", "content=" + buttonContent, "class=btn", {
        eventListeners: [{
            type: "click",
            listener: async () => {
                if (isSorting) return;
                isSorting = true;
                // shuffleArray(data);
                requestAnimationFrame(draw);
                await sleep(SORT_SLEEP_DELAY);

                time.sec(func(data)).then((seconds) => {
                    requestAnimationFrame(draw);
                    console.log(`${seconds} seconds`);
                    isSorting = false;
                });
            }
        }]
    });

    createSortButton(bubbleSort, "Bubble Sort")
    createSortButton(combSort, "Comb Sort")
    createSortButton(minMaxSort, "Min-Max Sort")

    const inputContainerElement = createElement(container, "div");
    const RANGE_INPUT_ID = "rangeInputID";
    const rangeInputLabelElement = createElement(inputContainerElement, "label", `for=${RANGE_INPUT_ID}`, `content=${SORT_SLEEP_DELAY}`)
    const rangeInputElement = createElement(inputContainerElement, "input", "type=range", "min=0", "max=500", `value=${SORT_SLEEP_DELAY}`, `id=${RANGE_INPUT_ID}`) as HTMLInputElement;
    rangeInputElement.addEventListener("input", () => {
        SORT_SLEEP_DELAY = rangeInputElement.valueAsNumber;
        rangeInputLabelElement.textContent = rangeInputElement.value;
    });


    return container;
}

export default createSortBarsContainerNew;