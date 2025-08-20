import React from 'react';
import { cn, Badge } from '@eot/ui';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  subtitle?: string | null;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  className = '',
  subtitle = null,
  badge
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={cn(
      "bg-white rounded-lg shadow p-6 border border-gray-200",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {badge && (
              <Badge variant={badge.variant || 'secondary'} className="text-xs py-0 px-2">
                {badge.text}
              </Badge>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {change && (
            <p className={cn("text-sm mt-1", getChangeColor())}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;

