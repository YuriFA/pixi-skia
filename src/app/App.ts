import { Application, Container } from 'pixi.js-legacy';

import { createPixiApp } from '../pixi/createPixiApp';
import { createDemoScene, loadDemoSceneAssets } from '../scene/createDemoScene';
import { bootstrapCanvasKit } from '../skia/bootstrapCanvasKit';
import { SkiaPixiRenderer } from '../skia/SkiaPixiRenderer';

export class App {
  private pixiApp: Application | null = null;
  private skiaRenderer: SkiaPixiRenderer | null = null;
  private scene: Container | null = null;
  private exportButton: HTMLButtonElement | null = null;
  private isStarted = false;

  constructor(
    private readonly pixiRoot: HTMLElement,
    private readonly skiaRoot: HTMLElement,
  ) {}

  private readonly handleExportPdf = () => {
    this.skiaRenderer?.exportPdf();
  };

  private setupExportButton(): HTMLButtonElement {
    const button = document.getElementById('export-pdf-button');

    if (!button) {
      throw new Error('Export button not found');
    }

    button.addEventListener('click', this.handleExportPdf);

    return button as HTMLButtonElement;
  }

  public async start(): Promise<void> {
    if (this.isStarted) {
      return;
    }

    await loadDemoSceneAssets();
    this.scene = createDemoScene();

    this.pixiApp = createPixiApp(this.pixiRoot);
    this.pixiApp.stage.addChild(this.scene);

    this.skiaRenderer = await bootstrapCanvasKit(this.skiaRoot);
    this.skiaRenderer.render(this.scene);
    this.exportButton = this.setupExportButton();

    this.isStarted = true;
  }

  public destroy(): void {
    if (!this.isStarted) {
      return;
    }

    this.exportButton?.removeEventListener('click', this.handleExportPdf);
    this.exportButton?.remove();
    this.exportButton = null;

    this.skiaRenderer?.destroy();
    this.skiaRenderer = null;

    if (this.pixiApp && this.scene) {
      this.pixiApp.stage.removeChild(this.scene);
    }

    this.scene?.destroy();
    this.scene = null;
    this.pixiApp?.destroy(true, { children: false });
    this.pixiApp = null;
    this.isStarted = false;
  }
}
