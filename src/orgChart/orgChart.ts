import { createElement, createElementNS } from "../lib"

let width = 600, height = 200;
let personWidth = 60, personHeight = 20;

type Person = {
    name: string;
    sub?: Person[]
}

const org: Person = {
    name: "Boss",
    sub: [
        { name: "Assistant", sub: [{ name: "Assistant-Assistant" }, { name: "Noob" }] },
        { name: "Secret Helper", sub: [{ name: "Liam" }] },
        { name: "Secret Helper" },
        { name: "Master-Assasin", sub: [{ name: "Assasin", sub: [{ name: "Assasin-Apprentice", sub: [{ name: "Joe" }, { name: "Michelle" }] }, { name: "Noob" }] }] },
        { name: "Master-Assasin", sub: [{ name: "Assasin", sub: [{ name: "Assasin-Apprentice", sub: [{ name: "Joe" }, { name: "Michelle" }] }, { name: "Noob" }] }] },
    ]
}
const calcXCenter = (w: number) => w / 2 - (personWidth / 2)




export const createOrgChartContainer = () => {
    const container = createElement(null, "div");
    const SVGElement = createElementNS(container, "svg", `viewBox=0 0 ${width} ${height}`, `width=${width + height}`, "overflow=scroll", {
        children: [
            createElementNS(null, "rect", `width=${width}`, `height=${height}`, `fill=${"red"}`)
        ]
    });

    const groupElement = createElementNS(SVGElement, "g");

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

        createElementNS(groupElement, "text", `content=${person.name}`, {
            attributes: {
                x: startX,
                y: startY,
                dy: personHeight / 2,
                "font-size": "11px",
                textLength: personWidth,
                lengthAdjust: "spacingAndGlyphs",
                fill: "white"
            }
        })

        let sub: SVGRectElement[] = [];

        if (person.sub) {
            let sub_sub_count = 0;
            for (const subPerson of person.sub) {
                if (subPerson.sub && subPerson.sub.length) sub_sub_count++;
            }
            for (const subPerson of person.sub) {
                let i = person.sub.indexOf(subPerson);
                let w = availWidth / person.sub.length, offset = w * i + availWidthStart;
                let x = calcXCenter(w) + offset, y = startY + (personHeight * 2);

                let subI = i ? i - (person.sub.length - sub_sub_count) : i, subAvailWidth = availWidth / sub_sub_count;

                sub.push(
                    drawPerson(subPerson, person.sub.length == 1 ? startX : x, y, subAvailWidth, subAvailWidth * subI + availWidthStart)
                )
            }
        }

        for (const subRect of sub) {
            createElementNS(groupElement, "path", {
                attributes: {
                    fill: "none",
                    stroke: "blue",
                    d: `M${startX + personWidth / 2},${startY + personHeight}
                    V${startY + personHeight * 1.5}
                    H${subRect.x.animVal.value + personWidth / 2}
                    V${subRect.y.animVal.value}
                    `
                }
            })
        }


        return elem;
    }

    drawPerson(org);

    return container;
}

export default createOrgChartContainer;