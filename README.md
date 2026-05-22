# Pixi Modular Template

Starter template on `pixi.js-legacy@7.4.2` with `Vite + TypeScript` and a simple modular architecture.

## Scripts

- `pnpm dev` - start dev server
- `pnpm build` - type-check and build production bundle
- `pnpm preview` - preview production build

## Structure

```text
src/
  app/       application bootstrap and module wiring
  core/      shared engine-level contracts and Pixi setup
  modules/   feature modules
  shared/    config and UI assets
```

## Module contract

Each feature module implements `AppModule`:

- `mount(context)` - attach Pixi display objects
- `update(deltaMS)` - frame updates
- `resize(size)` - viewport resize handling
- `destroy()` - cleanup

Add new modules in `src/modules` and register them in `src/app/App.ts`.
