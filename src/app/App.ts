import { createPixiApp } from '../pixi/createPixiApp';
import { bootstrapCanvasKit } from '../skia/bootstrapCanvasKit';
import { Application, Container } from 'pixi.js-legacy';
import { SkiaPixiRenderer } from '../skia/SkiaPixiRenderer';
import { createDemoScene } from '../scene/createDemoScene';

export class App {
  private pixiApp: Application | null = null;
  private skiaRenderer: SkiaPixiRenderer | null = null;
  private scene: Container | null = null;
  private isStarted = false;

  public constructor(
    private readonly pixiRoot: HTMLElement,
    private readonly skiaRoot: HTMLElement
  ) { }

  public async start(): Promise<void> {
    if (this.isStarted) {
      return;
    }

    this.scene = createDemoScene();

    this.pixiApp = createPixiApp(this.pixiRoot);
    this.pixiApp.stage.addChild(this.scene);

    this.skiaRenderer = await bootstrapCanvasKit(this.skiaRoot);
    this.skiaRenderer.render(this.scene);

    this.isStarted = true;
  }

  public destroy(): void {
    if (!this.isStarted) {
      return;
    }

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
