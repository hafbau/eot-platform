'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@eot/ui';
import { 
  ArrowLeft, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  Gavel,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import StatsCard from '../../../../../components/dashboard/StatsCard';
import { getProjectDashboard } from '../../../../../lib/api/projects';
import { formatCurrency, formatDate, formatNumber, getStatusColor } from '../../../../../lib/utils';

interface Project {
  id: string;
  name: string;
  description: string;
  contractValue: number;
  projectManager: string;
  status: string;
  healthScore: number;
  plannedCompletion: string;
}

interface ProjectStats {
  totalDelays: number;
  criticalDelays: number;
  avgDelayDays: number;
  totalClaims: number;
  claimsValue: number;
}

interface DelayItem {
  id: string;
  activityName: string;
  description: string;
  delayDays: number;
  detectionDate: string;
}

interface ClaimItem {
  id: string;
  referenceNumber: string;
  title: string;
  claimAmount: number;
  // Can be string when submitted, null when still draft (matches API mock data)
  submissionDate?: string | null;
}

interface ProjectData {
  project: Project;
  delays: DelayItem[];
  claims: ClaimItem[];
  stats: ProjectStats;
}

const ProjectDashboardPage = () => {
  const params = useParams();
  const projectId = params?.projectId as string;
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        const result = await getProjectDashboard(projectId);
        if (result.success && result.data) {
          setProjectData(result.data);
        }
      } catch (error) {
        console.error('Error loading project data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Project not found</h3>
        <p className="mt-2 text-gray-600">The requested project could not be loaded.</p>
        <Link href="/projects" className="mt-4 inline-block">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const { project, delays, claims, stats } = projectData;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="mt-2 text-gray-600">{project.description}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link href={`/projects/${projectId}/schedule`}>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          </Link>
          <Link href={`/projects/${projectId}/claims`}>
            <Button>
              <Gavel className="mr-2 h-4 w-4" />
              Claims
            </Button>
          </Link>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Contract Value</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(project.contractValue)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Project Manager</p>
            <p className="text-lg font-semibold text-gray-900">{project.projectManager}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ')}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Health Score</p>
            <p className="text-2xl font-bold text-gray-900">{project.healthScore}/100</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Delays"
          value={formatNumber(stats.totalDelays)}
          subtitle={`${stats.criticalDelays} critical`}
          icon={AlertTriangle}
          change={`${stats.avgDelayDays} avg days`}
          changeType="neutral"
        />
        <StatsCard
          title="Active Claims"
          value={formatNumber(stats.totalClaims)}
          subtitle={formatCurrency(stats.claimsValue)}
          icon={Gavel}
          change="2 pending review"
          changeType="neutral"
        />
        <StatsCard
          title="Schedule Progress"
          value="68%"
          subtitle="On track"
          icon={TrendingUp}
          change="+2% this week"
          changeType="positive"
        />
        <StatsCard
          title="Days Remaining"
          value="892"
          subtitle={formatDate(project.plannedCompletion)}
          icon={Clock}
          change="On schedule"
          changeType="positive"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Delays */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Delays</h3>
            <Link href={`/projects/${projectId}/delays`}>
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          {delays.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No delays detected</h3>
              <p className="mt-1 text-sm text-gray-500">Project is running smoothly.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {delays.slice(0, 3).map((delay) => (
                <div key={delay.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {delay.activityName}
                      </h4>
                      <p className="text-sm text-gray-600">{delay.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-red-600">
                        {delay.delayDays} days
                      </span>
                      <p className="text-xs text-gray-500">
                        {formatDate(delay.detectionDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Claims */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Claims</h3>
            <Link href={`/projects/${projectId}/claims`}>
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          {claims.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No claims yet</h3>
              <p className="mt-1 text-sm text-gray-500">Claims will appear here when created.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {claims.slice(0, 3).map((claim) => (
                <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {claim.referenceNumber}
                      </h4>
                      <p className="text-sm text-gray-600">{claim.title}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(claim.claimAmount)}
                      </span>
                      <p className="text-xs text-gray-500">
                        {claim.submissionDate ? formatDate(claim.submissionDate) : 'Draft'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link 
            href={`/projects/${projectId}/schedule`}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Calendar className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Schedule</h4>
              <p className="text-sm text-gray-600">View timeline</p>
            </div>
          </Link>
          
          <Link 
            href={`/projects/${projectId}/delays`}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
          >
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Delays</h4>
              <p className="text-sm text-gray-600">Monitor issues</p>
            </div>
          </Link>
          
          <Link 
            href={`/projects/${projectId}/evidence`}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
          >
            <FileText className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Evidence</h4>
              <p className="text-sm text-gray-600">Review docs</p>
            </div>
          </Link>
          
          <Link 
            href={`/projects/${projectId}/claims`}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <Gavel className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Claims</h4>
              <p className="text-sm text-gray-600">Manage EOTs</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboardPage;