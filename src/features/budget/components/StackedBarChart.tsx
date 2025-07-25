import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface StackedBarChartProps {
  data: Array<{
    name: string;
    spent: number;
    budget: number;
    remaining: number;
    color: string;
  }>;
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold">{label}</p>
          <p style={{ color: data.color }}>Spent: {formatCurrency(data.spent)}</p>
          <p style={{ color: '#e2e8f0' }}>Remaining: {formatCurrency(data.remaining)}</p>
          <p>Budget: {formatCurrency(data.budget)}</p>
        </div>
      );
    }
    return null;
  };

  return (
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
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="spent" stackId="a" name="Spent">
          {data.map((entry, index) => (
            <Cell key={`cell-spent-${index}`} fill={entry.color} />
          ))}
        </Bar>
        <Bar dataKey="remaining" stackId="a" name="Remaining">
          {data.map((entry, index) => (
            <Cell key={`cell-remaining-${index}`} fill={`${entry.color}40`} /> // 25% opacity
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarChart;
