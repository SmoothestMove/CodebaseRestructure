// @ts-nocheck
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

interface BulletChartProps {
  data: Array<{
    name: string;
    spent: number;
    budget: number;
    color: string;
  }>;
}

const BulletChart: React.FC<BulletChartProps> = ({ data }) => {
  // Filter out categories with no budget
  const filteredData = data.filter(item => item.budget > 0);
  
  // Sort by budget percentage (spent/budget)
  const sortedData = [...filteredData].sort((a, b) => 
    (b.spent / b.budget) - (a.spent / a.budget)
  );

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip
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

  // Find the maximum value for the x-axis
  const maxValue = Math.max(
    ...filteredData.map(item => Math.max(item.spent, item.budget)),
    1000 // Minimum max value to prevent chart from being too small
  );

  // Calculate the x-axis domain with some padding
  const domain = [0, Math.ceil(maxValue * 1.1)];

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
              tickFormatter={(value) => `${value}`}
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
            
            {/* Budget bar (full width, light color) */}
            <Bar 
              dataKey="budget" 
              name="Budget"
              barSize={20}
              fill="#e2e8f0"
              radius={[0, 4, 4, 0]}
              isAnimationActive={false}
            >
              {sortedData.map((entry, index) => (
                <Cell 
                  key={`budget-cell-${index}`} 
                  fill={`${entry.color}40`} // 25% opacity
                />
              ))}
            </Bar>
            
            {/* Spent bar (on top of budget) */}
            <Bar 
              dataKey="spent" 
              name="Spent"
              barSize={12}
              radius={[0, 4, 4, 0]}
            >
              {sortedData.map((entry, index) => {
                const percentage = (entry.spent / entry.budget) * 100;
                const isOverBudget = percentage > 100;
                
                return (
                  <Cell 
                    key={`spent-cell-${index}`} 
                    fill={isOverBudget ? '#ef4444' : entry.color} // Red if over budget
                  />
                );
              })}
            </Bar>
            
            {/* Reference line for 100% of budget */}
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
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm bg-slate-300" />
          <span>Budget</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm bg-slate-500" />
          <span>Spent</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm bg-red-500" />
          <span>Over Budget</span>
        </div>
      </div>
    </div>
  );
};

export default BulletChart;

