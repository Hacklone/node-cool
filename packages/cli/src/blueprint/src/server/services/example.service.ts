import { Injectable } from '@node-cool/core';

@Injectable()
export class ExampleService {
  public getExampleText(): string {
    return 'Example';
  }
}