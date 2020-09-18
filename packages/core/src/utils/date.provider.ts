import { Injectable } from 'injection-js';

@Injectable()
export class DateProvider {
  public now(): Date {
    return new Date();
  }
}