import { Application } from 'pixi.js-legacy';

import { APP_CONFIG } from '../shared/config/appConfig';

export function createPixiApp(root: HTMLElement): Application {
  const app = new Application({
    antialias: true,
    autoDensity: true,
    backgroundColor: APP_CONFIG.backgroundColor,
    resolution: Math.min(window.devicePixelRatio || 1, APP_CONFIG.maxPixelRatio),
    resizeTo: root,
    forceCanvas: true,
  });

  root.replaceChildren(app.view as HTMLCanvasElement);

  return app;
}
