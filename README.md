## Simple To‑Do App (Expo + TypeScript)

### Install

```bash
pnpm install
```

If you haven't installed the Expo CLI globally, you don't need to — `pnpm` scripts use it.

### Run

```bash
pnpm start
```

Then choose a platform:

- `a` for Android (device/emulator)
- `i` for iOS (on macOS)
- `w` for Web

### Features

- Add tasks, toggle complete, delete
- Persist tasks with AsyncStorage
- Clear all completed tasks

### Notes

- Web uses a polyfilled storage layer; persistence works across reloads.
- If you see Metro cache issues, clear with:

```bash
pnpm start -- --clear
```


