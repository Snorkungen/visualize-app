import { createElementNS } from "./lib";

export const useRenderBars = ({ parent, barWidth, totalHeight }: {
    parent: SVGElement;
    barWidth: number;
    totalHeight: number;
}) => (data: number[]) => {
    parent.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        let n = data[i]
        createElementNS(parent, "rect", "fill=red", "ry=2%", `height=${n}`, `width=${barWidth - 0.5}%`, `y=${totalHeight - n}`, "x=" + i * barWidth, {
            eventListeners: [
                {
                    type: "mouseenter",
                    listener: (event) => {
                        console.log(event)
                    }
                },
                {
                    type: "mouseleave",
                    listener: (event) => {
                        console.log(event)
                    }
                }
            ]
        })
    }
};

export default useRenderBars;