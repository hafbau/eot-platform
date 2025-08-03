import { BaseEntity } from '@eot/core';

export interface Integration extends BaseEntity {
  name: string;
  type: IntegrationType;
  organizationId: string;
  configuration: IntegrationConfig;
  status: IntegrationStatus;
  lastSyncAt?: Date;
  errorMessage?: string;
}

export enum IntegrationType {
  API = 'api',
  WEBHOOK = 'webhook',
  FILE_SYNC = 'file_sync',
  DATABASE = 'database',
}

export enum IntegrationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  PENDING = 'pending',
}

export interface IntegrationConfig {
  endpoint?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  authentication?: AuthenticationConfig;
  syncInterval?: number;
  filters?: Record<string, unknown>;
}

export interface AuthenticationConfig {
  type: 'api_key' | 'oauth2' | 'basic' | 'bearer';
  credentials: Record<string, string>;
}

export interface WebhookEndpoint extends BaseEntity {
  url: string;
  secret: string;
  events: string[];
  organizationId: string;
  isActive: boolean;
  lastTriggeredAt?: Date;
}

export interface ApiCall extends BaseEntity {
  integrationId: string;
  method: string;
  endpoint: string;
  requestData?: Record<string, unknown>;
  responseData?: Record<string, unknown>;
  statusCode: number;
  duration: number;
  success: boolean;
  errorMessage?: string;
}