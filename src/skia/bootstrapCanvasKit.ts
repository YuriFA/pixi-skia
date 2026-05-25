import CanvasKitInit from 'canvaskit-wasm';
import wasmUrl from 'canvaskit-wasm/bin/canvaskit.wasm?url';

import { SkiaPixiRenderer } from './SkiaPixiRenderer';

export async function bootstrapCanvasKit(root: HTMLElement): Promise<SkiaPixiRenderer> {
  const canvasKit = await CanvasKitInit({
    locateFile: (_file) => wasmUrl,
  });

  return new SkiaPixiRenderer({
    root,
    canvasKit,
  });
}
