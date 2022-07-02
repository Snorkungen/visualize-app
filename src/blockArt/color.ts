export type colorsMatrixType = [number, number, number, number][][];

export const getImageBlockColors = (imgSrc: string, options: {
    canvas: {
        width: number,
        height: number,
    },
    matrixSize: number,
    blockSize: number,
}) => new Promise<colorsMatrixType>((resolve) => {
    const imgElement = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const colorsMatrix: colorsMatrixType = [];

    if (!ctx) return resolve(colorsMatrix);

    canvas.width = options.canvas.width;
    canvas.height = options.canvas.height;
    imgElement.src = imgSrc;
    imgElement.addEventListener("loadend", () => {

        // Scale and draw image
        let hRatio = canvas.width / imgElement.width,
            vRatio = canvas.height / imgElement.height,
            ratio = Math.min(hRatio, vRatio);
        let centerShift_x = (canvas.width - imgElement.width * ratio) / 2,
            centerShift_y = (canvas.height - imgElement.height * ratio) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.width, centerShift_x, centerShift_y,
            imgElement.width * ratio, imgElement.height * ratio);

        for (let x = 0; x < options.matrixSize; x++) {
            colorsMatrix[x] = [];
            for (let y = 0; y < options.matrixSize; y++) {
                let imageData = ctx.getImageData(options.blockSize * x, options.blockSize * y, options.blockSize, options.blockSize);
                let blockColors: colorsMatrixType[number] = [];

                for (let i = 0; i < imageData.data.length; i += 4) {
                    blockColors.push([
                        imageData.data[i + 0],
                        imageData.data[i + 1],
                        imageData.data[i + 2],
                        imageData.data[i + 3],
                    ]);
                }

                let averageBlockColor = blockColors.reduce((res, curr) => {
                    return [res[0] + curr[0], res[1] + curr[1], res[2] + curr[2], res[3] + curr[3]]
                }, [0, 0, 0, 0]).map((v) => Math.floor(v / blockColors.length));

                colorsMatrix[x][y] = averageBlockColor as colorsMatrixType[number][number];
            }
        }


        resolve(colorsMatrix);
    });

});

export const getAllColorsFromColorsMatrix = (colorsMatrix: colorsMatrixType) => {
    let allColors: colorsMatrixType[number] = [];
    colorsMatrix.forEach((colors) => colors.forEach((color) => allColors.push(color)));
    return allColors;
};

export const getMostPopularColors = (colors: colorsMatrixType[number]) => {
    const colorCounts: { [x: string]: number } = {};
    const sortedColors: colorsMatrixType[number] = [];

    for (const color of colors) {
        let key = JSON.stringify(color);

        if (colorCounts[key]) colorCounts[key]++;
        else colorCounts[key] = 1;
    }

    for (const key in colorCounts) {
        sortedColors.push(JSON.parse(key));
    }

    return sortedColors.sort((a, b) => {
        let aKey = JSON.stringify(a), bKey = JSON.stringify(b);
        return colorCounts[bKey] - colorCounts[aKey];
    });
}

export const colorLuminance = (...[red, green, blue]: number[]) => {
    const a = [red, green, blue].map((n) => {
        n /= 255;
        return n <= 0.03928 ?
            n / 12.92 :
            Math.pow((n + 0.055) / 1.055, 2.4)
    });

    return (a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722);
}

export const similarColor = (color1: colorsMatrixType[number][number], color2: colorsMatrixType[number][number], similarN = 10) => {
    let count = 0;

    if (!color1 || !color2) return false;

    for (let i = 0; i < color1.length; i++) {
        let n1 = color1[i], n2 = color2[i];
        if (n1 + similarN > n2 && n1 - similarN < n2) {
            count++;
        }
    }

    return count === color1.length;
}

export const limitColors = (colors: colorsMatrixType[number], limit: number, n = 4): colorsMatrixType[number] => {
    const newColors: colorsMatrixType[number] = [];

    for (const color of colors) {
        if (!color) break;
        let bool = !!newColors.find((clr) => similarColor(clr, color, n));
        if (bool) continue;
        newColors.push(color);
    }

    if (newColors.length > limit) return limitColors(newColors, limit, n + 1);
    return newColors
}