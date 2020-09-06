import { Injectable } from '@node-cool/core';

@Injectable()
export class TestService {
  public getTestText(): string {
    return 'Test OK';
  }
}