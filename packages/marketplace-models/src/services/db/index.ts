export interface DB {
  get<T = never>(key: string): Promise<T>;
  set(key: string, value: unknown): Promise<{ Created: true }>;
}
