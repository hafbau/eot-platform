import { BaseEntity } from '@eot/core';

export interface FileMetadata extends BaseEntity {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  checksum: string;
  organizationId: string;
  uploadedBy: string;
  path: string;
  isPublic: boolean;
  tags: string[];
  metadata: Record<string, unknown>;
}

export interface UploadOptions {
  isPublic?: boolean;
  tags?: string[];
  metadata?: Record<string, unknown>;
  maxSize?: number;
  allowedTypes?: string[];
}

export interface StorageProvider {
  upload(file: File, options?: UploadOptions): Promise<FileMetadata>;
  download(fileId: string): Promise<Blob>;
  delete(fileId: string): Promise<boolean>;
  getUrl(fileId: string): Promise<string>;
}

export interface StorageQuota {
  organizationId: string;
  usedBytes: number;
  limitBytes: number;
  fileCount: number;
  maxFileCount: number;
}