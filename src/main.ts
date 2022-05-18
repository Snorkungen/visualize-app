import { createElement, createElementNS } from './lib/createElement';
import './style.css'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
function shuffleArray<Type = unknown>(arr: Type[]) {
  arr.sort(() => Math.random() - 0.5);
}

const app = document.querySelector<HTMLDivElement>('#app')!

let svgElement = createElementNS(app, "svg", "xmlns:xlink=http://www.w3.org/1999/xlink", "viewBox=0 0 100 100", "width=200");
/* background */ createElementNS(svgElement, "rect", "height=100", "width=100", "fill=#303030");
let barsGroupElement = createElementNS(svgElement, "g");

const renderBars = (data: number[]) => {
  barsGroupElement.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    let n = data[i]
    createElementNS(barsGroupElement, "rect", "fill=red", `height=${n}`, "width=4", "x=" + i * 5)
  }
};

const setBarsActive = (...indices: number[]) => {
  for (const i of indices) {
    let el = barsGroupElement.children[i];
    if(!el) continue;
    el.setAttribute("fill", "green");
  }
}


let testData = [
  43, 3, 54, 2, 65, 34, 23, 45, 23, 42, 1, 21, 54, 35, 43, 55, 24, 43, 2, 2
];
const SORT_SLEEP_DELAY = 150;

renderBars(testData);

const swap = <Type = unknown>(arr: Type[], n1: number, n2: number) => {
  let temp = arr[n1];
  arr[n1] = arr[n2];
  arr[n2] = temp;

  return arr;
}

const bubbleSort = async (data: number[], n = data.length): Promise<number[]> => {
  // https://www.javatpoint.com/bubble-sort
  let swapped = false;
  for (let i = 1; i <= n; i++) {
    await sleep(SORT_SLEEP_DELAY)
    renderBars(data)
    setBarsActive(i - 1, i)
    if (data[i - 1] > data[i]) {
      swap(data, i - 1, i);
      swapped = true;
    }
  }
  if (!swapped) return data;
  return bubbleSort(data, n - 1);
}

const combSort = async (arr: number[]) => {
  // https://www.javatpoint.com/comb-sort
  let gap = arr.length;
  let shrink = 1.3;
  let swapped = true;

  while (gap != 1 || swapped) {
    gap = Math.floor(gap / shrink);
    if (gap < 1) gap = 1;
    swapped = false;

    for (let i = 0; i < arr.length - gap; i++) {
      await sleep(SORT_SLEEP_DELAY)
      renderBars(testData);
      setBarsActive(i, i + gap)
      if (arr[i] > arr[i + gap]) {
        swap(arr, i, i + gap);
        swapped = true;
      }
    }

  }

  return arr;
}

const createSortButton = (func: (arr: number[]) => Promise<number[]>, buttonContent: string) => {
  const button = createElement(app, "button", "content=" + buttonContent);
  button.addEventListener("click", async () => {
    shuffleArray(testData);
    renderBars(testData);

    func(testData).then(() =>{
      renderBars(testData);
      console.log("Done");
    });
  });
};

createSortButton(bubbleSort,"Bubble Sort")
createSortButton(combSort,"Comb Sort")