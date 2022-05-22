import './style.css'
import { createElement, createElementNS, sleep, shuffleArray, generateArrayOfRandomNumbers, time } from './lib';
import useRenderBars from './renderBars';
import orgChart from './orgChart';

export const totalWidth = 100;
export const totalHeight = 100;
export let arrayCount = 20;
export let barWidth = Math.round(totalWidth / arrayCount);

export let isSorting = false;
export let data = generateArrayOfRandomNumbers(arrayCount, totalHeight);
export let SORT_SLEEP_DELAY = 150;

export const app = document.querySelector<HTMLDivElement>('#app');
export const topBarElement = createElement(app, "div", "style=display:flex;justify-content:center;", {
  children: [
    createElement(null, "button", "content=Shuffle", "class=btn", {
      eventListeners: [{
        type: "click",
        listener: () => {
          if (isSorting) return;
          shuffleArray(data);
          renderBars(data);
        }
      }]
    }),
    createElement(null, "button", "content=new data", "class=btn", {
      eventListeners: [{
        type: "click",
        listener: () => {
          if (isSorting) return;
          data = generateArrayOfRandomNumbers(arrayCount, totalHeight);
          renderBars(data);
        }
      }]
    }),
    createElement(null, "label", "content=Bars count", {
      children: [
        createElement(null, "input", "type=number", `value=${arrayCount}`, {
          eventListeners: [
            {
              type: "input",
              listener: (event) => {
                let target = event.target as HTMLInputElement;
                if (isSorting || target.valueAsNumber > (totalWidth / 2)) return target.valueAsNumber = arrayCount;
                arrayCount = target.valueAsNumber;
                data = generateArrayOfRandomNumbers(arrayCount, totalHeight);
                barWidth = Math.round(totalWidth / arrayCount);
                renderBars(data);
                return;
              }
            }
          ]
        })
      ]
    }),
  ]
});

let svgElement = createElementNS(app, "svg", "xmlns:xlink=http://www.w3.org/1999/xlink", `viewBox=0 0 ${totalWidth} ${totalHeight}`, "width=400", {
  children: [
   /* background */ createElementNS(null, "rect", "height=100", "width=100", "fill=#303030")
  ]
});
export let barsGroupElement = createElementNS(svgElement, "g");
let buttonDivElement = createElement(app, "div");

const renderBars = useRenderBars();

const setBarsActive = (...indices: number[]) => {
  indices = Array.from(new Set(indices));
  for (const i of indices) {
    let el = barsGroupElement.children[i];
    if (!el) continue;
    el.setAttribute("fill", "blue");
  }
}

renderBars(data);

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
      renderBars(arr);
      setBarsActive(i, i + gap)
      if (arr[i] > arr[i + gap]) {
        swap(arr, i, i + gap);
        swapped = true;
      }
    }

  }

  return arr;
}

const minMaxSort = async (arr: number[], p = 0, q = arr.length - 1) => {
  // https://www.ijert.org/a-new-approach-to-sorting-min-max-sorting-algorithm
  while (p < q) {
    let minIndex = p, maxIndex = q;

    for (let i = p; i <= q; i++) {
      await sleep(SORT_SLEEP_DELAY);
      renderBars(arr);
      setBarsActive(p, q, i, maxIndex, minIndex);

      if (arr[i] < arr[minIndex]) {
        minIndex = i;
      } else if (arr[i] > arr[maxIndex]) {
        maxIndex = i;
      }
    }

    if (p === maxIndex) {
      swap(arr, p, minIndex);
      swap(arr, q, minIndex);
    } else if (q === minIndex) {
      swap(arr, q, maxIndex);
      swap(arr, p, maxIndex);
    } else {
      swap(arr, p, minIndex);
      swap(arr, q, maxIndex);
    }

    p++;
    q--;
  }

  return arr;
}

const createSortButton = (func: (arr: number[]) => Promise<number[]>, buttonContent: string) => {
  const button = createElement(buttonDivElement, "button", "content=" + buttonContent, "class=btn");
  button.addEventListener("click", async () => {
    if (isSorting) return;
    isSorting = true;
    // shuffleArray(data);
    renderBars(data);
    await sleep(SORT_SLEEP_DELAY);

    time.sec(func(data)).then((seconds) => {
      renderBars(data);
      console.log(`${seconds} seconds`);
      isSorting = false;
    });
  });
};

createSortButton(bubbleSort, "Bubble Sort")
createSortButton(combSort, "Comb Sort")
createSortButton(minMaxSort, "Min-Max Sort")

const inputContainerElement = createElement(app, "div");
const RANGE_INPUT_ID = "rangeInputID";
const rangeInputLabelElement = createElement(inputContainerElement, "label", `for=${RANGE_INPUT_ID}`, `content=${SORT_SLEEP_DELAY}`)
const rangeInputElement = createElement(inputContainerElement, "input", "type=range", "min=0", "max=500", `value=${SORT_SLEEP_DELAY}`, `id=${RANGE_INPUT_ID}`) as HTMLInputElement;
rangeInputElement.addEventListener("input", () => {
  SORT_SLEEP_DELAY = rangeInputElement.valueAsNumber;
  rangeInputLabelElement.textContent = rangeInputElement.value;
});

orgChart();