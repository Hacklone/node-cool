import { Injectable, JsonController, Get } from '@node-cool/core';

import { ExampleService } from '../services/example.service';

@Injectable()
@JsonController('/example')
export class ExampleController {
  constructor(private _exampleService: ExampleService) {

  }

  @Get()
  public async getExampleStatus() {
    return this._exampleService.getExampleText();
  }
}