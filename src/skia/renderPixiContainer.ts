import { Canvas, CanvasKit, Color, Paint } from 'canvaskit-wasm';
import * as PIXI from 'pixi.js-legacy';

const pixiColorToCanvasKitColor = (color: number, canvasKit: CanvasKit): Color => {
  const pixiColor = new PIXI.Color(color);
  const rgba = pixiColor.toRgba();
  const r = Math.round(rgba.r * 255);
  const g = Math.round(rgba.g * 255);
  const b = Math.round(rgba.b * 255);
  return canvasKit.Color(r, g, b, rgba.a);
};

const pixiMatrixToSkiaMatrix = (matrix: PIXI.Matrix) => {
  // Skia matrix:
  // [
  //   a, c, tx,
  //   b, d, ty
  // ]
  return [matrix.a, matrix.c, matrix.tx, matrix.b, matrix.d, matrix.ty];
};

const renderPixiSprite = (_options: {
  canvasKit: CanvasKit;
  canvas: Canvas;
  sprite: PIXI.Sprite;
}): void => {};

const createGraphicsPaint = (
  data: PIXI.GraphicsData,
  canvasKit: CanvasKit,
  worldAlpha: number,
): { fill: Paint | null; stroke: Paint | null } => {
  const stroke = data.lineStyle.visible ? new canvasKit.Paint() : null;
  const fill = data.fillStyle.visible ? new canvasKit.Paint() : null;

  if (stroke) {
    stroke.setAntiAlias(true);
    stroke.setStyle(canvasKit.PaintStyle.Stroke);
    stroke.setStrokeWidth(data.lineStyle.width);
    stroke.setColor(pixiColorToCanvasKitColor(data.lineStyle.color, canvasKit));
    stroke.setAlphaf(data.lineStyle.alpha * worldAlpha);
  }

  if (fill) {
    fill.setAntiAlias(true);
    fill.setStyle(canvasKit.PaintStyle.Fill);
    fill.setColor(pixiColorToCanvasKitColor(data.fillStyle.color, canvasKit));
    fill.setAlphaf(data.fillStyle.alpha * worldAlpha);
  }

  return { fill, stroke };
};

const drawGraphicsWithPaint = ({
  fill,
  stroke,
  draw,
}: {
  fill: Paint | null;
  stroke: Paint | null;
  draw: (paint: Paint) => void;
}): void => {
  if (fill) {
    draw(fill);
  }

  if (stroke) {
    draw(stroke);
  }
};

const renderPixiGraphics = ({
  canvasKit,
  canvas,
  graphics,
}: {
  canvasKit: CanvasKit;
  canvas: Canvas;
  graphics: PIXI.Graphics;
}): void => {
  canvas.concat(pixiMatrixToSkiaMatrix(graphics.worldTransform));

  console.log(
    'graphics.geometry.graphicsData',
    graphics.zIndex,
    graphics.worldAlpha,
    graphics.geometry.graphicsData[0],
  );
  for (const data of graphics.geometry.graphicsData) {
    // console.log('[graphicsData]', data)
    const paint = createGraphicsPaint(data, canvasKit, graphics.worldAlpha);

    switch (data.type) {
      case PIXI.SHAPES.POLY: {
        if (!(data.shape instanceof PIXI.Polygon)) {
          return;
        }

        const path = new canvasKit.Path();
        path.addPoly(data.shape.points, data.shape.closeStroke);
        drawGraphicsWithPaint({
          ...paint,
          draw: (p) => {
            canvas.drawPath(path, p);
          },
        });
        break;
      }
      case PIXI.SHAPES.RECT: {
        if (!(data.shape instanceof PIXI.Rectangle)) {
          return;
        }

        /* NOTE:
         * data.shape.x, data.shape.y - top x/y of rect
         * data.shape.width, data.shape.height - width and height of rect
         */
        const rect = canvasKit.LTRBRect(
          data.shape.x,
          data.shape.y,
          data.shape.x + data.shape.width,
          data.shape.y + data.shape.height,
        );
        drawGraphicsWithPaint({
          ...paint,
          draw: (p) => {
            canvas.drawRect(rect, p);
          },
        });
        break;
      }
      case PIXI.SHAPES.CIRC: {
        if (!(data.shape instanceof PIXI.Circle)) {
          return;
        }

        const { shape } = data;
        drawGraphicsWithPaint({
          ...paint,
          draw: (p) => {
            canvas.drawCircle(shape.x, shape.y, shape.radius, p);
          },
        });
        break;
      }
      case PIXI.SHAPES.ELIP: {
        if (!(data.shape instanceof PIXI.Ellipse)) {
          return;
        }

        /* NOTE:
         * data.shape.x, data.shape.y - center
         * data.shape.width, data.shape.height - radiusX, radiusY
         */
        const ellipse = canvasKit.LTRBRect(
          -1 * data.shape.width + data.shape.x,
          -1 * data.shape.height + data.shape.y,
          data.shape.width + data.shape.x,
          data.shape.height + data.shape.y,
        );

        drawGraphicsWithPaint({
          ...paint,
          draw: (p) => {
            canvas.drawOval(ellipse, p);
          },
        });
        break;
      }
      case PIXI.SHAPES.RREC: {
        if (!(data.shape instanceof PIXI.RoundedRectangle)) {
          return;
        }

        /* NOTE:
         * data.shape.x, data.shape.y - top x/y of rect
         * data.shape.width, data.shape.height - width and height of rect
         * data.shape.radius - radius of rounded rect
         */
        const rrect = canvasKit.RRectXY(
          canvasKit.LTRBRect(
            data.shape.x,
            data.shape.y,
            data.shape.x + data.shape.width,
            data.shape.y + data.shape.height,
          ),
          data.shape.radius,
          data.shape.radius,
        );
        drawGraphicsWithPaint({
          ...paint,
          draw: (p) => {
            canvas.drawRRect(rrect, p);
          },
        });
        break;
      }
    }
  }
};

const renderDisplayObject = ({
  canvasKit,
  canvas,
  displayObject,
}: {
  canvasKit: CanvasKit;
  canvas: Canvas;
  displayObject: PIXI.DisplayObject;
}): void => {
  if (!displayObject.visible || !displayObject.renderable || displayObject.worldAlpha <= 0) {
    return;
  }

  canvas.save();

  if (displayObject instanceof PIXI.Sprite) {
    renderPixiSprite({ canvasKit, canvas, sprite: displayObject });
  }

  if (displayObject instanceof PIXI.Graphics) {
    renderPixiGraphics({ canvasKit, canvas, graphics: displayObject });
  }

  if (displayObject instanceof PIXI.Container) {
    renderPixiContainer({ canvasKit, canvas, container: displayObject });
  }

  canvas.restore();
};

export const renderPixiContainer = ({
  canvasKit,
  canvas,
  container,
}: {
  canvasKit: CanvasKit;
  canvas: Canvas;
  container: PIXI.Container;
}): void => {
  container.children.forEach((child) => {
    renderDisplayObject({ canvasKit, canvas, displayObject: child });
  });
};
