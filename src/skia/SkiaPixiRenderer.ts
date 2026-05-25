import type { CanvasKit, Surface } from 'canvaskit-wasm';
import type { Container } from 'pixi.js-legacy';

import { APP_CONFIG } from '../shared/config/appConfig';
import { buildNodes } from './buildNodes';
import { SupportedEvents } from './nodes/lib/types';
import { PixiSkiaNode } from './nodes/SkiaNode';

interface SkiaPixiRendererOptions {
  root: HTMLElement;
  canvasKit: CanvasKit;
}

export class SkiaPixiRenderer {
  private canvas: HTMLCanvasElement;
  private surface: Surface;
  private lastContainer: Container | null = null;
  private nodes: PixiSkiaNode[] = [];
  private resizeObserver: ResizeObserver;
  private pixelRatio: number = window.devicePixelRatio || 1;

  public constructor(private readonly options: SkiaPixiRendererOptions) {
    this.canvas = this.createCanvas();
    this.setupCanvasEvents();
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

  private handlePointerEvent = (e: PointerEvent) => {
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      if (this.nodes[i].hitTest(e.offsetX, e.offsetY)) {
        this.nodes[i].emit(e.type as SupportedEvents, e);
        break;
      }
    }
  };

  private setupCanvasEvents() {
    this.canvas.addEventListener('pointerdown', this.handlePointerEvent);
    this.canvas.addEventListener('pointerup', this.handlePointerEvent);
  }

  private destroyCanvasEvents() {
    this.canvas.removeEventListener('pointerdown', this.handlePointerEvent);
    this.canvas.removeEventListener('pointerup', this.handlePointerEvent);
  }

  private createSurface() {
    const surface = this.options.canvasKit.MakeWebGLCanvasSurface(this.canvas);

    if (!surface) {
      throw new Error('Failed to create Skia surface');
    }

    return surface;
  }

  private resize({ width, height }: { width: number; height: number }) {
    if (width === 0 || height === 0) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const widthWithDpr = Math.floor(width * dpr);
    const heightWithDpr = Math.floor(height * dpr);

    if (widthWithDpr === this.canvas.width && heightWithDpr === this.canvas.height) {
      return;
    }

    this.pixelRatio = dpr;

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.canvas.width = widthWithDpr;
    this.canvas.height = heightWithDpr;

    this.surface.delete();
    this.surface = this.createSurface();

    if (this.lastContainer) {
      this.render(this.lastContainer);
    }
  }

  public render(container: Container) {
    this.lastContainer = container;
    this.nodes = buildNodes(container);

    const skCanvas = this.surface.getCanvas();

    skCanvas.clear(APP_CONFIG.backgroundColor);

    skCanvas.save();
    skCanvas.scale(this.pixelRatio, this.pixelRatio);

    this.nodes.forEach((node) => {
      node.render(skCanvas, this.options.canvasKit);
    });

    skCanvas.restore();
    this.surface.flush();
  }

  public exportPdf() {
    if (this.nodes.length === 0) {
      return;
    }

    const pdfDocument = new this.options.canvasKit.PdfDocument();
    // width/height for real size of canvas in browser
    const pdfCanvas = pdfDocument.beginPage(
      parseInt(this.canvas.style.width),
      parseInt(this.canvas.style.height),
    );
    pdfCanvas.clear(APP_CONFIG.backgroundColor);

    this.nodes.forEach((node) => {
      node.render(pdfCanvas, this.options.canvasKit);
    });

    pdfDocument.endPage();

    const data = pdfDocument.closeAndToBytes();
    const pdfBytes = new Uint8Array(data.length);
    pdfBytes.set(data);
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfURL = URL.createObjectURL(pdfBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = pdfURL;
    downloadLink.download = 'skia_demo_scene.pdf';
    document.body.appendChild(downloadLink);
    downloadLink.click();

    URL.revokeObjectURL(pdfURL);
    document.body.removeChild(downloadLink);

    pdfDocument.delete();
  }

  public destroy(): void {
    this.destroyCanvasEvents();
    this.surface.delete();
    this.resizeObserver.disconnect();
    this.options.root.removeChild(this.canvas);
  }
}
