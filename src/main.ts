import './style.css'
import { createElement, createElementNS, sleep, shuffleArray, generateArrayOfRandomNumbers, time } from './lib';

const app = document.querySelector<HTMLDivElement>('#app');

const totalWidth = 100;
const totalHeight = 100;
const arrayCount = 20;
const barWidth = Math.floor(totalWidth / arrayCount);

let svgElement = createElementNS(app, "svg", "xmlns:xlink=http://www.w3.org/1999/xlink", `viewBox=0 0 ${totalWidth} ${totalHeight}`, "width=400");
/* background */ createElementNS(svgElement, "rect", "height=100", "width=100", "fill=#303030");
let barsGroupElement = createElementNS(svgElement, "g");
let buttonDivElement = createElement(app, "div");

let testData = generateArrayOfRandomNumbers(arrayCount, totalHeight)
let SORT_SLEEP_DELAY = 15//0;

const renderBars = (data: number[]) => {
  barsGroupElement.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    let n = data[i]
    createElementNS(barsGroupElement, "rect", "fill=red", `height=${n}`, `width=${barWidth - 1}`, `y=${totalHeight - n}`, "x=" + i * barWidth)
  }
};

const setBarsActive = (...indices: number[]) => {
  indices = Array.from(new Set(indices));
  for (const i of indices) {
    let el = barsGroupElement.children[i];
    if (!el) continue;
    el.setAttribute("fill", "blue");
  }
}

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

const minMaxSort = async (arr: number[], p = 0, q = arr.length - 1) => {
  // https://www.ijert.org/a-new-approach-to-sorting-min-max-sorting-algorithm

  while (p < q) {
    let minIndex = p, maxIndex = q;

    for (let i = p; i <= q; i++) {
      await sleep(SORT_SLEEP_DELAY);
      renderBars(testData);
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

let isSorting = false;
const createSortButton = (func: (arr: number[]) => Promise<number[]>, buttonContent: string) => {
  const button = createElement(buttonDivElement, "button", "content=" + buttonContent, "class=btn");
  button.addEventListener("click", async () => {
    if (isSorting) return;
    isSorting = true;
    shuffleArray(testData);
    renderBars(testData);
    await sleep(250);

    time.sec(func(testData)).then((seconds) => {
      renderBars(testData);
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