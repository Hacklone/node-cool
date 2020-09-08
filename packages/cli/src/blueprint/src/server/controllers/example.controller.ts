import { Injectable, JsonController, Get, Param } from '@node-cool/core';

import { ExampleDTO } from './../../dto/entity.dto';
import { ExampleService } from '../services/example.service';

@Injectable()
@JsonController('/example')
export class ExampleController {
  constructor(private _exampleService: ExampleService) {

  }

  @Get('/:exampleId([0-9]+)')
  public async getExampleStatusAsync(@Param('exampleId') exampleId: string): Promise<ExampleDTO> {
    const example = await this._exampleService.getExampleByIdAsync(exampleId);

    return example.toDTO();
  }
}