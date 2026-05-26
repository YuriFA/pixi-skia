# Pixi Skia Renderer

Приложение, которое объединяет возможности `pixi.js` и `Skia` (canvaskit-wasm), реализует собственную обертку для рендера Pixi-контейнера с помощью Skia и позволяет экспортировать результат в PDF с использованием Skia PDF backend (custom wasm build)

## Технологии:
- Typescript
- Pixi.js
- Skia (canvaskit-wasm)
- Skia PDF backend (custom wasm build)
- Vite

## Scripts

- `pnpm dev` - start dev server
- `pnpm build` - type-check and build production bundle
- `pnpm preview` - preview production build
- `pnpm lint` - run linter (oxlint + tsc)
- `pnpm fmt` - format code (oxfmt)

## Установка и запуск

- `pnpm install` - установить зависимости
- `pnpm dev` - запустить dev сервер
- Открыть `http://localhost:5173` в браузере (автоматически откроется)

На экране будет отображаться:

- Pixi-контейнер в котором по кнопкам можно добавить рандомные PIXI.Graphics и PIXI.Sprite или очистить экран
- Skia-контейнер с идентичной сценой с Pixi контейнером, в котором можно экспортировать результат в PDF (кнопка "Export PDF")
