import * as PIXI from 'pixi.js-legacy';

import { GraphicsNode } from './nodes/GraphicsNode';
import { isRenderable } from './nodes/lib/utils';
import { PixiSkiaNode } from './nodes/SkiaNode';
import { SpriteNode } from './nodes/SpriteNode';

export const buildNodes = (container: PIXI.Container): PixiSkiaNode[] => {
  const nodes: PixiSkiaNode[] = [];

  const traverse = (displayObject: PIXI.DisplayObject) => {
    if (!isRenderable(displayObject)) {
      return;
    }

    if (displayObject instanceof PIXI.Sprite) {
      nodes.push(new SpriteNode(displayObject));
    } else if (displayObject instanceof PIXI.Graphics) {
      nodes.push(new GraphicsNode(displayObject));
    }

    if (displayObject instanceof PIXI.Container) {
      displayObject.children.forEach(traverse);
    }
  };

  container.children.forEach(traverse);

  return nodes;
};
