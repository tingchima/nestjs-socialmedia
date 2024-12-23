export interface MediaFileStoragePort {
  getSignedUrl(by: { key: string; bucket: string; expiresIn: number }): Promise<string>;
}
