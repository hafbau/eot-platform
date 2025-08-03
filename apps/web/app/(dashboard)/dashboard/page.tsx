'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Gavel, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Button } from '@eot/ui';
import StatsCard from '../../../components/dashboard/StatsCard';
import ClaimsFunnelChart from '../../../components/dashboard/ClaimsFunnelChart';
import DelayTrendChart from '../../../components/dashboard/DelayTrendChart';
import UpcomingDeadlines from '../../../components/dashboard/UpcomingDeadlines';
import ActionItems from '../../../components/dashboard/ActionItems';
import { 
  getDashboardStats, 
  getClaimsFunnel, 
  getDelayTrend, 
  getUpcomingDeadlines, 
  getActionItems,
  updateActionItem
} from '../../../lib/api/dashboard';
import { formatCurrency, formatNumber, formatPercentage } from '../../../lib/utils';
import { 
  type DashboardStats, 
  type ClaimsFunnelData, 
  type DelayTrendChartData, 
  type DeadlineFromAPI 
} from '../../../lib/types';

// Dashboard specific types for chart data
interface DashboardDelayTrend {
  month: string;
  delays: number;
  claims: number;
}

interface LocalDashboardStats {
  activeProjects: number;
  totalProjects: number;
  openClaims: number;
  claimsValue: number;
  totalClaims: number;
  approvedValueYTD: number;
  approvedClaimsYTD: number;
  successRate: number;
  newDelayAlerts: number;
  upcomingDeadlines: number;
}

interface ActionItem {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  assignee?: string;
  dueDate?: string;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<LocalDashboardStats | null>(null);
  const [claimsFunnel, setClaimsFunnel] = useState<ClaimsFunnelData[]>([]);
  const [delayTrend, setDelayTrend] = useState<DashboardDelayTrend[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [
          statsResult,
          funnelResult,
          trendResult,
          deadlinesResult,
          itemsResult
        ] = await Promise.all([
          getDashboardStats(),
          getClaimsFunnel(),
          getDelayTrend(),
          getUpcomingDeadlines(5),
          getActionItems({ limit: 5 })
        ]);

        if (statsResult.success) setStats(statsResult.data);
        if (funnelResult.success) setClaimsFunnel(funnelResult.data);
        if (trendResult.success) setDelayTrend(trendResult.data);
        if (deadlinesResult.success) setUpcomingDeadlines(deadlinesResult.data);
        if (itemsResult.success) setActionItems(itemsResult.data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleUpdateActionItem = async (itemId: string, updates: Partial<ActionItem>) => {
    try {
      const result = await updateActionItem(itemId, updates);
      if (result.success) {
        setActionItems(items => 
          items.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating action item:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/projects">
            <Button variant="outline">
              <Building2 className="mr-2 h-4 w-4" />
              View Projects
            </Button>
          </Link>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Projects"
          value={formatNumber(stats?.activeProjects || 0)}
          subtitle={`${formatNumber(stats?.totalProjects || 0)} total`}
          icon={Building2}
          change={`+2 this month`}
          changeType="positive"
        />
        <StatsCard
          title="Open Claims"
          value={formatNumber(stats?.openClaims || 0)}
          subtitle={formatCurrency(stats?.claimsValue || 0)}
          icon={Gavel}
          change={`${formatNumber(stats?.totalClaims || 0)} total`}
          changeType="neutral"
        />
        <StatsCard
          title="Approved YTD"
          value={formatCurrency(stats?.approvedValueYTD || 0)}
          subtitle={`${formatNumber(stats?.approvedClaimsYTD || 0)} claims`}
          icon={DollarSign}
          change={`${formatPercentage((stats?.successRate || 0) / 100)} success rate`}
          changeType="positive"
        />
        <StatsCard
          title="Delay Alerts"
          value={formatNumber(stats?.newDelayAlerts || 0)}
          subtitle="New this week"
          icon={AlertTriangle}
          change={`${formatNumber(stats?.upcomingDeadlines || 0)} deadlines approaching`}
          changeType="neutral"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClaimsFunnelChart data={claimsFunnel} />
        <DelayTrendChart data={delayTrend} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingDeadlines deadlines={upcomingDeadlines} />
        <ActionItems 
          items={actionItems} 
          onUpdateItem={handleUpdateActionItem}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/projects" 
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Building2 className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Manage Projects</h4>
              <p className="text-sm text-gray-600">View and manage all projects</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
          </Link>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Review Claims</h4>
              <p className="text-sm text-gray-600">Process pending claims</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Check Delays</h4>
              <p className="text-sm text-gray-600">Review delay alerts</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;