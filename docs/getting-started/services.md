# Services

In this section we'll create a simple service and use it from a controller

### 1. Create service code
```typescript
// ./src/services/example.service.ts

import { Injectable } from '@node-cool/core';
import { DatabaseConnection } from '@node-cool/database';

import { ExampleEntity } from './../entities/example.entity';

@Injectable()
export class ExampleService {
  constructor(private _databaseConnection: DatabaseConnection) {

  }

  public async getExampleByIdAsync(exampleId: string): Promise<ExampleEntity | undefined> {
    return await this._databaseConnection.getRepository(ExampleEntity)
      .findOne({
        where: {
          id: exampleId,
        },
      });
  }
}
```

### 2. Register service in the server module
```typescript
// ./src/server.module.ts

import { CoolModule } from '@node-cool/core';
import { DatabaseModule } from '@node-cool/database';

import { ExampleController } from './controllers/example.controller';
import { ExampleService } from './services/example.service';

@CoolModule({
  controllers: [
    ExampleController
  ],
  providers: [
    ExampleService
  ],
  imports: [
    DatabaseModule
  ],
})
export class ServerModule {

}
```

### 3. Inject the service into another component like a controller

```typescript
// ./src/controllers/example.controller.ts

import { Injectable, JsonController, Get, Param, NotFoundApplicationError } from '@node-cool/core';

import { ExampleDTO } from './../../dto/example.dto';
import { ExampleService } from '../services/example.service';
@Injectable()
@JsonController('/example')
export class ExampleController {
  constructor(private _exampleService: ExampleService) {}

  @Get('/:exampleId([0-9]+)')
  public async getExampleStatusAsync(@Param('exampleId') exampleId: string): Promise<ExampleDTO> {
    const example = await this._exampleService.getExampleByIdAsync(exampleId);

    if (!example) {
      throw new NotFoundApplicationError();
    }

    return example.toDTO();
  }
}
```

#### Continue reading: [ Configuration >>](/core/configuration.md) <!-- {docsify-ignore} -->