import { Injectable } from 'injection-js';
import * as crypto from 'crypto';

@Injectable()
export class CryptoUtils {
  public async getCryptoRandomStringAsync(length = 256): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(length, (err, buf) => {
        if (err) {
          reject(err);

          return;
        }

        resolve(buf.toString('base64'));
      });
    });
  }
}