import { Canvas, CanvasKit } from 'canvaskit-wasm';

export const renderDemoScene = ({
  canvasKit,
  canvas,
}: {
  canvasKit: CanvasKit;
  canvas: Canvas;
}) => {
  const paintFillRed = new canvasKit.Paint();
  paintFillRed.setAntiAlias(true);
  paintFillRed.setStyle(canvasKit.PaintStyle.Fill);
  paintFillRed.setColor(canvasKit.Color(255, 0, 0, 1));

  const paintFillBlue = new canvasKit.Paint();
  paintFillBlue.setAntiAlias(true);
  paintFillBlue.setStyle(canvasKit.PaintStyle.Fill);
  paintFillBlue.setColor(canvasKit.Color(0, 0, 255, 1));

  const whiteStroke = new canvasKit.Paint();
  whiteStroke.setAntiAlias(true);
  whiteStroke.setStyle(canvasKit.PaintStyle.Stroke);
  whiteStroke.setStrokeWidth(10);
  whiteStroke.setColor(canvasKit.Color(255, 255, 255, 1));

  const yellowStroke = new canvasKit.Paint();
  yellowStroke.setAntiAlias(true);
  yellowStroke.setStyle(canvasKit.PaintStyle.Stroke);
  yellowStroke.setStrokeWidth(10);
  yellowStroke.setColor(canvasKit.Color(255, 255, 0, 1));

  function draw() {
    // subContainer
    canvas.save();
    canvas.translate(75, 50);

    // g3
    canvas.save();

    canvas.rotate(-20, 0, 0);

    const path1 = new canvasKit.Path();
    path1.moveTo(0, 0);
    path1.lineTo(150, 100);

    canvas.drawPath(path1, whiteStroke);

    canvas.restore();

    // g4
    canvas.save();

    canvas.rotate(20, 0, 0);

    const path2 = new canvasKit.Path();
    path2.moveTo(0, 70);
    path2.lineTo(150, -30);

    canvas.drawPath(path2, yellowStroke);

    canvas.restore();

    canvas.restore();

    // g1
    canvas.save();

    canvas.translate(300, 200);
    canvas.rotate(-30, 0, 0);

    const rectOval = canvasKit.LTRBRect(-100, -50, 100, 50);

    canvas.drawOval(rectOval, paintFillRed);

    canvas.restore();

    // g2
    canvas.save();

    canvas.translate(120, 60);
    canvas.rotate(15, 0, 0);
    canvas.scale(1.5, 1.7);

    const rect = canvasKit.LTRBRect(0, 75, 30, 125);

    canvas.drawRect(rect, paintFillBlue);

    canvas.restore();
  }

  draw();
};
