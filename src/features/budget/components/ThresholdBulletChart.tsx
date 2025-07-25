import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

interface ThresholdBulletChartProps {
  data: Array<{
    name: string;
    spent: number;
    budget: number;
  }>;
}

const ThresholdBulletChart: React.FC<ThresholdBulletChartProps> = ({ data }) => {
  const filteredData = data.filter(item => item.budget > 0);
  
  const sortedData = [...filteredData].sort((a, b) => 
    (b.spent / b.budget) - (a.spent / a.budget)
  );

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
      const percentage = Math.round((data.spent / data.budget) * 100);
      
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">
            <span className="text-slate-500 dark:text-slate-400">Spent:</span>{' '}
            {formatCurrency(data.spent)} of {formatCurrency(data.budget)}
          </p>
          <p className="text-sm">
            <span className="text-slate-500 dark:text-slate-400">Remaining:</span>{' '}
            {formatCurrency(Math.max(0, data.budget - data.spent))}
          </p>
          <p className="text-sm">
            <span className="text-slate-500 dark:text-slate-400">Progress:</span>{' '}
            <span className={percentage > 100 ? 'text-red-500' : 'text-green-500'}>
              {percentage}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const maxValue = Math.max(
    ...filteredData.map(item => Math.max(item.spent, item.budget)),
    1000
  );

  const domain = [0, Math.ceil(maxValue * 1.1)];

  const legendItems = [
    { color: '#ffffff', label: 'Estimated' },
    { color: '#22c55e', label: '< 50%' },
    { color: '#facc15', label: '50-79%' },
    { color: '#f97316', label: '80-99%' },
    { color: '#ef4444', label: '>= 100%' },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={sortedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barCategoryGap={15}
            barGap={2}
          >
            <CartesianGrid horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              domain={domain}
              tickFormatter={(value) => `$${value}`}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Bar 
              dataKey="budget" 
              name="Budget"
              barSize={20}
              fill="#ffffff"
              radius={[0, 4, 4, 0]}
              isAnimationActive={false}
            />
            
            <Bar 
              dataKey="spent" 
              name="Spent"
              barSize={12}
              radius={[0, 4, 4, 0]}
            >
              {sortedData.map((entry, index) => {
                const percentage = entry.budget > 0 ? (entry.spent / entry.budget) * 100 : 0;
                let fillColor;
                if (percentage >= 100) {
                  fillColor = '#ef4444'; // red
                } else if (percentage >= 80) {
                  fillColor = '#f97316'; // orange
                } else if (percentage >= 50) {
                  fillColor = '#facc15'; // yellow
                } else {
                  fillColor = '#22c55e'; // green
                }
                
                return (
                  <Cell 
                    key={`spent-cell-${index}`} 
                    fill={fillColor}
                  />
                );
              })}
            </Bar>
            
            {sortedData.map((entry, index) => (
              <ReferenceLine
                key={`ref-${index}`}
                y={index}
                x={entry.budget}
                stroke="#94a3b8"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center items-center space-x-4 mt-4 text-xs text-slate-600 dark:text-slate-400">
        {legendItems.map(item => (
          <div key={item.label} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-sm border border-slate-300" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThresholdBulletChart;
