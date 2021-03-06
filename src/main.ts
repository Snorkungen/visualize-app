import './style.css'
import { createElement } from './lib';
import createOrgChartContainer from './orgChart';
import createSortBarsContainer from './sortBars';
import createSortBarsContainerNew from './sortBars/sortBars.new';
import createBlockArtContainer from './blockArt';

export const app = document.querySelector<HTMLDivElement>('#app');

const sortBarsContainer = createSortBarsContainer();
const sortBarsContainerNew = createSortBarsContainerNew();
const orgChartContainer = createOrgChartContainer();
const blockArtContainer = createBlockArtContainer();

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
    createSetActiveContainerButton(sortBarsContainerNew, "Sort Bars New"),
    createSetActiveContainerButton(blockArtContainer, "Block Art")
  ]
})

const container = createElement(app, "div", {
  children: [blockArtContainer]
});