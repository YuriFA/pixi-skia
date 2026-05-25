import { CanvasKit, Color, InputMatrix } from 'canvaskit-wasm';
import * as PIXI from 'pixi.js-legacy';

export const isRenderable = (displayObject: PIXI.DisplayObject): boolean => {
  if (!displayObject.visible || !displayObject.renderable || displayObject.worldAlpha <= 0) {
    return false;
  }

  return true;
};

export const pixiColorToCanvasKitColor = (color: number, canvasKit: CanvasKit): Color => {
  const pixiColor = new PIXI.Color(color);
  const rgba = pixiColor.toRgba();
  const r = Math.round(rgba.r * 255);
  const g = Math.round(rgba.g * 255);
  const b = Math.round(rgba.b * 255);
  return canvasKit.Color(r, g, b, rgba.a);
};

export const pixiMatrixToSkiaMatrix = (matrix: PIXI.Matrix): InputMatrix => {
  // Skia matrix:
  // [
  //   a, c, tx,
  //   b, d, ty
  // ]
  return [matrix.a, matrix.c, matrix.tx, matrix.b, matrix.d, matrix.ty];
};
