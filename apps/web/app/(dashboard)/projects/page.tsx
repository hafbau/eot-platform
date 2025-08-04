'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Badge } from '@eot/ui';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Activity,
  Upload,
  FileText
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { mockProjects } from '../../../lib/mock-data';


const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // Use mock data for demo
  const projects = mockProjects;
  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchTerm || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 50) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };


  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects Portfolio</h1>
          <p className="mt-2 text-gray-600">
            AI-powered monitoring across {projects.length} active construction projects
          </p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowProjectModal(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
            {/* Project Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  {project.criticalPathImpact && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Critical
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    {project.status}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {project.contractType} • ${(project.contractValue / 1000000).toFixed(0)}M
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {project.plannedDuration} months
                    </span>
                    <span className="flex items-center">
                      <Activity className="h-3 w-3 mr-1" />
                      {project.totalActivities} activities
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Metrics */}
            <div className="px-6 pb-4 space-y-3">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{project.actualProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full relative"
                    style={{ width: `${project.actualProgress}%` }}
                  >
                    <div 
                      className="absolute top-0 h-2 w-0.5 bg-green-600"
                      style={{ left: `${(project.plannedProgress / project.actualProgress) * 100}%` }}
                      title={`Planned: ${project.plannedProgress.toFixed(1)}%`}
                    />
                  </div>
                </div>
                {project.actualProgress < project.plannedProgress && (
                  <p className="text-xs text-red-600 mt-1">
                    {(project.plannedProgress - project.actualProgress).toFixed(1)}% behind schedule
                  </p>
                )}
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">Health Score</p>
                      <p className="text-lg font-bold text-gray-900">{project.healthScore}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      project.healthScore >= 80 ? 'bg-green-100' : 
                      project.healthScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Activity className={`h-4 w-4 ${
                        project.healthScore >= 80 ? 'text-green-600' : 
                        project.healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-xs text-gray-600">Open Claims</p>
                    <p className="text-lg font-bold text-gray-900">
                      {project.openClaims}
                      <span className="text-xs font-normal text-gray-600 ml-1">
                        (${(project.claimsValue / 1000000).toFixed(1)}M)
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* AI Insights */}
              {project.potentialDelays > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <p className="text-xs font-medium text-purple-900">
                      AI detected {project.potentialDelays} potential delays
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Project Actions */}
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  Updated {project.lastScheduleUpdate}
                </div>
                <Link href={`/projects/${project.id}/dashboard`}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Eye className="mr-1 h-3 w-3" />
                    View Project
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first project.'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <div className="mt-6">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Project Creation Modal (Demo) */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
              <p className="text-sm text-gray-600 mt-1">Set up a new construction project with AI-powered insights</p>
            </div>
            
            {demoStep === 0 && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Dubai Marina Tower Complex"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contract Value</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="$450,000,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>FIDIC Yellow Book</option>
                      <option>FIDIC Red Book</option>
                      <option>NEC4 Option C</option>
                    </select>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm font-medium text-gray-900">Upload Contract PDF</p>
                  <p className="text-xs text-gray-500 mt-1">AI will extract clauses and notice periods</p>
                  <Button size="sm" variant="outline" className="mt-4">
                    <FileText className="mr-2 h-4 w-4" />
                    Select File
                  </Button>
                </div>
              </div>
            )}
            
            {demoStep === 1 && (
              <div className="p-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-purple-900">AI is analyzing your contract...</p>
                      <p className="text-sm text-purple-700 mt-1">Extracting clauses, notice periods, and key terms</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Detected FIDIC Yellow Book 2017 Edition</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Found 47 relevant contract clauses</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Identified 28-day notice period for claims</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="animate-spin">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-600">Setting up automated monitoring...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowProjectModal(false);
                  setDemoStep(0);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  if (demoStep === 0) {
                    setDemoStep(1);
                    setTimeout(() => {
                      setShowProjectModal(false);
                      setDemoStep(0);
                    }, 3000);
                  }
                }}
              >
                {demoStep === 0 ? 'Create Project' : 'Processing...'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;