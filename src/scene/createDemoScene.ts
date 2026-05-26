import { Container, Graphics, Sprite, Assets, Rectangle } from 'pixi.js-legacy';

const SPRITE_ASSETS = [
  'https://pixijs.com/assets/bunny.png',
  'https://pixijs.com/assets/flowerTop.png',
  'https://pixijs.com/assets/eggHead.png',
  'https://pixijs.com/assets/p2.jpeg',
];

export const loadDemoSceneAssets = () => {
  return Assets.load(SPRITE_ASSETS);
};

export const unloadDemoSceneAssets = () => {
  return Assets.unload(SPRITE_ASSETS);
};

const paramsForRandomGraphics = {
  type: ['line', 'ellipse', 'rect', 'rrect', 'polygon', 'circle'],
  size: [30, 50, 80, 100, 120],
  alpha: [0.5, 1],
  angle: [-45, 45, 0, 150, 200],
  event: [null, 'pointerdown', 'pointerup'] as const,
  positionPercent: [
    { x: 0.1, y: 0.1 },
    { x: 0.5, y: 0.5 },
    { x: 0.9, y: 0.9 },
    { x: 0.1, y: 0.9 },
    { x: 0.9, y: 0.1 },
    { x: 0.5, y: 0.1 },
    { x: 0.1, y: 0.5 },
    { x: 0.3, y: 0.3 },
    { x: 0.7, y: 0.7 },
    { x: 0.3, y: 0.7 },
    { x: 0.7, y: 0.3 },
  ],
  offsetPercent: [
    { x: -0.1, y: -0.1 },
    { x: 0, y: 0 },
    { x: 0.1, y: 0.1 },
    { x: -0.1, y: 0.1 },
  ],
  scale: [0.5, 1, 1.5, 2],
  withFill: [true, false],
  fillColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  strokeColor: ['#ffffff', '#ff8800', '#88ff00', '#0088ff'],
  strokeWidth: [0, 0, 0, 0, 2, 4, 6, 8],
};

const strokeWidthForLine = paramsForRandomGraphics.strokeWidth.filter((item) => item > 0);

const pickRandom = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const getRandomSprite = (pixiScreen: Rectangle): Sprite => {
  const asset = pickRandom(SPRITE_ASSETS);
  const alpha = pickRandom(paramsForRandomGraphics.alpha);
  const positionPercent = pickRandom(paramsForRandomGraphics.positionPercent);
  const size = pickRandom(paramsForRandomGraphics.size);

  const sprite = Sprite.from(asset);
  sprite.width = size;
  // respect aspect ratio
  sprite.height = size * (sprite.texture.height / sprite.texture.width);
  sprite.anchor.set(0.5);
  sprite.alpha = alpha;
  sprite.position.set(pixiScreen.width * positionPercent.x, pixiScreen.height * positionPercent.y);

  return sprite;
};

export const getRandomGraphics = (pixiScreen: Rectangle): Graphics => {
  const g = new Graphics();
  const type = pickRandom(paramsForRandomGraphics.type);
  const size = pickRandom(paramsForRandomGraphics.size);
  const alpha = pickRandom(paramsForRandomGraphics.alpha);
  const angle = pickRandom(paramsForRandomGraphics.angle);
  const event = pickRandom(paramsForRandomGraphics.event);
  const positionPercent = pickRandom(paramsForRandomGraphics.positionPercent);
  const offsetPercent = pickRandom(paramsForRandomGraphics.offsetPercent);
  const scale = pickRandom(paramsForRandomGraphics.scale);
  const fillColor = pickRandom(paramsForRandomGraphics.fillColor);
  const strokeColor = pickRandom(paramsForRandomGraphics.strokeColor);
  const randomStrokeWidth = pickRandom(
    type === 'line' ? strokeWidthForLine : paramsForRandomGraphics.strokeWidth,
  );
  const maxStroke = Math.max(1, Math.floor(size * 0.15));
  const strokeWidth = Math.min(randomStrokeWidth, maxStroke);
  const withFill =
    type !== 'line' && (strokeWidth === 0 || pickRandom(paramsForRandomGraphics.withFill));

  if (event) {
    g.eventMode = event ? 'static' : 'none';
    g.on(event, () => {
      console.log(`Graphics ${event} event!`);
    });
  }

  if (strokeWidth > 0) {
    g.lineStyle(strokeWidth, strokeColor);
    // g.lineStyle(strokeWidth, strokeColor, 1, 1);
  }

  if (withFill) {
    g.beginFill(fillColor);
  }

  switch (type) {
    case 'line': {
      g.moveTo(size * offsetPercent.x, size * offsetPercent.y).lineTo(size, size);
      break;
    }
    case 'ellipse': {
      g.drawEllipse(size * offsetPercent.x, size * offsetPercent.y, size, size * 0.6);
      break;
    }
    case 'rect': {
      g.drawRect(size * offsetPercent.x, size * offsetPercent.y, size, size);
      break;
    }
    case 'rrect': {
      g.drawRoundedRect(size * offsetPercent.x, size * offsetPercent.y, size, size, size * 0.2);
      break;
    }
    case 'polygon': {
      g.drawPolygon([0, -size, size, 0, size * 0.5, size, -size * 0.5, size, -size, 0]);
      break;
    }
    case 'circle': {
      g.drawCircle(size * offsetPercent.x, size * offsetPercent.y, size);
      break;
    }
  }

  if (withFill) {
    g.endFill();
  }

  g.position.set(pixiScreen.width * positionPercent.x, pixiScreen.height * positionPercent.y);
  g.alpha = alpha;
  g.angle = angle;
  g.scale.set(scale, scale);

  return g;
};

export function createDemoScene(): Container {
  const container = new Container();
  return container;
}
