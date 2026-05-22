import type { AppModule, AppSize, ModuleContext } from '../../core/contracts/AppModule';
import { DemoScene } from './DemoScene';

export class DemoModule implements AppModule {
  private scene: DemoScene | null = null;

  public mount(context: ModuleContext): void {
    this.scene = new DemoScene();
    context.stage.addChild(this.scene.container);
  }

  public update(deltaMS: number): void {
    this.scene?.update(deltaMS);
  }

  public resize(size: AppSize): void {
    this.scene?.resize(size);
  }

  public destroy(): void {
    if (!this.scene) {
      return;
    }

    this.scene.destroy();
    this.scene = null;
  }
}
