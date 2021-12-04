import { Cursor, Selection, TextEditor } from '../components';
import { BoxInterface } from '../entities';
import { Drawer, Renderer } from '../rendering';
import { BoardCursor, BoardSelection, BoardTextEditor } from './components';
import {
  BoardBoxesController,
  BoardCursorController,
  BoardRenderController,
  BoardSelectionController,
  BoardViewportController,
} from './controllers';
import { BoardBoxesDrawer, BoardDrawer, DebugDrawer } from './rendering';
import { BoardBoxesStore, BoardViewportStore } from './stores';

export const boot = (canvasContext: CanvasRenderingContext2D, containerElement: HTMLElement) => {
  canvasContext.canvas.draggable = false;

  // Stores
  const boardViewportStore = new BoardViewportStore();
  const boardBoxesStore = new BoardBoxesStore();

  // Global components
  const cursor = new Cursor(containerElement);
  const selection = new Selection(cursor);
  const textEditor = new TextEditor(containerElement);

  // Board components
  const boardCursor = new BoardCursor({
    cursor,
    getBoxByPosition: (position, zoomLevel) => boardBoxesStore.getBoxByPosition(position, zoomLevel),
    boardViewportStore,
  });
  const boardSelection = new BoardSelection({ selection, getOffset: () => boardViewportStore.offset });
  const boardTextEditor = new BoardTextEditor({ textEditor });

  // Rendering
  const renderer = new Renderer();
  const drawer = new Drawer(canvasContext);
  // Must go before box drawer
  const boardDrawer = new BoardDrawer({
    drawer,
    boardViewportStore,
  });
  const boardBoxesDrawer = new BoardBoxesDrawer({
    drawer,
    boardBoxesStore,
    boardViewportStore,
  });
  const debugDrawer = new DebugDrawer({
    drawer,
    boardViewportStore,
  });

  // Controllers
  new BoardBoxesController({
    getSelectedBoxes: () => boardBoxesStore.selectedBoxes,
    deleteBox: (box: BoxInterface) => boardBoxesStore.delete(box),
    boardTextEditor,
  });
  new BoardViewportController({ boardViewportStore, boardCursor });
  new BoardCursorController({
    boardBoxesStore,
    boardCursor,
    boardTextEditor,
    boardSelection,
    getZoomLevel: () => boardViewportStore.zoomLevel,
  });
  new BoardSelectionController({
    boardSelection,
    boardBoxesStore,
    boardCursor,
    boardViewportStore,
  });
  new BoardRenderController({
    boardBoxesDrawer,
    boardDrawer,
    debugDrawer,
    renderer,
  });

  (window as any).bvs = boardViewportStore;
  (window as any).bbs = boardBoxesStore;
  (window as any).c = cursor;
  (window as any).bc = boardCursor;
};
