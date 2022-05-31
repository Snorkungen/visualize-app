import { createElement, sleep } from "../lib";
import { imgProcessing } from "./imgProcessing";

const canvasWidth = 400, canvasHeight = canvasWidth, canvasColor = "#303030";
export let blockArtSize = 80, size = canvasWidth / blockArtSize, blockFillColor = "#BF4040";
let mouseIsDown = false;
let sleepDelay = 5;

export const canvas = createElement(null, "canvas", {
    attributes: { width: canvasWidth, height: canvasHeight },
    eventListeners: [
        {
            type: "mousedown",
            listener(event) {
                if (!(event instanceof MouseEvent)) return;
                event.preventDefault();
                if (event.buttons === 1) return mouseIsDown = true;

                let [x, y] = getCanvasMousePos(event);
                let xIndex = Math.floor(x / size), yIndex = Math.floor(y / size);
                let block = matrix[xIndex][yIndex];

                boringFill(xIndex, yIndex, block.color);

                return;
            }
        }, {
            type: "mouseup", listener(event) {
                if (!(event instanceof MouseEvent)) return;
                if (!mouseIsDown) return;
                let [x, y] = getCanvasMousePos(event);
                let xIndex = Math.floor(x / size), yIndex = Math.floor(y / size);
                let block = matrix[xIndex][yIndex];
                block.color = blockFillColor
                mouseIsDown = false;
            }
        }, {
            type: "mousemove",
            listener(event) {
                if (!(event instanceof MouseEvent)) return;
                if (!mouseIsDown) return;
                let [x, y] = getCanvasMousePos(event);
                let xIndex = Math.floor(x / size), yIndex = Math.floor(y / size);
                let block = matrix[xIndex][yIndex];
                block.color = blockFillColor
                drawCircle(3, xIndex, yIndex)
            }
        }, {
            type: "mouseleave", listener() {
                mouseIsDown = false
            }
        }
    ]
}) as HTMLCanvasElement, ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

import Block from "./Block";
const initMatrix = () => {
    const matrix: Block[][] = [];

    for (let x = 0; x < blockArtSize; x++) {
        matrix[x] = [];
        for (let y = 0; y < blockArtSize; y++) {
            matrix[x][y] = new Block(x * size, y * size, size, canvasColor)
        }
    }

    return matrix;
}

export let matrix = initMatrix();

const getCanvasMousePos = (event: MouseEvent): [x: number, y: number] => {
    const rect = canvas.getBoundingClientRect();
    return [
        event.clientX - rect.left,
        event.clientY - rect.top
    ];
}

const boringFill = async (x: number, y: number, color: string) => {
    if (!matrix[x]) return;
    let block = matrix[x][y];
    if (!block || color !== block.color || blockFillColor === block.color) return;

    block.color = blockFillColor;

    await sleep(sleepDelay);

    await boringFill(x + 1, y, color)
    await boringFill(x - 1, y, color)
    await boringFill(x, y + 1, color)
    await boringFill(x, y - 1, color)
}

const drawCircle = async (radius: number, xOrigin = 40, yOrigin = 40) => {
    // https://www.redblobgames.com/grids/circle-drawing/
    radius += 0.5;

    let top = Math.floor(yOrigin - radius),
        bottom = Math.ceil(yOrigin + radius),
        left = Math.floor(xOrigin - radius),
        right = Math.ceil(xOrigin + radius);

    for (let y = top; y <= bottom; y++) {
        for (let x = left; x <= right; x++) {
            if ((xOrigin - x) ** 2 + (yOrigin - y) ** 2 <= radius ** 2) {
                if (!matrix[x] || !matrix[x][y]) continue;
                await sleep(sleepDelay)
                matrix[x][y].color = blockFillColor;
            }
        }
    }

    bottom
}

const downloadCanvasAsPng = (name: string) => {
    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = `${name}-canvas-image.png`;
    anchor.click();
}

export const createBlockArtContainer = () => {
    const container = createElement(null, "div");
    container.appendChild(canvas);

    /* Background */
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    createElement(container, "div", {
        children: [
            createElement(container, "button", "class=btn", "content=Clear", { eventListeners: [{ type: "click", listener() { matrix = initMatrix() } }] }),
            createElement(container, "input", "type=color", `value=${blockFillColor}`, { eventListeners: [{ type: "input", listener(ev) { blockFillColor = (ev.target as HTMLInputElement).value } }] }),
            createElement(container, "button", "class=btn", "content=Download", { eventListeners: [{ type: "click", listener() { downloadCanvasAsPng(Date.now() + "") } }] }),
            createElement(container, "button", "class=btn", "content=Get image Data", {
                eventListeners: [{
                    type: "click", listener() {
                        imgProcessing()
                    }
                }]
            }),
        ]
    })

    return container;
};

export default createBlockArtContainer;