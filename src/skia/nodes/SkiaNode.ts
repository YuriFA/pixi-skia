import { Canvas, CanvasKit } from 'canvaskit-wasm';
import * as PIXI from 'pixi.js-legacy';

import { SupportedEvents } from './lib/types';

export interface PixiSkiaNode {
  render(canvas: Canvas, canvasKit: CanvasKit): void;
  hitTest(x: number, y: number): boolean;
  emit(type: SupportedEvents, e: PointerEvent): void;
}

export abstract class PixiSkiaNodeDisplayObject implements PixiSkiaNode {
  protected abstract displayObject: PIXI.DisplayObject;

  abstract render(canvas: Canvas, canvasKit: CanvasKit): void;

  public hitTest(x: number, y: number): boolean {
    if (!this.displayObject.isInteractive) {
      return false;
    }

    if (this.displayObject instanceof PIXI.Sprite || this.displayObject instanceof PIXI.Graphics) {
      return this.displayObject.containsPoint(new PIXI.Point(x, y));
    }

    return false;
  }

  public emit(type: SupportedEvents, e: PointerEvent): void {
    this.displayObject.emit(type, e as unknown as PIXI.FederatedPointerEvent);

    let parent = this.displayObject.parent;
    while (parent) {
      if (parent instanceof PIXI.Container && parent.eventNames().some((item) => item === type)) {
        parent.emit(type, e as unknown as PIXI.FederatedPointerEvent);
      }

      parent = parent.parent;
    }
  }
}
