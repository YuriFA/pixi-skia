import CanvasKitInit from 'canvaskit-wasm';
import { SkiaPixiRenderer } from './SkiaPixiRenderer';
import wasmUrl from 'canvaskit-wasm/bin/canvaskit.wasm?url';


export async function bootstrapCanvasKit(root: HTMLElement): Promise<SkiaPixiRenderer> {
  const canvasKit = await CanvasKitInit({
    locateFile: (_file) => wasmUrl,
  });

  return new SkiaPixiRenderer({
    root,
    canvasKit,
  });
}
