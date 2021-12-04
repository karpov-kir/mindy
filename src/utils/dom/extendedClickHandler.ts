import { Vector } from '../../math/vectors';
import { getPositionFromMouseEvent } from './getPositionFromMouseEvent';

export enum DragMode {
  Down = 'down',
  DoubleDown = 'double-down',
}

export type DragStartData = {
  startedAt: Vector;
};

export type DragData = {
  totalDelta: Vector;
  delta: Vector;
} & DragStartData;

export const extendedClickHandler = (
  element: HTMLElement,
  _options: {
    // In milliseconds
    doubleClickThreshold?: number;
    silenceClickAfterDrag?: boolean;
    silenceMouseUpAfterDrag?: boolean;
    silenceMouseDownAfterDrag?: boolean;
    enableDrag?: boolean;
    debug?: boolean;
    dragMode?: DragMode;
    onClick?: (event: MouseEvent) => void;
    onDoubleClick?: (event: MouseEvent) => void;
    onDragStart?: (event: MouseEvent, data: Pick<DragData, 'startedAt'>) => void;
    onDrag?: (event: MouseEvent, data: DragData) => void;
    onDragEnd?: (event: MouseEvent, data: DragData) => void;
    onMouseDown?: (event: MouseEvent) => void;
    onDoubleMouseDown?: (event: MouseEvent) => void;
    onMouseUp?: (event: MouseEvent, data: DragData) => void;
  } = {},
) => {
  const options = {
    ...{
      silenceClickAfterDrag: false,
      silenceMouseUpAfterDrag: false,
      silenceMouseDownAfterDrag: false,
      enableDrag: true,
      dragMode: DragMode.Down,
      debug: false,
      doubleClickThreshold: 280,
    },
    ..._options,
  };

  if (options.debug) {
    console.log('Extended click handler options:', options);
  }

  let lastClickTime = 0;
  let isDragging = false;
  let isDoubleClick = false;
  let isMouseDown = false;
  let lastMouseDownTime = 0;
  let isDoubleMouseDown = false;
  let shouldSilenceClick = false;
  let shouldSilenceMouseUp = false;
  let shouldSilenceMouseDown = false;
  let lastMouseDownEvent: MouseEvent | undefined;
  let lastDragEvent: MouseEvent | undefined;
  let shouldCallDragStartCallback = false;

  element.addEventListener('mousedown', (event) => {
    const mouseDownTime = new Date().getTime();
    const timePassed = mouseDownTime - lastMouseDownTime;

    isDoubleMouseDown = timePassed < options.doubleClickThreshold;
    lastMouseDownTime = mouseDownTime;

    isMouseDown = true;
    lastMouseDownEvent = event;

    shouldCallDragStartCallback = true;

    if (shouldSilenceMouseDown) {
      shouldSilenceMouseDown = false;
      return;
    }

    if (isDoubleMouseDown) {
      if (options.debug) {
        console.log('Double mouse down', getPositionFromMouseEvent(event, element));
      }

      if (options.onDoubleMouseDown) {
        options.onDoubleMouseDown(event);
      }
    } else {
      if (options.debug) {
        console.log('Mouse down', getPositionFromMouseEvent(event, element));
      }

      if (options.onMouseDown) {
        options.onMouseDown(event);
      }
    }
  });

  // Using document so you can drag outside of the canvas, use element
  // if you cannot drag outside of the canvas.
  element.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
      isDragging = true;
    }

    if (isDragging && options.enableDrag) {
      const shouldDrag =
        (isDoubleMouseDown && options.dragMode === DragMode.DoubleDown) ||
        (!isDoubleMouseDown && options.dragMode === DragMode.Down);

      if (shouldDrag) {
        if (options.silenceMouseDownAfterDrag) {
          shouldSilenceMouseDown = true;
        }

        if (options.silenceMouseUpAfterDrag) {
          shouldSilenceMouseUp = true;
        }

        if (options.silenceClickAfterDrag) {
          shouldSilenceClick = true;
        }

        if (options.onDrag || options.onDragStart || options.debug) {
          const dragData = getDragData(event);

          if ((options.onDragStart || options.debug) && shouldCallDragStartCallback) {
            const dragStartData = {
              startedAt: dragData.startedAt,
            };

            if (options.debug) {
              console.log('Drag start', dragStartData);
            }

            if (options.onDragStart) {
              options.onDragStart(event, dragStartData);
            }

            shouldCallDragStartCallback = false;
          }

          if (options.debug) {
            console.log(isDoubleMouseDown ? 'Double click mode drag' : 'Click mode drag', dragData);
          }

          if (options.onDrag) {
            options.onDrag(event, dragData);
          }
        }

        lastDragEvent = event;
      }
    }
  });

  element.addEventListener('mouseup', (event) => {
    const dragData = getDragData(event);

    if (isDragging) {
      if (options.debug) {
        console.log('Drag end', dragData);
      }

      if (options.onDragEnd) {
        options.onDragEnd(event, dragData);
      }
    }

    isDragging = false;
    isMouseDown = false;

    // Must be set to `undefined` only after `getDragData` is used
    lastDragEvent = undefined;

    if (shouldSilenceMouseUp) {
      shouldSilenceMouseUp = false;
      return;
    }

    if (options.debug) {
      console.log('Mouse up', getPositionFromMouseEvent(event, element));
    }

    if (options.onMouseUp) {
      // `dragData` is still can be useful e.g. in cases
      // when we always need to handle `mouseup` event in one place
      // but differently if there was a drag event or not
      options.onMouseUp(event, dragData);
    }
  });

  element.addEventListener('click', (event) => {
    const clickTime = new Date().getTime();
    const timePassed = clickTime - lastClickTime;

    isDoubleClick = timePassed < options.doubleClickThreshold;
    lastClickTime = clickTime;

    if (shouldSilenceClick) {
      shouldSilenceClick = false;
      return;
    }

    if (isDoubleClick) {
      if (options.debug) {
        console.log('Double click', getPositionFromMouseEvent(event, element));
      }

      if (options.onDoubleClick) {
        options.onDoubleClick(event);
      }
    } else if (!isDoubleClick) {
      if (options.debug) {
        console.log('Click', getPositionFromMouseEvent(event, element));
      }

      if (options.onClick) {
        options.onClick(event);
      }
    }
  });

  element.addEventListener('dragstart', () => {
    throw new Error('Only simulated drag is supported');
  });

  element.addEventListener('dragend', () => {
    throw new Error('Only simulated drag is supported');
  });

  // This is redundant as there is simulated implementation of double click in this helper
  // element.addEventListener('dblclick', () => {...})

  function getDragData(event: MouseEvent) {
    if (!lastMouseDownEvent) {
      return {
        startedAt: new Vector(),
        totalDelta: new Vector(),
        delta: new Vector(),
      };
    }

    const pointFromLastMouseDown = getPositionFromMouseEvent(lastMouseDownEvent, element);
    const pointFromLastDrag = lastDragEvent ? getPositionFromMouseEvent(lastDragEvent, element) : undefined;
    const currentPoint = getPositionFromMouseEvent(event, element);

    return {
      startedAt: currentPoint,
      totalDelta: currentPoint.clone().substract(pointFromLastMouseDown),
      delta: currentPoint.clone().substract(pointFromLastDrag || pointFromLastMouseDown),
    };
  }
};
