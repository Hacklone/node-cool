import { TestMiddleware } from './middlewares/test.middleware';
import { TestController } from './controllers/test.controller';
import { CoolModule } from '@node-cool/core';
import { TestService } from './services/test.service';

@CoolModule({
  controllers: [
    TestController,
  ],
  globalMiddlewares: [
    TestMiddleware,
  ],
  providers: [
    TestService,
  ],
})
export class ServerModule {

}