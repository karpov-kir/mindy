import { AnimationCallback, RendererInterface } from './RendererInterface';

export class Renderer implements RendererInterface {
  private lastAnimation = Date.now();
  private fps = 60;
  private fpsInterval = 1000 / this.fps;
  private animationCallbacks: AnimationCallback[] = [];

  constructor() {
    this.animate();
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

    const now = Date.now();
    const elapsed = now - this.lastAnimation;

    if (elapsed > this.fpsInterval) {
      this.lastAnimation = now - (elapsed % this.fpsInterval);
      this.animationCallbacks.forEach((callback) => callback(elapsed));
    }
  }

  public onAnimate(callback: AnimationCallback) {
    this.animationCallbacks.push(callback);
  }
}
