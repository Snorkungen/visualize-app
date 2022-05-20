import { createElementNS } from "./lib";
import { barWidth, barsGroupElement, totalHeight } from "./main"

export const useRenderBars = () => (data: number[]) => {
    barsGroupElement.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        let n = data[i]
        createElementNS(barsGroupElement, "rect", "fill=red", "ry=1%", `height=${n}`, `width=${barWidth - 0.5}%`, `y=${totalHeight - n}`, "x=" + i * barWidth, {
            children: [
                createElementNS(null, "title", `content=${n}`)
            ]
        })
    }
};

export default useRenderBars;