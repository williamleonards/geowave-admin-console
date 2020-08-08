# geowave-admin-ui

> Administrative console for a GeoWave deployment

![Build Status](https://camo.githubusercontent.com/669cfefa47b585cefab96cd34936c6292d77ff03/68747470733a2f2f6a656e6b696e732e61646d696e2d75692e67656f776176652d6c656f6e652d74656d706465762e6e65742f6275696c645374617475732f69636f6e3f6a6f623d67656f776176652d61646d696e2d7569)


## Running locally for development

```bash
./scripts/develop.sh
```

Enter http://localhost:3000/ in a browser to see the UI


## Building

### Compiling all assets

```bash
./scripts/compile.sh
```

### Packaging for deployment

```bash
./scripts/package.sh
```


## Linting source code

```bash
./scripts/lint.sh

# Automatically fix certain linter errors
./scripts/lint.sh --fix
```


## Running unit tests

```bash
./scripts/test.sh

# Run in watch mode
./scripts/test.sh --watchAll
```


## Environment Variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | If `production`, bundle will be minified and stripped of development helpers/scaffolding code (defaults to `development`). |
| `API_PROXY` | Overrides the default hostname webpack-dev-server proxies API requests to during local development. |
| `COMPILER_TARGET` | Overrides the ECMAScript version of code TypeScript emits (defaults to `es7` in dev, `es5` in prod). |

