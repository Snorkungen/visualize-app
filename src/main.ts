import './style.css'
import { createElement } from './lib';
import createOrgChartContainer from './orgChart';
import createSortBarsContainer from './sortBars';

export const app = document.querySelector<HTMLDivElement>('#app');

const sortBarsContainer = createSortBarsContainer();
const orgChartContainer = createOrgChartContainer();

const createSetActiveContainerButton = (element: Element, content: string) => createElement(null, "button", "class=btn", `content=${content}`, {
  eventListeners: [{
    type: "click",
    listener: () => {
      container.innerHTML = "";
      container.appendChild(element)
    }
  }]
});

createElement(app, "div", {
  attributes: {
    style: "display:flex;"
  },
  children: [
    createSetActiveContainerButton(sortBarsContainer, "Sort Bars"),
    createSetActiveContainerButton(orgChartContainer, "Org Chart"),
  ]
})

const container = createElement(app, "div", {
  children: [sortBarsContainer]
});