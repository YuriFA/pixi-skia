import { Container, Graphics, Text, TextStyle } from 'pixi.js-legacy';
import type { AppSize } from '../../core/contracts/AppModule';

const titleStyle = new TextStyle({
  fill: 0xf5f7ff,
  fontFamily: 'Inter, Arial, sans-serif',
  fontSize: 32,
  fontWeight: '700',
  align: 'center',
});

const subtitleStyle = new TextStyle({
  fill: 0x8a94b5,
  fontFamily: 'Inter, Arial, sans-serif',
  fontSize: 15,
  align: 'center',
});

export class DemoScene {
  public readonly container = new Container();

  private readonly title = new Text('Pixi.js modular template', titleStyle);
  private readonly subtitle = new Text('Feature modules live in src/modules', subtitleStyle);
  private readonly orbit = new Container();
  private readonly halo = new Graphics();
  private readonly core = new Graphics();
  private readonly satellite = new Graphics();

  public constructor() {
    this.title.anchor.set(0.5, 0);
    this.subtitle.anchor.set(0.5, 0);

    this.halo.lineStyle(2, 0x3658ff, 0.7);
    this.halo.drawCircle(0, 0, 96);

    this.core.beginFill(0x6f7cff);
    this.core.drawRoundedRect(-44, -44, 88, 88, 24);
    this.core.endFill();

    this.core.beginFill(0xffffff, 0.14);
    this.core.drawRoundedRect(-24, -18, 48, 14, 7);
    this.core.endFill();

    this.satellite.beginFill(0x6ee7ff);
    this.satellite.drawCircle(0, 0, 12);
    this.satellite.endFill();
    this.satellite.position.set(96, 0);

    this.orbit.addChild(this.halo, this.satellite);
    this.container.addChild(this.title, this.subtitle, this.orbit, this.core);
  }

  public update(deltaMS: number): void {
    this.orbit.rotation += deltaMS * 0.0012;
    this.core.rotation -= deltaMS * 0.00035;
  }

  public resize(size: AppSize): void {
    const titleY = Math.max(48, size.height * 0.18);

    this.title.position.set(size.width / 2, titleY);
    this.subtitle.position.set(size.width / 2, titleY + 42);
    this.orbit.position.set(size.width / 2, size.height / 2 + 40);
    this.core.position.copyFrom(this.orbit.position);
  }

  public destroy(): void {
    this.container.destroy({
      children: true,
    });
  }
}
