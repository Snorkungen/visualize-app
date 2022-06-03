import { createElement, sleep } from "../lib";
import { imgProcessing } from "./imgProcessing";

const canvasWidth = 400, canvasHeight = canvasWidth, canvasColor = "#303030";
export let size = 5, blockArtSize = canvasWidth / size, blockFillColor = "#BF4040";
let mouseIsDown = false;
let sleepDelay = 5;

let mouseDownAction: "fill" | "replace" = "fill";
let lineRadius = 1;

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

                switch (mouseDownAction) {
                    case "fill":
                        boringFill(xIndex, yIndex, block.color);
                        break;
                    case "replace":
                        replaceColor(block.color, blockFillColor);
                        break;
                }

                return;
            }
        }, {
            type: "mouseup", listener(event) {
                if (!(event instanceof MouseEvent)) return;
                if (!mouseIsDown) return;
                let [x, y] = getCanvasMousePos(event);
                let xIndex = Math.floor(x / size), yIndex = Math.floor(y / size);
                drawCircle(lineRadius, xIndex, yIndex)
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
                drawCircle(lineRadius, xIndex, yIndex)
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

const downloadCanvasAsPng = () => {
    let name = prompt("Name your image.")
    if (!name) return;
    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = `${name}-canvas-image.png`;
    anchor.click();
}

const replaceColor = (currColor: string, newColor: string) => {
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix.length; y++) {
            let block = matrix[x][y];
            if (block.color === currColor) block.color = newColor;
        }
    }

    return matrix;
}

export const createBlockArtContainer = () => {
    const container = createElement(null, "div");

    /* Canvas Background */
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* Top bar */
    createElement(container, "div", {
        children: [
            createElement(null, "label", {
                attributes: { class: "btn", style: `background-color:${blockFillColor};` },
                children: [
                    "Color",
                    createElement(null, "input", "type=color", "style=display:none;", `value=${blockFillColor}`, {
                        eventListeners: [{
                            type: "input", listener(ev) {
                                let elem = ev.target as HTMLInputElement;
                                blockFillColor = elem.value;
                                if (!elem.parentElement) return;
                                elem.parentElement.style.backgroundColor = blockFillColor
                            }
                        }]
                    })
                ]
            }),
            createElement(container, "button", "class=btn", "content=Clear", { eventListeners: [{ type: "click", listener() { matrix = initMatrix() } }] })
        ]
    });

    /* Append canvas to DOM */
    container.appendChild(canvas);

    /* Download & Upload */
    createElement(container, "div", {
        children: [
            createElement(null, "button", "class=btn", "content=Download", {
                eventListeners: [{
                    type: "click", listener: downloadCanvasAsPng
                }]
            }),
            createElement(null, "label", {
                attributes: { class: "btn" },
                children: ["Upload",
                    createElement(null, "input", {
                        attributes: {
                            type: "file",
                            style: "display:none;"
                        },
                        eventListeners: [{
                            type: "input", listener(event) {
                                let input = event.currentTarget as HTMLInputElement;
                                if (!input.files) return;
                                let file = input.files[0];
                                if (!file.type.includes("image")) return;

                                let fileReader = new FileReader();
                                fileReader.readAsDataURL(file)

                                fileReader.addEventListener("loadend", () => {
                                    let result = fileReader.result;
                                    if (typeof result !== "string") return;
                                    imgProcessing(result)
                                })
                            }
                        }]
                    })]
            })
        ]
    })

    return container;
};

export default createBlockArtContainer;