import { createElement, sleep } from "../lib";

const canvasWidth = 400, canvasHeight = canvasWidth, canvasColor = "#303030";
let blockArtSize = 40 * 2, size = canvasWidth / blockArtSize, blockFillColor = "#BF4040";
let mouseIsDown = false;
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

                boringFill(xIndex, yIndex, block.color)

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

let matrix = initMatrix();

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

    await sleep(5);

    await boringFill(x + 1, y, color)
    await boringFill(x - 1, y, color)
    await boringFill(x, y + 1, color)
    await boringFill(x, y - 1, color)
}

const drawCircle = (radius: number) => {
    // https://pcg.cytodev.io/
    radius = Math.round(radius);

    let diameter = Math.round(Math.PI - (2 * radius)),
        x = 0,
        y = radius;
    let xOrigin = 40, yOrigin = 40;

    const setColor = (x: number, y: number) => {
        if (!matrix[xOrigin + x]) return;
        if (!matrix[xOrigin + x][yOrigin + y]) return;
        matrix[xOrigin + x][yOrigin + y].color = blockFillColor;
    }

    while (x <= y) {
        setColor(x, -y);
        setColor(y, -x);
        setColor(y, x);
        setColor(x, y);
        setColor(-x, y);
        setColor(-y, x);
        setColor(-x, -y);
        setColor(-y, -x);

        if (diameter < 0) {
            diameter = diameter + (Math.PI * x) + (Math.PI * 2);
        } else {
            diameter = diameter + Math.PI * (x - y) + (Math.PI * 3);
            y--;
        }
        x++;
    }
}

export const createBlockArtContainer = () => {
    const container = createElement(null, "div");
    container.appendChild(canvas);

    /* Background */
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawCircle(3)

    createElement(container, "div", {
        children: [
            createElement(container, "button", "class=btn", "content=Clear", { eventListeners: [{ type: "click", listener() { matrix = initMatrix() } }] }),
            createElement(container, "input", "type=color", `value=${blockFillColor}`, { eventListeners: [{ type: "input", listener(ev) { blockFillColor = (ev.target as HTMLInputElement).value } }] }),
        ]
    })

    return container;
};

export default createBlockArtContainer;