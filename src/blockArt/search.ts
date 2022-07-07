import Block from "./Block";
import { sleep } from "../lib";
import { matrix, canvasColor } from "./blockArt";

type BlockType = Block | null;

window.addEventListener("keypress", (event) => {
    switch (event.key) {
        case "w":
            return searchMode.action = "wall";
        case "s":
            return searchMode.action = "start";
        case "t":
            return searchMode.action = "target";
        default:
            if(searchMode.canRun) searchMode.runDumbSearch();
    }
    return;
})

export const searchMode = {
    canRun: true,
    action: <"wall" | "target" | "start">"wall",
    targetBlock: <BlockType>null,
    startBlock: <BlockType>null,
    isMouseDown: false,
    delayTime: 50,
    color: {
        wall: "#3f3f3f",
        target: "#CEEA61",
        start: "#EA9C61",
        path: "#F7F4F1",
        fail: "#DD3d3d"
    },
    mousedown(event: MouseEvent, block: Block) {
        // this.startBlock = matrix[10][9]
        // this.targetBlock = matrix[30][20], this.runDumbSearch()


        block.color = this.color[this.action]
        switch (this.action) {
            case "wall":
                this.isMouseDown = true;
                break;
            case "start":
                if (this.startBlock !== block) {
                    if (this.startBlock) this.startBlock.color = canvasColor;
                    this.startBlock = block;
                }
                break;
            case "target":
                if (this.targetBlock !== block) {
                    if (this.targetBlock) this.targetBlock.color = canvasColor;
                    this.targetBlock = block;
                }
        }
        return;
    },
    mouseup(event: MouseEvent, block: Block) {
        this.isMouseDown = false;
    },
    mousemove(event: MouseEvent, block: Block) {

        if (this.action === "wall") {
            if (!this.isMouseDown) return;
            block.color = this.color.wall;
        }
    },
    mouseleave(event: MouseEvent) {
        this.isMouseDown = false;
    },
    async runDumbSearch() {
        if (!this.startBlock) return console.warn("Start block undefined");
        if (!this.targetBlock) return console.warn("Target block undefined");
        this.canRun = false;
        let path = [this.startBlock];

        while (matrix.length * 2 > path.length) {
            let block = path[path.length - 1];
            if (!block) return;

            block.color = this.color.path

            let shortestDistBlock: BlockType = null,
                shortestDist: number | undefined;


            for (let nBlock of getNeighbours(matrix, block)) {
                if (nBlock === this.targetBlock) {
                    console.log("Target Found")
                    return
                };

                if(nBlock.color === this.color.path) continue;
                if (nBlock.color === this.color.wall) continue;

                let distance = euclideanDistance(nBlock, this.targetBlock);

                await sleep(this.delayTime)

                if (shortestDist) {
                    if (distance < shortestDist) {
                        shortestDistBlock = nBlock;
                        shortestDist = distance;
                    }
                } else {
                    shortestDistBlock = nBlock;
                    shortestDist = distance;
                }
            }
            if (shortestDistBlock === block) break;
            if (shortestDistBlock) {
                path.push(shortestDistBlock)

            } else {
                console.log("No block")

                break
            }
        }
        this.canRun = true;
    }
};

export const euclideanDistance = (block_1: Block, block_2: Block) => {
    //https://en.wikipedia.org/wiki/Euclidean_distance
    let { x: x_1, y: y_1 } = block_1.pos, { x: x_2, y: y_2 } = block_2.pos;
    return Math.sqrt(
        Math.pow(x_1 - x_2, 2) + Math.pow(y_1 - y_2, 2)
    )
}

export const getNeighbours = (matrix: Block[][], block: Block) => {
    const { size, pos: { x, y } } = block,
        xIndex = x / size, yIndex = y / size;

    if (!matrix[xIndex - 1]) matrix[xIndex - 1] = []
    if (!matrix[xIndex + 1]) matrix[xIndex + 1] = []

    let top = matrix[xIndex][yIndex - 1],
        topRight = matrix[xIndex + 1][yIndex - 1],
        right = matrix[xIndex + 1][yIndex],
        bottomRight = matrix[xIndex + 1][yIndex + 1],
        bottom = matrix[xIndex][yIndex + 1],
        bottomLeft = matrix[xIndex - 1][yIndex + 1],
        left = matrix[xIndex - 1][yIndex],
        topLeft = matrix[xIndex - 1][yIndex - 1]

    return [top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft].filter(Boolean);
}
