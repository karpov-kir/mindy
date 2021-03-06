import { boot } from './board';

const htmlElement = document.querySelector('html') as HTMLHtmlElement;
const bodyElement = document.querySelector('body') as HTMLBodyElement;

const containerElement = document.createElement('div') as HTMLDivElement;

containerElement.style.overflow = 'hidden';

const canvasElement = document.createElement('canvas') as HTMLCanvasElement;
const canvasContext = canvasElement.getContext('2d') as CanvasRenderingContext2D;

const resetStyles = (element: ElementCSSInlineStyle) => {
  element.style.width = '100%';
  element.style.height = '100%';
  element.style.margin = '0';
  element.style.padding = '0';
};

resetStyles(htmlElement);
resetStyles(bodyElement);
resetStyles(containerElement);
resetStyles(canvasElement);

document.body.appendChild(containerElement);
containerElement.appendChild(canvasElement);

// =============================

boot(canvasContext, containerElement);
