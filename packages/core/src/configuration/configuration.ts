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

  public port: number = (this._process.env.PORT && +this._process.env.PORT) || 2000;

  public crossOrigin = {
    enabled: !!this._applicationModuleMetadata.configuration?.crossOriginDomains,
    domains: this._applicationModuleMetadata.configuration?.crossOriginDomains || [],
  };
}
