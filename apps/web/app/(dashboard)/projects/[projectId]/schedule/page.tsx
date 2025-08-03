'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@eot/ui';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Calendar, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

const SchedulePage = () => {
  const params = useParams();
  const projectId = params?.projectId as string;
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'critical-path', name: 'Critical Path', icon: Activity },
    { id: 'import', name: 'Import/Export', icon: Upload }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/projects/${projectId}/dashboard`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Schedule</h1>
            <p className="mt-2 text-gray-600">Monitor and analyze project timeline</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Import Schedule
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Schedule Overview</h3>
              <p className="mt-1 text-sm text-gray-500">
                Schedule overview and timeline visualization will be displayed here.
              </p>
            </div>
          )}
          
          {activeTab === 'critical-path' && (
            <div className="text-center py-12">
              <Activity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Critical Path Analysis</h3>
              <p className="mt-1 text-sm text-gray-500">
                Critical path analysis and dependencies will be shown here.
              </p>
            </div>
          )}
          
          {activeTab === 'import' && (
            <div className="text-center py-12">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Import/Export Schedule</h3>
              <p className="mt-1 text-sm text-gray-500">
                Import and export schedule data in various formats.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;