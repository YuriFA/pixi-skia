import type { CanvasKit, Surface } from 'canvaskit-wasm';
import type { Container } from 'pixi.js-legacy';

import { APP_CONFIG } from '../shared/config/appConfig';
// import { renderDemoScene } from './renderDemoScene';
import { renderPixiContainer } from './renderPixiContainer';

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

  public constructor(private readonly options: SkiaPixiRendererOptions) {
    this.canvas = this.createCanvas();
    this.surface = this.createSurface();

    this.resizeObserver = new ResizeObserver((entries) => {
      this.resize({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });
    });
    this.resizeObserver.observe(this.options.root);
    this.resize({ width: this.options.root.clientWidth, height: this.options.root.clientHeight });
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

  private resize({ width, height }: { width: number; height: number }) {
    const w = Math.floor(width);
    const h = Math.floor(height);

    if (w === this.canvas.width && h === this.canvas.height) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;

    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;

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

  public exportPdf() {
    if (!this.lastContainer) {
      return;
    }

    const pdfDocument = new this.options.canvasKit.PdfDocument();
    const pdfCanvas = pdfDocument.beginPage(this.canvas.width, this.canvas.height);

    renderPixiContainer({
      canvas: pdfCanvas,
      container: this.lastContainer,
      canvasKit: this.options.canvasKit,
    });

    pdfDocument.endPage();

    const data = pdfDocument.closeAndToBytes();
    const pdfBytes = Uint8Array.of(...data);
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfURL = URL.createObjectURL(pdfBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = pdfURL;
    downloadLink.download = 'skia_demo_scene.pdf';
    document.body.appendChild(downloadLink);
    downloadLink.click();

    URL.revokeObjectURL(pdfURL);

    pdfDocument.delete();
  }

  public destroy(): void {
    this.surface.delete();
    this.resizeObserver.disconnect();
    this.options.root.removeChild(this.canvas);
  }
}
