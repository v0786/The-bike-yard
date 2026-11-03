// Storage provider abstraction per ARCHITECTURE §7
export interface StorageProvider {
  upload(key: string, buffer: Buffer, mimeType: string): Promise<{ url: string }>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn: number): Promise<string>;
}

export class LocalStorageProvider implements StorageProvider {
  async upload(key: string, buffer: Buffer, mimeType: string) {
    return { url: `/storage/${key}` };
  }
  async download(key: string) {
    return Buffer.from('');
  }
  async delete(key: string) {}
  async getSignedUrl(key: string, expiresIn: number) {
    return `/storage/${key}?t=${expiresIn}`;
  }
}

export const storage: StorageProvider = new LocalStorageProvider();
