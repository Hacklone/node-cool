# Controllers

In this section we'll create a very simple API controller

### 1. Add controller code

```typescript
// ./src/controllers/example.controller.ts

import { Injectable, JsonController, Get } from '@node-cool/core';

@Injectable()
@JsonController('/example')
export class ExampleController {
  @Get()
  public async getExampleStatusAsync(): Promise<{ message: string }> {
    return {
      message: 'Hello',
    };
  }
}
```

### 2. Register controller in the server module

```typescript
// ./src/server.module.ts

import { CoolModule } from '@node-cool/core';

import { ExampleController } from './controllers/example.controller';

@CoolModule({
  controllers: [
    ExampleController
  ],
})
export class ServerModule {

}
```

[Learn more about controllers >>](/core/controllers.md)

#### Continue reading: [ Create services >>](/getting-started/services.md) <!-- {docsify-ignore} -->