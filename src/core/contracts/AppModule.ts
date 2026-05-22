import type { Application, Container } from 'pixi.js-legacy';

export interface AppSize {
  width: number;
  height: number;
}

export interface ModuleContext {
  app: Application;
  stage: Container;
}

export interface AppModule {
  mount(context: ModuleContext): void;
  update?(deltaMS: number): void;
  resize?(size: AppSize): void;
  destroy?(): void;
}
