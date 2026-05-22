import { App } from './App';

export function bootstrap(): void {
  const rootPixi = document.querySelector<HTMLElement>('#root-pixi');
  const rootSkia = document.querySelector<HTMLElement>('#root-skia');

  if (!rootPixi || !rootSkia) {
    throw new Error('Root elements not found');
  }

  const app = new App(rootPixi, rootSkia);

  app.start();

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      app.destroy();
    });
  }
}
