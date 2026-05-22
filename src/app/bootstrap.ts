import { App } from './App';

export function bootstrap(): void {
  const host = document.querySelector<HTMLElement>('#app');

  if (!host) {
    throw new Error('App host "#app" was not found.');
  }

  const app = new App(host);

  app.start();

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      app.destroy();
    });
  }
}
