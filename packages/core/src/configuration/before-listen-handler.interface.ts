import * as http from 'http';

export type Server = http.Server;

export interface BeforeListenHandler {
  onBeforeListenAsync(server: Server): Promise<void>;
}
