import type { Container } from 'pixi.js-legacy';
import type { CanvasKit, Surface } from 'canvaskit-wasm';
import { renderPixiContainer } from './renderPixiContainer';
import { renderDemoScene } from './renderDemoScene';
import { APP_CONFIG } from '../shared/config/appConfig';

interface SkiaPixiRendererOptions {
  root: HTMLElement;
  canvasKit: CanvasKit;
}

export class SkiaPixiRenderer {
  private canvas: HTMLCanvasElement;
  private surface: Surface;
  private lastContainer: Container | null = null;
  private resizeObserver: ResizeObserver;
  private pixelRatio: number = window.devicePixelRatio || 1;

  public constructor(
    private readonly options: SkiaPixiRendererOptions,
  ) {
    this.canvas = this.createCanvas();
    this.surface = this.createSurface();

    this.resizeObserver = new ResizeObserver((entries) => {
      this.resize({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });
    })
    this.resizeObserver.observe(this.options.root)
    this.resize({ width: this.options.root.clientWidth, height: this.options.root.clientHeight })
  }

  private createCanvas() {
    const canvas = document.createElement('canvas');
    this.options.root.replaceChildren(canvas);

    return canvas;
  }

  private createSurface() {
    const surface = this.options.canvasKit.MakeWebGLCanvasSurface(this.canvas);

    if (!surface) {
      throw new Error('Failed to create Skia surface');
    }

    return surface;
  }

  private resize({ width, height }: { width: number, height: number }) {
    const dpr = window.devicePixelRatio || 1

    this.canvas.style.width = `${width}px`
    this.canvas.style.height = `${height}px`

    this.canvas.width = Math.floor(width * dpr)
    this.canvas.height = Math.floor(height * dpr)

    this.surface.delete();
    this.surface = this.createSurface();

    this.pixelRatio = dpr;

    if (this.lastContainer) {
      this.render(this.lastContainer);
    }
  }

  public render(container: Container) {
    this.lastContainer = container;
    const skCanvas = this.surface.getCanvas();

    skCanvas.clear(APP_CONFIG.backgroundColor);

    skCanvas.save();
    skCanvas.scale(this.pixelRatio, this.pixelRatio);

    renderPixiContainer({ canvas: skCanvas, container, canvasKit: this.options.canvasKit });
    // renderDemoScene({ canvas: skCanvas, canvasKit: this.options.canvasKit });

    skCanvas.restore();
    this.surface.flush();
  }

  public destroy(): void {
    this.surface.delete();
    this.resizeObserver.disconnect();
    this.options.root.removeChild(this.canvas);
  }
}
