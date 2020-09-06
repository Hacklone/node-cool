# Cool - The coolest opinionated fully loaded node framework

[![NPM version][npm-image]][npm-url]

An opinionated ready-to-go node server framework built with:
- [TypeScript](https://www.npmjs.com/package/typescript)
- [injection-js](https://www.npmjs.com/package/injection-js)
- [Koa.js](https://www.npmjs.com/package/koa)
- [routing-controllers](https://www.npmjs.com/package/routing-controllers)
- [TypeORM](https://www.npmjs.com/package/typeorm)

## Usage

### Install CLI

> npm i -g @node-cool/cli

### Create project

> cool new --name <project name>

### Build project

> npm i

> npm run build

### Run server

> cd dist && npm start

## Examples

### Create a controller

./src/controllers/my-new-controller.controller.ts
```typescript
import { Injectable, JsonController, Get } from '@node-cool/core';

@Injectable()
@JsonController('/example')
export class ExampleController {
  @Get()
  public async getExampleStatus() {
    return { message: 'This is my response' };
  }
}
```

./src/server.module.ts
```typescript
import { CoolModule } from '@node-cool/core';

import { ExampleController } from './controllers/example.controller';

@CoolModule({
  controllers: [
    ExampleController,
  ],
})
export class ServerModule {

}
```

Additional information on how to write Controllers: https://www.npmjs.com/package/routing-controllers

[npm-url]: https://www.npmjs.com/package/@node-cool/core
[npm-image]: http://img.shields.io/npm/v/@node-cool/core.svg