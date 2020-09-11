import { TestService } from './../services/test.service';
import { Injectable, JsonController, Get } from '@node-cool/core';

@Injectable()
@JsonController('/test')
export class TestController {
  constructor(private _testService: TestService) {}

  @Get()
  public async getTestStatus(): Promise<string> {
    return await this._testService.getTestTextAsync();
  }
}
