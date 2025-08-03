import React, { useState } from 'react';
import { CheckCircle, Circle, User, Calendar, AlertTriangle } from 'lucide-react';
import { formatDate, isOverdue } from '../../lib/utils';

interface ActionItem {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  assignee?: string;
  dueDate?: string;
}

interface ActionItemsProps {
  items?: ActionItem[];
  onUpdateItem?: (itemId: string, updates: Partial<ActionItem>) => void;
}

const ActionItems: React.FC<ActionItemsProps> = ({ items = [], onUpdateItem }) => {
  const [filter, setFilter] = useState('all');

  const filteredItems = items.filter(item => {
    switch (filter) {
      case 'pending':
        return item.status === 'pending';
      case 'in_progress':
        return item.status === 'in_progress';
      case 'overdue':
        return isOverdue(item.dueDate);
      default:
        return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Circle className="h-4 w-4 text-blue-500 fill-current" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleToggleComplete = (item: ActionItem) => {
    const newStatus = item.status === 'completed' ? 'pending' : 'completed';
    if (onUpdateItem) {
      onUpdateItem(item.id, { status: newStatus });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Action Items</h3>
            <p className="text-sm text-gray-600">Tasks requiring your attention</p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'in_progress', label: 'In Progress' },
              { key: 'overdue', label: 'Overdue' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  filter === filterOption.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {filter === 'all' ? 'No action items' : `No ${filter.replace('_', ' ')} items`}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? 'All tasks are up to date.' 
              : 'Try selecting a different filter.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-lg transition-colors ${
                item.status === 'completed' 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => handleToggleComplete(item)}
                  className="mt-0.5 flex-shrink-0"
                >
                  {getStatusIcon(item.status)}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${
                      item.status === 'completed' 
                        ? 'text-gray-500 line-through' 
                        : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h4>
                    
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className={`h-3 w-3 ${getPriorityColor(item.priority)}`} />
                      {isOverdue(item.dueDate) && item.status !== 'completed' && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className={`text-sm mt-1 ${
                    item.status === 'completed' 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                  }`}>
                    {item.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{item.assignee}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Due {formatDate(item.dueDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {filteredItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {filteredItems.filter(item => item.status !== 'completed').length} pending tasks
            </span>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View all tasks →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionItems;

