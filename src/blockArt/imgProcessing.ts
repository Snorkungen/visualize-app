import { canvas, matrix, size } from "./blockArt";
import { rgbtohex } from "../lib";
import image from "../../pic.jpg"
import { colorsMatrixType, getImageBlockColors, getAllColorsFromColorsMatrix, getMostPopularColors, colorLuminance, similarColor } from "./color";

export const imgProcessing = async () => {
    let colorsMatrix = await getImageBlockColors(image, {
        canvas,
        matrixSize: matrix.length,
        blockSize: size
    });

    let allColors = getAllColorsFromColorsMatrix(colorsMatrix);
    let popColors = getMostPopularColors(allColors).splice(0, 1000),
        popColorLuminance = popColors.map((rgba) => colorLuminance(...rgba));


    // Join similar colors

    let _x: colorsMatrixType[number] = [];
    for (let i = 0; i < popColors.length; i++) {
        let b = false;
        for (let co in _x) {
            if (similarColor(_x[co], popColors[i], 5)) b = true;
        }
        if (b) continue;

        _x.push(popColors[i])
    }

    popColors = _x
    popColorLuminance = popColors.map((rgba) => colorLuminance(...rgba))

    matrix.forEach((row, x) => row.forEach((block, y) => {
        let color = colorsMatrix[x][y];

        let lum = colorLuminance(...color),
            popLum = closest(lum, popColorLuminance),
            popLumIndex = popColorLuminance.indexOf(popLum);

        color = popColors[popLumIndex];

        block.color = rgbtohex(...color)
    }));
};

export default imgProcessing;

function closest(needle: number, haystack: number[]) {
    return haystack.reduce((a, b) => {
        let aDiff = Math.abs(a - needle);
        let bDiff = Math.abs(b - needle);

        if (aDiff == bDiff) {
            return a > b ? a : b;
        } else {
            return bDiff < aDiff ? b : a;
        }
    });
}