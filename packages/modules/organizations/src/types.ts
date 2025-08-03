import { BaseEntity } from '@eot/core';

// Organization Types
export interface OrganizationConfig extends BaseEntity {
  organizationId: string;
  settings: OrganizationSettings;
  features: OrganizationFeature[];
  limits: OrganizationLimits;
  billing: BillingInfo;
}

export interface OrganizationSettings {
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  language: string;
  logoUrl?: string;
  theme: ThemeSettings;
  notifications: NotificationSettings;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  darkMode: boolean;
  customCss?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  digestFrequency: DigestFrequency;
}

export enum DigestFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  NEVER = 'never',
}

// Feature Management
export interface OrganizationFeature extends BaseEntity {
  organizationId: string;
  featureName: string;
  isEnabled: boolean;
  configuration?: Record<string, unknown>;
  enabledAt?: Date;
  enabledBy?: string;
}

export interface FeatureFlag {
  name: string;
  description: string;
  isDefault: boolean;
  requiredPlan?: string;
}

// Organization Limits
export interface OrganizationLimits {
  maxUsers: number;
  maxProjects: number;
  maxStorageGB: number;
  maxApiCallsPerMonth: number;
  maxIntegrations: number;
}

// Billing Types
export interface BillingInfo extends BaseEntity {
  organizationId: string;
  plan: SubscriptionPlan;
  status: BillingStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  paymentMethod?: PaymentMethod;
}

export enum SubscriptionPlan {
  FREE = 'free',
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export enum BillingStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
}

export interface PaymentMethod {
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

// Multi-tenant Types
export interface TenantContext {
  organizationId: string;
  userId: string;
  permissions: string[];
  features: string[];
  limits: OrganizationLimits;
}

export interface OrganizationMember extends BaseEntity {
  organizationId: string;
  userId: string;
  role: string;
  status: MemberStatus;
  invitedBy?: string;
  invitedAt?: Date;
  joinedAt?: Date;
}

export enum MemberStatus {
  INVITED = 'invited',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  LEFT = 'left',
}

export interface OrganizationInvitation extends BaseEntity {
  organizationId: string;
  email: string;
  role: string;
  invitedBy: string;
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
  status: InvitationStatus;
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}