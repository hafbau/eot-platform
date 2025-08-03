import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber } from '../../lib/utils';

interface ClaimsFunnelData {
  stage: string;
  count: number;
  value: number;
}

interface ClaimsFunnelChartProps {
  data?: ClaimsFunnelData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ClaimsFunnelData;
  }>;
  label?: string;
}

const ClaimsFunnelChart: React.FC<ClaimsFunnelChartProps> = ({ data = [] }) => {
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            Count: {formatNumber(data.count)}
          </p>
          <p className="text-sm text-green-600">
            Value: {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Claims Pipeline</h3>
        <p className="text-sm text-gray-600">Track claims through the process</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="stage" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
              name="Claims Count"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(data.reduce((sum, item) => sum + item.count, 0))}
          </p>
          <p className="text-sm text-gray-600">Total Claims</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(data.reduce((sum, item) => sum + item.value, 0))}
          </p>
          <p className="text-sm text-gray-600">Total Value</p>
        </div>
      </div>
    </div>
  );
};

export default ClaimsFunnelChart;

