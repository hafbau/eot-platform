import React from 'react';
import { Clock, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface Deadline {
  id: string;
  projectName: string;
  claimReference: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  daysRemaining: number;
}

interface UpcomingDeadlinesProps {
  deadlines?: Deadline[];
}

const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ deadlines = [] }) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getDaysRemainingColor = (days: number) => {
    if (days <= 3) return 'text-red-600 bg-red-100';
    if (days <= 7) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
        <p className="text-sm text-gray-600">Critical dates requiring attention</p>
      </div>
      
      {deadlines.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming deadlines</h3>
          <p className="mt-1 text-sm text-gray-500">
            All deadlines are up to date.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {deadlines.map((deadline) => (
            <div
              key={deadline.id}
              className={`border-l-4 p-4 rounded-r-lg ${getPriorityColor(deadline.priority)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getPriorityIcon(deadline.priority)}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {deadline.projectName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {deadline.claimReference} - {deadline.type}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDaysRemainingColor(deadline.daysRemaining)}`}>
                    {deadline.daysRemaining === 0 
                      ? 'Due Today' 
                      : deadline.daysRemaining === 1 
                        ? '1 day left' 
                        : `${deadline.daysRemaining} days left`
                    }
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(deadline.dueDate)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {deadlines.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {deadlines.filter(d => d.daysRemaining <= 7).length} due this week
            </span>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View all deadlines →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingDeadlines;

