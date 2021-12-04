import { Vector } from '../../math/vectors';

export const getPositionFromMouseEvent = (event: MouseEvent, container: HTMLElement) => {
  const viewportMousePosition = new Vector({
    x: event.pageX,
    y: event.pageY,
  });
  const boundingRect = container.getBoundingClientRect();
  const topLeftContainerPosition = new Vector({
    x: boundingRect.left,
    y: boundingRect.top,
  });

  return viewportMousePosition.substract(topLeftContainerPosition);
};
