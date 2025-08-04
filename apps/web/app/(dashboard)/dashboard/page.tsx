'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Gavel, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Plus,
  ArrowRight,
  Brain,
  FileCheck,
  Clock
} from 'lucide-react';
import { Button, Badge } from '@eot/ui';
import StatsCard from '../../../components/dashboard/StatsCard';
import ClaimsFunnelChart from '../../../components/dashboard/ClaimsFunnelChart';
import DelayTrendChart from '../../../components/dashboard/DelayTrendChart';
import UpcomingDeadlines from '../../../components/dashboard/UpcomingDeadlines';
import ActionItems from '../../../components/dashboard/ActionItems';
import { formatCurrency, formatNumber, formatPercentage } from '../../../lib/utils';
import { mockProjects, mockDelayAlerts, mockClaims, mockClaimsFunnel } from '../../../lib/mock-data';
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
  // Calculate stats from mock data
  const stats = {
    activeProjects: mockProjects.filter(p => p.status === 'active').length,
    totalProjects: mockProjects.length,
    openClaims: mockProjects.reduce((sum, p) => sum + p.openClaims, 0),
    claimsValue: mockProjects.reduce((sum, p) => sum + p.claimsValue, 0),
    totalClaims: mockProjects.reduce((sum, p) => sum + p.openClaims + p.approvedClaims, 0),
    approvedValueYTD: mockProjects.reduce((sum, p) => sum + p.approvedValue, 0),
    approvedClaimsYTD: mockProjects.reduce((sum, p) => sum + p.approvedClaims, 0),
    successRate: 85,
    newDelayAlerts: mockDelayAlerts.filter(d => d.status === 'pending_review').length,
    upcomingDeadlines: mockClaims.filter(c => c.daysUntilDeadline > 0 && c.daysUntilDeadline <= 14).length
  };

  // Transform mock data for charts
  const claimsFunnelData = [
    { stage: 'Identified', value: mockClaimsFunnel.identified.value, count: mockClaimsFunnel.identified.count },
    { stage: 'In Preparation', value: mockClaimsFunnel.inPreparation.value, count: mockClaimsFunnel.inPreparation.count },
    { stage: 'Submitted', value: mockClaimsFunnel.submitted.value, count: mockClaimsFunnel.submitted.count },
    { stage: 'Approved', value: mockClaimsFunnel.approved.value, count: mockClaimsFunnel.approved.count }
  ];

  const delayTrendData = [
    { month: 'Mar', delays: 3, claims: 2 },
    { month: 'Apr', delays: 5, claims: 3 },
    { month: 'May', delays: 4, claims: 2 },
    { month: 'Jun', delays: 7, claims: 4 },
    { month: 'Jul', delays: 6, claims: 3 },
    { month: 'Aug', delays: 5, claims: 3 }
  ];

  const upcomingDeadlines = mockClaims
    .filter(c => c.daysUntilDeadline > 0)
    .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline)
    .slice(0, 5)
    .map(claim => ({
      id: claim.id,
      title: claim.title,
      daysUntilDeadline: claim.daysUntilDeadline,
      type: 'claim' as const,
      priority: claim.daysUntilDeadline <= 7 ? 'high' : 'medium' as 'high' | 'medium',
      project: mockProjects.find(p => p.id === claim.projectId)?.name || ''
    }));

  const actionItems = [
    { id: '1', title: 'Review Foundation Delay Alert', description: 'AI detected 15-day delay requiring immediate attention', priority: 'high' as const, status: 'pending' as const },
    { id: '2', title: 'Submit Weather Delay Claim', description: 'Complete force majeure claim for Tower B', priority: 'high' as const, status: 'in_progress' as const },
    { id: '3', title: 'Update P6 Schedule', description: 'Sync latest progress from site', priority: 'medium' as const, status: 'pending' as const }
  ];

  const handleUpdateActionItem = (itemId: string, updates: any) => {
    console.log('Update action item:', itemId, updates);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with AI Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">EOT Intelligence Dashboard</h1>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Brain className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          <p className="text-gray-600">
            Real-time insights across {mockProjects.length} projects with ${formatNumber(stats.claimsValue / 1000000)}M in active claims
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/projects">
            <Button variant="outline">
              <Building2 className="mr-2 h-4 w-4" />
              View Projects
            </Button>
          </Link>
          <Button className="bg-blue-600 hover:bg-blue-700">
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
          badge={{ text: 'AI-Optimized', variant: 'success' }}
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

      {/* AI Alert Banner */}
      {mockDelayAlerts.filter(d => d.status === 'pending_review').length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI has detected {mockDelayAlerts.filter(d => d.status === 'pending_review').length} new delays requiring attention</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Total potential claim value: ${formatNumber(mockDelayAlerts.filter(d => d.status === 'pending_review').reduce((sum, d) => sum + d.estimatedCostImpact, 0) / 1000000)}M • Critical path impacted on {mockDelayAlerts.filter(d => d.criticalPath).length} delays
                </p>
              </div>
            </div>
            <Link href="/projects/1/delays">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Review Delays
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClaimsFunnelChart data={claimsFunnelData} />
        <DelayTrendChart data={delayTrendData} />
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
          
          <Link href="/projects/1/claims" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
            <div className="relative">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              {stats.openClaims > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {stats.openClaims}
                </span>
              )}
            </div>
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Review Claims</h4>
              <p className="text-sm text-gray-600">Process pending claims</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
          </Link>
          
          <Link href="/projects/1/delays" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors">
            <div className="relative">
              <AlertTriangle className="h-8 w-8 text-yellow-600 mr-3" />
              {stats.newDelayAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {stats.newDelayAlerts}
                </span>
              )}
            </div>
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Check Delays</h4>
              <p className="text-sm text-gray-600">Review AI-detected delays</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;