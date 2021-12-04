export type AnimationCallback = (delta: number) => void;

export type RendererInterface = {
  onAnimate: (callback: AnimationCallback) => void;
};
