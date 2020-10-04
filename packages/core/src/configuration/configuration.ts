import { CoolModuleConfiguration } from './../metadata/cool-module.metadata';
import { Injectable, Inject } from 'injection-js';
import { PROCESS, APPLICATION_MODULE_METADATA } from '../injector/internal-injection-tokens';

@Injectable()
export class Configuration {
  constructor(
    @Inject(PROCESS) private _process: NodeJS.Process,
    @Inject(APPLICATION_MODULE_METADATA)
    private _applicationModuleMetadata: CoolModuleConfiguration,
  ) {}

  public port: number = (this._process.env.PORT && +this._process.env.PORT) || this._applicationModuleMetadata.configuration?.port || 2000;

  public serverAddress: string | undefined = this._process.env.SERVER_ADDRESS || this._applicationModuleMetadata.configuration?.serverAddress;

  public crossOrigin = {
    enabled: this._applicationModuleMetadata.configuration?.crossOriginDomains?.enabled,
    domains: this._process.env.CROSS_ORIGIN_DOMAINS ? this._process.env.CROSS_ORIGIN_DOMAINS.split(',') : (this._applicationModuleMetadata.configuration?.crossOriginDomains?.domains || []),
  };

  public xsrfExcludeRoutes: RegExp[] = this._applicationModuleMetadata.configuration?.xsrfValidation?.excludeRoutes || [];

  public disableSecureCookies = this._applicationModuleMetadata.configuration?.disableSecureCookies;

  public getConfigurationByKey(key: string): string | undefined {
    return this._process.env[key];
  }
}
