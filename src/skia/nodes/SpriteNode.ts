import { Canvas, CanvasKit } from 'canvaskit-wasm';
import * as PIXI from 'pixi.js-legacy';

import { isRenderable, pixiMatrixToSkiaMatrix } from './lib/utils';
import { PixiSkiaNodeDisplayObject } from './SkiaNode';

// TODO: Try to search another way to get image from PIXI.Sprite
const getCanvasKitImageFromSprite = ({
  canvasKit,
  sprite,
}: {
  canvasKit: CanvasKit;
  sprite: PIXI.Sprite;
}) => {
  const source =
    'source' in sprite.texture.baseTexture.resource
      ? (sprite.texture.baseTexture.resource?.source as CanvasImageSource)
      : null;

  if (!source) {
    return null;
  }

  return canvasKit.MakeImageFromCanvasImageSource(source);
};

const renderPixiSprite = ({
  canvasKit,
  canvas,
  sprite,
}: {
  canvasKit: CanvasKit;
  canvas: Canvas;
  sprite: PIXI.Sprite;
}): void => {
  const image = getCanvasKitImageFromSprite({ canvasKit, sprite });
  if (!image) {
    return;
  }

  const { frame } = sprite.texture;
  canvas.concat(pixiMatrixToSkiaMatrix(sprite.worldTransform));
  const paint = new canvasKit.Paint();
  paint.setAlphaf(sprite.worldAlpha);

  canvas.drawImageRect(
    image,
    canvasKit.XYWHRect(frame.x, frame.y, frame.width, frame.height),
    canvasKit.XYWHRect(
      -sprite.anchor.x * sprite.width,
      -sprite.anchor.y * sprite.height,
      sprite.width,
      sprite.height,
    ),
    paint,
    false,
  );
  image.delete();
  paint.delete();
};

export class SpriteNode extends PixiSkiaNodeDisplayObject {
  constructor(protected displayObject: PIXI.Sprite) {
    super();
  }

  public render(canvas: Canvas, canvasKit: CanvasKit): void {
    if (!isRenderable(this.displayObject)) {
      return;
    }

    canvas.save();
    renderPixiSprite({ canvasKit, canvas, sprite: this.displayObject });
    canvas.restore();
  }
}
