import { canvas, matrix, size, blockArtSize } from "./blockArt";
import { rgbtohex } from "../lib";
import image from "../../pic.jpg"
export const imgProcessing = async (ctx: CanvasRenderingContext2D,) => {
    const img = new Image()
    img.addEventListener("load", () => {
        drawImageScaled(img, ctx)

        let colorsMatrix: string[][] = [];
        for (let x = 0; x < blockArtSize; x++) {
            colorsMatrix[x] = [];
            for (let y = 0; y < blockArtSize; y++) {
                let _x = [];
                let imgData = ctx.getImageData(size * x, size * y, size, size);
                for (let i = 0; i < imgData.data.length; i += 4) {
                    _x.push(Array.from("abcd").map((_, j) => imgData.data[i + j]))
                }
                let __c = _x.reduce((res, curr) => {
                    return [res[0] + curr[0], res[1] + curr[1], res[2] + curr[2], res[3] + curr[3]]
                }, [0, 0, 0, 0]).map((v) => Math.floor(v / _x.length))

                colorsMatrix[x][y] = rgbtohex(...__c)
            }
        }

        matrix.forEach((row, x) => row.forEach((block, y) => {
            block.color = colorsMatrix[x][y]
        }))

    })
    img.src = image;
};

export default imgProcessing;
function drawImageScaled(img: HTMLImageElement, ctx: CanvasRenderingContext2D) {
    var canvas = ctx.canvas;
    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);
    var centerShift_x = (canvas.width - img.width * ratio) / 2;
    var centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
}