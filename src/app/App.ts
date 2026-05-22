import type { AppModule, AppSize, ModuleContext } from '../core/contracts/AppModule';
import { createPixiApp } from '../core/pixi/createPixiApp';
import { createDemoModule } from '../modules/demo';

export class App {
  private readonly pixiApp;
  private readonly modules: AppModule[];

  public constructor(private readonly host: HTMLElement) {
    this.pixiApp = createPixiApp(host);
    this.modules = [createDemoModule()];
  }

  public start(): void {
    const context: ModuleContext = {
      app: this.pixiApp,
      stage: this.pixiApp.stage,
    };

    this.modules.forEach((module) => {
      module.mount(context);
    });

    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    this.pixiApp.ticker.add(this.handleTick);
  }

  public destroy(): void {
    this.pixiApp.ticker.remove(this.handleTick);
    window.removeEventListener('resize', this.handleResize);

    [...this.modules].reverse().forEach((module) => {
      module.destroy?.();
    });

    this.pixiApp.destroy(true, {
      children: true,
    });

    this.host.replaceChildren();
  }

  private readonly handleTick = (): void => {
    const deltaMS = this.pixiApp.ticker.deltaMS;

    this.modules.forEach((module) => {
      module.update?.(deltaMS);
    });
  };

  private readonly handleResize = (): void => {
    const size: AppSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.modules.forEach((module) => {
      module.resize?.(size);
    });
  };
}
