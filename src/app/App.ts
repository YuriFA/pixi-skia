import { Application, Container } from 'pixi.js-legacy';

import { createPixiApp } from '../pixi/createPixiApp';
import {
  getRandomGraphics,
  createDemoScene,
  loadDemoSceneAssets,
  unloadDemoSceneAssets,
  getRandomSprite,
} from '../scene/createDemoScene';
import { bootstrapCanvasKit } from '../skia/bootstrapCanvasKit';
import { SkiaPixiRenderer } from '../skia/SkiaPixiRenderer';

export class App {
  private pixiApp: Application | null = null;
  private skiaRenderer: SkiaPixiRenderer | null = null;
  private scene: Container | null = null;
  private exportButton: HTMLButtonElement | null = null;
  private randomGraphicsButton: HTMLButtonElement | null = null;
  private randomSpriteButton: HTMLButtonElement | null = null;
  private clearButton: HTMLButtonElement | null = null;
  private isStarted = false;

  constructor(
    private readonly pixiRoot: HTMLElement,
    private readonly skiaRoot: HTMLElement,
  ) {}

  private readonly handleExportPdf = () => {
    this.skiaRenderer?.exportPdf();
  };

  private readonly handleAddRandomGraphics = () => {
    if (!this.scene || !this.pixiApp || !this.skiaRenderer) {
      return;
    }

    const graphics = getRandomGraphics(this.pixiApp.screen);
    this.scene.addChild(graphics);
    this.syncRenderSkia();
  };

  private readonly handleAddRandomSprite = () => {
    if (!this.scene || !this.pixiApp || !this.skiaRenderer) {
      return;
    }

    const sprite = getRandomSprite(this.pixiApp.screen);
    this.scene.addChild(sprite);
    this.syncRenderSkia();
  };

  private readonly handleClearScene = () => {
    if (!this.scene || !this.skiaRenderer) {
      return;
    }

    this.scene.removeChildren();
    this.syncRenderSkia();
  };

  private setupControlButtons(): void {
    this.exportButton = document.getElementById('export-pdf-button') as HTMLButtonElement;
    this.exportButton?.addEventListener('click', this.handleExportPdf);

    this.randomGraphicsButton = document.getElementById(
      'random-graphics-button',
    ) as HTMLButtonElement;
    this.randomGraphicsButton?.addEventListener('click', this.handleAddRandomGraphics);

    this.randomSpriteButton = document.getElementById('random-sprite-button') as HTMLButtonElement;
    this.randomSpriteButton?.addEventListener('click', this.handleAddRandomSprite);

    this.clearButton = document.getElementById('clear-button') as HTMLButtonElement;
    this.clearButton?.addEventListener('click', this.handleClearScene);
  }

  private destroyControlButtons(): void {
    this.exportButton?.removeEventListener('click', this.handleExportPdf);
    this.exportButton = null;
    this.randomGraphicsButton?.removeEventListener('click', this.handleAddRandomGraphics);
    this.randomGraphicsButton = null;
    this.clearButton?.removeEventListener('click', this.handleClearScene);
    this.clearButton = null;
  }

  private syncRenderSkia(): void {
    requestAnimationFrame(() => {
      if (!this.scene || !this.skiaRenderer) {
        return;
      }

      this.skiaRenderer.render(this.scene);
    });
  }

  public async start(): Promise<void> {
    if (this.isStarted) {
      return;
    }

    this.setupControlButtons();

    await loadDemoSceneAssets();
    this.scene = createDemoScene();

    this.pixiApp = createPixiApp(this.pixiRoot);
    this.pixiApp.stage.addChild(this.scene);

    const initialGraphics = getRandomGraphics(this.pixiApp.screen);
    this.scene.addChild(initialGraphics);

    this.skiaRenderer = await bootstrapCanvasKit(this.skiaRoot);
    this.syncRenderSkia();

    this.isStarted = true;
  }

  public destroy(): void {
    if (!this.isStarted) {
      return;
    }

    this.destroyControlButtons();

    this.skiaRenderer?.destroy();
    this.skiaRenderer = null;

    if (this.pixiApp && this.scene) {
      this.pixiApp.stage.removeChild(this.scene);
    }

    this.scene?.destroy();
    this.scene = null;
    unloadDemoSceneAssets();
    this.pixiApp?.destroy(true, { children: false });
    this.pixiApp = null;
    this.isStarted = false;
  }
}
