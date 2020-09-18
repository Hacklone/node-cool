import { Injectable } from 'injection-js';
import * as crypto from 'crypto';

@Injectable()
export class CryptoUtils {
  public async getCryptoRandomStringAsync(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(256, (err, buf) => {
        if (err) {
          reject(err);

          return;
        }

        resolve(buf.toString('base64'));
      });
    });
  }
}