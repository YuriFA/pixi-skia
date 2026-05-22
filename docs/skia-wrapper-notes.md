# Skia wrapper notes

- Вход рендера: корневой `PIXI.Container`.
- Рендерер рекурсивно обходит `Container.children`.
- Поддерживаются только `PIXI.Container`, `PIXI.Graphics`, `PIXI.Sprite`.
- Не поддерживаются `masks`, `filters`, `text`, `blend modes`, `skew`.
- Неподдерживаемые типы объектов и неподдерживаемые возможности пропускаются без падения рендера.

- Для трансформаций используется `DisplayObject.worldTransform`.
- Трансформация не собирается вручную из `position`, `rotation` и `scale`, потому что `worldTransform` уже включает локальные трансформации объекта и его родителей.

- Объект рендерится только если он видим: нужно учитывать `visible` и `renderable`.
- Прозрачность берется из `worldAlpha`, а не только из локального `alpha`.
- Если `worldAlpha <= 0`, объект можно не рисовать.

- `PIXI.Graphics` поддерживается через чтение `graphics.geometry`.
- На первом этапе достаточно поддержать базовые команды и shape-ы, которые реально нужны в задачах: `drawRect`, `moveTo`, `lineTo`, `drawShape` для простых фигур.

- `PIXI.Sprite` поддерживается через `sprite.texture`.
- При рендере `Sprite` нужно учитывать `sprite.anchor`.
