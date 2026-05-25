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

  const paint = new canvasKit.Paint();
  paint.setAlphaf(sprite.worldAlpha);

  canvas.concat(pixiMatrixToSkiaMatrix(sprite.worldTransform));

  const { frame, orig, trim } = sprite.texture;
  const trimX = trim ? trim.x : 0;
  const trimY = trim ? trim.y : 0;
  const trimW = trim ? trim.width : frame.width;
  const trimH = trim ? trim.height : frame.height;

  canvas.drawImageRect(
    image,
    canvasKit.XYWHRect(frame.x, frame.y, frame.width, frame.height),
    canvasKit.XYWHRect(
      -sprite.anchor.x * orig.width + trimX,
      -sprite.anchor.y * orig.height + trimY,
      trimW,
      trimH,
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
