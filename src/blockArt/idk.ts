import Block from "./Block";

export const euclideanDistance = (block_1: Block, block_2: Block) => {
    //https://en.wikipedia.org/wiki/Euclidean_distance
    let { x: x_1, y: y_1 } = block_1.pos, { x: x_2, y: y_2 } = block_2.pos;
    return Math.sqrt(
        Math.pow(x_1 - x_2, 2) + Math.pow(y_1 - y_2, 2)
    )
}
export const manhattanDistance = (block_1: Block, block_2: Block) => {
    // https://www.geeksforgeeks.org/a-search-algorithm/
    let { x: x_1, y: y_1 } = block_1.pos, { x: x_2, y: y_2 } = block_2.pos;
    return Math.abs(x_1 - x_2) + Math.abs(y_1 - y_2);
}

export const diagonalDistance = (block_1: Block, block_2: Block, D: number, D2: number) => {
    // https://www.geeksforgeeks.org/a-search-algorithm/
    let { x: x_1, y: y_1 } = block_1.pos, { x: x_2, y: y_2 } = block_2.pos;
    let dx = Math.abs(x_1 - x_2),
        dy = Math.abs(y_1 - y_2)
    return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
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

export const getPath = (matrix: Block[][], startBlock: Block, endBlock: Block) => {
    const path: Block[] = [startBlock];

    while (matrix.length * 2 > path.length) {
        let block = path.at(-1);
        if (!block) break;

        let [shortestDistance, shortestDistanceBlock] = [matrix.length ** 2, block];

        for (let nBlock of getNeighbours(matrix, block)) {
            if (nBlock === endBlock) break;

            let distance = euclideanDistance(nBlock, endBlock);

            if (distance < shortestDistance) {
                shortestDistance = distance;
                shortestDistanceBlock = nBlock;
            }
        }

        if (shortestDistanceBlock === block) break;

        path.push(shortestDistanceBlock)
    }

    return path;
}