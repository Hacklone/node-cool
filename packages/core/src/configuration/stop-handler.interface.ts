export interface StopHandler {
  onStopAsync(): Promise<void>;
}
