const attributesHandler = <K extends keyof (HTMLElementEventMap & SVGElementEventMap)>(element: HTMLElement | SVGElement, ...attributes: (string | {
    type: K;
    listener: (ev: Event | HTMLElementEventMap[K] | SVGElementEventMap[K]) => any;
    options?: (boolean | AddEventListenerOptions) | (boolean | AddEventListenerOptions)
})[]) => {
    for (const attribute of attributes) {
        if (typeof attribute === "object") {
            element.addEventListener(attribute.type, attribute.listener, attribute.options)
            continue;
        }
        const [qualifiedName, value] = attribute.split("=");
        if (!qualifiedName) continue;
        if (qualifiedName == "content") {
            element.textContent = value;
        } else {
            element.setAttribute(qualifiedName, value);
        }
    }

}

export const createElement = (
    parent: null | HTMLElement,
    elemName: string,
    ...attributes: Parameters<typeof attributesHandler>[1][]
) => {
    const element = document.createElement(elemName);

    attributesHandler(element, ...attributes);

    if (parent) {
        parent.appendChild(element);
    };

    return element;
};

export const createElementNS = (
    parent: null | HTMLElement | SVGElement,
    elemName: string,
    ...attributes: Parameters<typeof attributesHandler>[1][]
) => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", elemName);

    attributesHandler(element, ...attributes);
 
    if (parent) {
        parent.appendChild(element);
    };

    return element;
};
EventTarget