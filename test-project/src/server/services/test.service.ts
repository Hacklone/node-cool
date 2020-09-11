import { Injectable } from '@node-cool/core';

@Injectable()
export class TestService {
  public getTestTextAsync(): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('Test OK');
      }, 10);
    });
  }
}
