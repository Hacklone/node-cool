import { Injectable } from 'injection-js';
import { Context } from 'koa';
import { Ctx, Get, JsonController } from 'routing-controllers';
import { CryptoUtils } from '../utils/crypto-utils';

@Injectable()
@JsonController('/settings/xsrf-token')
export class XSRFTokenController {
  constructor(private _cryptoUtils: CryptoUtils) {}

  @Get()
  public async getXSRFTokenAsync(@Ctx() context: Context): Promise<{ token: string }> {
    const xsrfToken = await this._cryptoUtils.getCryptoRandomStringAsync(15);

    context.cookies.set('XSRF-TOKEN', xsrfToken, {
      signed: true,
      httpOnly: false,
      sameSite: 'none',
      path: '/',
    });

    return {
      token: xsrfToken,
    };
  }
}
