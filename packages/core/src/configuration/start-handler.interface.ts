export interface StartHandler {
  onStartAsync(app: any): Promise<void>;
}