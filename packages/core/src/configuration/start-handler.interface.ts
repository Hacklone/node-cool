export interface StartHandler {
  onStartAsync(app: unknown): Promise<void>;
}
