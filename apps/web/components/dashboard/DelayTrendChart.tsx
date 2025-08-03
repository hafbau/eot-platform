import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatNumber } from '../../lib/utils';

interface DelayTrendData {
  month: string;
  delays: number;
  claims: number;
}

interface DelayTrendChartProps {
  data?: DelayTrendData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const DelayTrendChart: React.FC<DelayTrendChartProps> = ({ data = [] }) => {
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Delay Trends</h3>
        <p className="text-sm text-gray-600">Monthly delay detection and claim conversion</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="delays" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              name="Delays Detected"
            />
            <Line 
              type="monotone" 
              dataKey="claims" 
              stroke="#22c55e" 
              strokeWidth={2}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              name="Claims Submitted"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Trend Analysis */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-bold text-red-600">
            {data.length > 0 ? formatNumber(data[data.length - 1]?.delays || 0) : '0'}
          </p>
          <p className="text-sm text-gray-600">This Month</p>
        </div>
        <div>
          <p className="text-lg font-bold text-green-600">
            {data.length > 0 ? formatNumber(data[data.length - 1]?.claims || 0) : '0'}
          </p>
          <p className="text-sm text-gray-600">Claims Filed</p>
        </div>
        <div>
          <p className="text-lg font-bold text-blue-600">
            {data.length > 0 && data[data.length - 1]?.delays > 0 
              ? Math.round((data[data.length - 1]?.claims / data[data.length - 1]?.delays) * 100) 
              : 0}%
          </p>
          <p className="text-sm text-gray-600">Conversion Rate</p>
        </div>
      </div>
    </div>
  );
};

export default DelayTrendChart;

