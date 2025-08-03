import { BaseEntity } from '@eot/core';

export interface AnalyticsReport extends BaseEntity {
  title: string;
  description?: string;
  organizationId: string;
  reportType: ReportType;
  filters: ReportFilters;
  data: ReportData;
  generatedBy: string;
  scheduledRun?: ScheduledRun;
}

export enum ReportType {
  DASHBOARD = 'dashboard',
  PROJECT_SUMMARY = 'project_summary',
  USER_ACTIVITY = 'user_activity',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom',
}

export interface ReportFilters {
  dateRange: DateRange;
  projectIds?: string[];
  userIds?: string[];
  categories?: string[];
  customFilters?: Record<string, unknown>;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  period?: TimePeriod;
}

export enum TimePeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}

export interface ReportData {
  metrics: Metric[];
  charts: ChartConfig[];
  tables: TableData[];
  summary: ReportSummary;
}

export interface Metric {
  name: string;
  value: number;
  previousValue?: number;
  changePercentage?: number;
  unit?: string;
  format?: 'number' | 'currency' | 'percentage' | 'duration';
}

export interface ChartConfig {
  type: ChartType;
  title: string;
  data: ChartDataPoint[];
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
}

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  AREA = 'area',
  SCATTER = 'scatter',
}

export interface ChartDataPoint {
  label: string;
  value: number;
  category?: string;
  timestamp?: Date;
}

export interface TableData {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  totalRows?: number;
}

export interface ReportSummary {
  totalRecords: number;
  keyInsights: string[];
  recommendations?: string[];
  dataQuality: DataQualityInfo;
}

export interface DataQualityInfo {
  completeness: number;
  accuracy: number;
  freshness: Date;
  issues?: string[];
}

export interface ScheduledRun {
  frequency: ScheduleFrequency;
  nextRun: Date;
  recipients: string[];
  isActive: boolean;
}

export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}