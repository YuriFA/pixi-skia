import CanvasKitInit from 'canvaskit-wasm';
import { SkiaPixiRenderer } from './SkiaPixiRenderer';

export async function bootstrapCanvasKit(root: HTMLElement): Promise<SkiaPixiRenderer> {
  const canvasKit = await CanvasKitInit({
    locateFile: (file) => `/node_modules/canvaskit-wasm/bin/${file}`,
  });

  return new SkiaPixiRenderer({
    root,
    canvasKit,
  });
}
