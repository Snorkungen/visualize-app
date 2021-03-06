import { canvas, matrix, size } from "./blockArt";
import { rgbtohex } from "../lib";
import { limitColors, getImageBlockColors, getAllColorsFromColorsMatrix, colorLuminance, } from "./color";

export const imgProcessing = async (src: string) => {
    let colorsMatrix = await getImageBlockColors(src, {
        canvas,
        matrixSize: matrix.length,
        blockSize: size
    });

    let allColors = getAllColorsFromColorsMatrix(colorsMatrix);

    let popColors = limitColors(allColors, 50),// getMostPopularColors(allColors).splice(0, 1000),
        popColorLuminance = popColors.map((rgba) => colorLuminance(...rgba));


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