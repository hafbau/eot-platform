'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@eot/ui';
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
  Trash2
} from 'lucide-react';
import { getProjects } from '../../../lib/api/projects';
import { formatCurrency, formatDate, getStatusColor } from '../../../lib/utils';
import { ProjectStatus, ContractType } from '../../../lib/types';

interface Project {
  id: string;
  name: string;
  location: string;
  startDate: string;
  plannedCompletion: string;
  status: ProjectStatus;
  contractValue: number;
  healthScore: number;
  totalClaims: number;
  claimsValue: number;
  contractType: ContractType;
  projectManager: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const result = await getProjects();
        if (result.success) {
          setProjects(result.data);
          setFilteredProjects(result.data);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectManager.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter]);

  const getContractTypeDisplay = (type: ContractType) => {
    const types = {
      [ContractType.FIDIC_RED]: 'FIDIC Red',
      [ContractType.FIDIC_YELLOW]: 'FIDIC Yellow',
      [ContractType.FIDIC_SILVER]: 'FIDIC Silver',
      [ContractType.NEC3]: 'NEC3',
      [ContractType.NEC4]: 'NEC4',
      [ContractType.CUSTOM]: 'Custom'
    };
    return types[type] || type;
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 50) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
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
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="mt-2 text-gray-600">
            Manage and monitor all your construction projects
          </p>
        </div>
        <Button>
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
              <option value={ProjectStatus.ACTIVE}>Active</option>
              <option value={ProjectStatus.PLANNING}>Planning</option>
              <option value={ProjectStatus.ON_HOLD}>On Hold</option>
              <option value={ProjectStatus.COMPLETED}>Completed</option>
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
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {project.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(project.startDate)} - {formatDate(project.plannedCompletion)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Project Stats */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Contract Value</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(project.contractValue)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Health Score</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHealthScoreColor(project.healthScore)}`}>
                    {project.healthScore}/100
                  </span>
                </div>
                <div>
                  <p className="text-gray-600">Active Claims</p>
                  <p className="font-semibold text-gray-900">
                    {project.totalClaims} ({formatCurrency(project.claimsValue)})
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Contract Type</p>
                  <p className="font-semibold text-gray-900">
                    {getContractTypeDisplay(project.contractType)}
                  </p>
                </div>
              </div>
            </div>

            {/* Project Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  PM: {project.projectManager}
                </div>
                <div className="flex space-x-2">
                  <Link href={`/projects/${project.id}/dashboard`}>
                    <Button size="sm" variant="outline">
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                  </Link>
                  <Button size="sm">
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                </div>
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

      {/* Summary Stats */}
      {filteredProjects.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {filteredProjects.length}
              </p>
              <p className="text-sm text-gray-600">Total Projects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(filteredProjects.reduce((sum, p) => sum + p.contractValue, 0))}
              </p>
              <p className="text-sm text-gray-600">Total Contract Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {filteredProjects.reduce((sum, p) => sum + p.totalClaims, 0)}
              </p>
              <p className="text-sm text-gray-600">Active Claims</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(filteredProjects.reduce((sum, p) => sum + p.healthScore, 0) / filteredProjects.length)}
              </p>
              <p className="text-sm text-gray-600">Avg Health Score</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;