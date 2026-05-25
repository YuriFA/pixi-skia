import { Canvas, CanvasKit, Paint } from 'canvaskit-wasm';
import * as PIXI from 'pixi.js-legacy';

import { isRenderable, pixiColorToCanvasKitColor, pixiMatrixToSkiaMatrix } from './lib/utils';
import { PixiSkiaNodeDisplayObject } from './SkiaNode';

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

  for (const data of graphics.geometry.graphicsData) {
    const paint = createGraphicsPaint(data, canvasKit, graphics.worldAlpha);

    try {
      if (data.shape instanceof PIXI.Polygon) {
        const path = new canvasKit.Path();
        path.addPoly(data.shape.points, data.shape.closeStroke);
        drawGraphicsWithPaint({
          ...paint,
          draw: (p) => {
            canvas.drawPath(path, p);
          },
        });
        path.delete();
      }

      if (data.shape instanceof PIXI.Rectangle) {
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
      }

      if (data.shape instanceof PIXI.Circle) {
        const { shape } = data;
        drawGraphicsWithPaint({
          ...paint,
          draw: (p) => {
            canvas.drawCircle(shape.x, shape.y, shape.radius, p);
          },
        });
      }

      if (data.shape instanceof PIXI.Ellipse) {
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
      }

      if (data.shape instanceof PIXI.RoundedRectangle) {
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
      }
    } finally {
      paint.fill?.delete();
      paint.stroke?.delete();
    }
  }
};

export class GraphicsNode extends PixiSkiaNodeDisplayObject {
  constructor(protected displayObject: PIXI.Graphics) {
    super();
  }

  public render(canvas: Canvas, canvasKit: CanvasKit): void {
    if (!isRenderable(this.displayObject)) {
      return;
    }

    canvas.save();
    renderPixiGraphics({ canvasKit, canvas, graphics: this.displayObject });
    canvas.restore();
  }
}
