import { Circle, Container, Graphics, Sprite, Assets } from 'pixi.js-legacy';

const SPRITE_ASSETS = ['https://pixijs.com/assets/bunny.png'];

export const loadDemoSceneAssets = () => {
  return Assets.load(SPRITE_ASSETS);
};

export function createDemoScene(): Container {
  const container = new Container();
  const subContainer = new Container();

  const g1 = new Graphics();
  const g2 = new Graphics();
  const g3 = new Graphics();
  const g4 = new Graphics();
  const g5 = new Graphics();
  const g6 = new Graphics();
  const g7 = new Graphics();

  const bunny = Sprite.from(SPRITE_ASSETS[0]);
  bunny.anchor.set(0.5);
  bunny.alpha = 0.5;
  bunny.position.set(450, 300);

  container.sortableChildren = true;

  g1.zIndex = -1;
  g1.beginFill('#ff0000').drawEllipse(120, 0, 200, 100).endFill();
  g1.position.set(200, 100);
  g1.angle = 30;
  g1.eventMode = 'static';
  g1.on('pointerdown', () => {
    console.log('g1 pointerdown!');
  });

  g2.beginFill('#0000ff').drawRect(-50, -75, 100, 150).endFill();
  g2.position.set(120, 60);
  g2.angle = 15;
  g2.scale.set(1.5, 1.7);
  g2.eventMode = 'static';
  g2.on('pointerup', () => {
    console.log('g2 pointerup!');
  });

  g3.lineStyle(10, '#ffffff', 1).moveTo(0, 0).lineTo(150, 100);
  g3.angle = -20;
  g3.position.set(275, 50);

  g4.lineStyle(10, '#ffff00', 1).moveTo(0, 70).lineTo(150, -30);
  g4.angle = 20;

  g5.lineStyle(15, '#AFCA8B', 1)
    .beginFill('#f1A01f')
    .drawShape(new Circle(200, 300, 100))
    .endFill();

  g6.beginFill('#C1B2F3').drawRoundedRect(300, 200, 150, 100, 20);

  g7.beginFill('#F3B2C1').drawPolygon([500, 100, 550, 150, 500, 200, 450, 150]).endFill();
  g7.position.set(-210, -100);

  subContainer.alpha = 0.5;
  subContainer.position.set(75, 50);
  subContainer.addChild(g3, g4, g7, g6);
  container.addChild(subContainer, g1, g2, g5, bunny);

  return container;
}
