import { Circle, Container, Graphics } from 'pixi.js-legacy';

export function createDemoScene(): Container {
  const container = new Container();
  const subContainer = new Container();

  const g1 = new Graphics()
  const g2 = new Graphics()
  const g3 = new Graphics()
  const g4 = new Graphics()
  const g5 = new Graphics()
  const g6 = new Graphics()
  const g7 = new Graphics()

  g1.beginFill('#ff0000').drawEllipse(120, 0, 200, 100).endFill()
  g1.position.set(200, 100)
  g1.angle = 30
  g1.eventMode = 'static'
  g1.on('pointerdown', () => {
    console.log('g1 pointerdown!')
  })

  g2.beginFill('#0000ff').drawRect(-50, -75, 100, 150).endFill()
  g2.position.set(120, 60)
  g2.angle = 15
  g2.scale.set(1.5, 1.7)
  g2.eventMode = 'static'
  g2.on('pointerup', () => {
    console.log('g2 pointerup!')
  })

  g3.lineStyle(10, '#ffffff', 1)
    .moveTo(0, 0).lineTo(150, 100)
  g3.angle = -20
  g3.position.set(275, 50)

  g4.lineStyle(10, '#ffff00', 1)
    .moveTo(0, 70).lineTo(150, -30)
  g4.angle = 20

  g5.lineStyle(15, '#AFCA8B', 1).beginFill('#f1A01f').drawShape(new Circle(200, 300, 100)).endFill()
  // g5.lineStyle(50, '#AFCA8B', 1).drawCircle(200, 300, 100)

  g6.beginFill('#C1B2F3').drawRoundedRect(400, 200, 150, 100, 20).endFill()

  g7.beginFill('#F3B2C1').drawPolygon([500, 100, 550, 150, 500, 200, 450, 150]).endFill()
  g7.position.set(-210, -100)

  subContainer.position.set(75, 50)
  subContainer.addChild(g3, g4, g7)
  container.addChild(subContainer, g1, g2, g5, g6);

  return container;
}
