import { createElementNS } from "./lib";
import { app } from "./main";

let width = 300, height = 200;
let personWidth = 60, personHeight = 20;

type Person = {
    name: string;
    sub?: Person[]
}

const org: Person = {
    name: "Boss",
    sub: [
        { name: "Assistant", sub: [{ name: "Assistant-Assistant" }, { name: "Noob" }] },
        { name: "Master-Assasin", sub: [{ name: "Assasin", sub: [{ name: "Assasin-Apprentice" }, { name: "Noob" }] }] },
    ]
}

export const orgChart = () => {
    const SVGElement = createElementNS(app, "svg", `viewBox=0 0 ${width} ${height}`, `width=${width + height}`, {
        children: [
            createElementNS(null, "rect", `width=${width}`, `height=${height}`, `fill=${"red"}`)
        ]
    });


    const groupElement = createElementNS(SVGElement, "g");


    const calcXCenter = (w: number) => w / 2 - (personWidth / 2)

    const drawPerson = (person: Person, startX = calcXCenter(width), startY = personHeight / 2, availWidth = width, availWidthStart = availWidth * 0) => {
        const elem = createElementNS(groupElement, "rect", {
            children: [createElementNS(null, "title", `content=${person.name}`)],
            attributes: {
                width: personWidth,
                height: personHeight,
                fill: "blue",
                x: startX,
                y: startY
            }
        }) as SVGRectElement;

        let sub: SVGRectElement[] = [];

        if (person.sub) {
            for (const subPerson of person.sub) {
                let i = person.sub.indexOf(subPerson);
                let w = availWidth / person.sub.length, offset = w * i + availWidthStart;
                let x = calcXCenter(w) + offset, y = startY + (personHeight * 2);

                sub.push(
                    drawPerson(subPerson, x, y, w, w * i + availWidthStart)
                )
            }
        }

        for (const subRect of sub) {
            createElementNS(groupElement, "line", {
                attributes: {
                    x1: startX + personWidth / 2,
                    y1: startY + personHeight,
                    x2: subRect.x.animVal.value + personWidth / 2,
                    y2: subRect.y.animVal.value,
                    stroke: "blue"
                }
            })
        }


        return elem;
    }

    drawPerson(org);
}

export default orgChart;