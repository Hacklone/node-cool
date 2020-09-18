# Install, Build & Run

## Install CLI

Install the `@node-cool/cli` package globally. With the CLI you'll be able to generate a `@node-cool` project quickly.

```bash
$ npm i -g @node-cool/cli
```

## Create project

Create a new project with the CLI.

```bash
$ node-cool new --name <project name>
```

This will generate a ready-to-go `@node-cool` project with example code in it.

## Build project

Once you've generated the project simply build it with the following command.

```bash
$ npm run build
```

## Run server

You can run your server with the following command.

```bash
$ cd dist
$ npm start
```

## Continously build server

```bash
$ npm run build-watch
```

## Continously serve server

```bash
$ npm run start-watch
```

#### Continue reading: [ Create controllers >>](/getting-started/controllers.md) <!-- {docsify-ignore} -->