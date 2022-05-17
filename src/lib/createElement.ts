export const createElement = (
    parent: null | HTMLElement,
    elemName: string,
    ...attributes: string[]
) => {
    const element = document.createElement(elemName);

    for (const attribute of attributes) {
        const [qualifiedName, value] = attribute.split("=");
        if (!qualifiedName) continue;
        if (qualifiedName == "content") {
            element.textContent = value;
        } else {
            element.setAttribute(qualifiedName, value);
        }
    }

    if (parent) {
        parent.appendChild(element);
    };

    return element;
};

export const createElementNS = (
    parent: null | HTMLElement | SVGElement,
    elemName: string,
    ...attributes: string[]
) => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", elemName);

    for (const attribute of attributes) {
        const [qualifiedName, value] = attribute.split("=");
        if (!qualifiedName) continue;
        element.setAttribute( qualifiedName, value);
    }

    if (parent) {
        parent.appendChild(element);
    };

    return element;
};
