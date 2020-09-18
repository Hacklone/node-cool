# Controllers

`@node-cool` uses [routing-controllers](https://www.npmjs.com/package/routing-controllers) for defining controllers.

## Example with most of the important stuff

``` typescript
import { Injectable, JsonController, Get, Post, Delete, Param, QueryParam, Body } from '@node-cool/core';
import { ExampleDTO } from 'example.dto';

@Injectable()
@JsonController('/examples')
export class ExampleController {
  constructor(private _exampleService: ExampleService) {}

  @Get()
  public async getExamplesAsync(@QueryParam('filter') filter: text): Promise<ExampleDTO[]> {
    const examples = await this._exampleService.getExamplesAsync(filter);

    return examples.map(example => example.toDTO());
  }

  @Get('/:exampleId([0-9]+)')
  public async getExampleByIdAsync(@Param('exampleId') exampleId: string): Promise<ExampleDTO> {
    const example = await this._exampleService.getExampleByIdAsync(exampleId);

    if (!example) {
      throw new NotFoundApplicationError();
    }

    return example.toDTO();
  }

  @Post('/:exampleId([0-9]+)')
  public async updateExampleAsync(@Body() example: ExampleDTO): Promise<boolean> {
    await this._exampleService.updateExampleAsync(example);

    return true;
  }

  @Delete('/:exampleId([0-9]+)')
  public async removeExampleByIdAsync(@Param('exampleId') exampleId: string): Promise<boolean> {
    await this._exampleService.removeExampleByIdAsync(exampleId);

    return true;
  }
}
```

[Read advanced controller declaration concepts](https://www.npmjs.com/package/routing-controllers)