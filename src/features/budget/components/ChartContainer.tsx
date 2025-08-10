import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaChartBar, FaChartPie } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatCurrency';

interface ChartData {
  name: string;
  value: number;
  color?: string;
  estimated?: number;
}

interface ChartContainerProps {
  data: ChartData[];
  chartType: 'bar' | 'pie';
  onChartTypeChange: (type: 'bar' | 'pie') => void;
  title: string;
  height?: number;
  className?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  data,
  chartType,
  onChartTypeChange,
  title,
  height,
  className = ''
}) => {
  // Responsive height based on screen size and provided height
  const getChartHeight = () => {
    if (height) return height;
    // Default heights: 250px on mobile, 400px on desktop
    return window.innerWidth < 768 ? 250 : 400;
  };

  const chartHeight = getChartHeight();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
          <p className="font-medium text-slate-900 dark:text-slate-100 mb-2">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {entry.name}: {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, fill: 'currentColor' }}
          className="text-slate-600 dark:text-slate-400"
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: 'currentColor' }}
          className="text-slate-600 dark:text-slate-400"
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          dataKey="value" 
          name="Actual Spending"
          radius={[4, 4, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
          ))}
        </Bar>
        {/* Show estimated amounts if available */}
        {data.some(item => item.estimated) && (
          <Bar 
            dataKey="estimated" 
            name="Estimated Budget"
            fill="rgba(148, 163, 184, 0.3)"
            radius={[4, 4, 0, 0]}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => 
            percent > 5 ? `${name} ${(percent).toFixed(0)}%` : ''
          }
          outerRadius={Math.min(chartHeight * 0.35, 120)}
          fill="#8884d8"
          dataKey="value"
          className="outline-none"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || `hsl(${index * 45}, 70%, 60%)`}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom"
          height={36}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 sm:mb-0">
          {title}
        </h3>
        
        {/* Chart Type Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 gap-1">
          <button
            onClick={() => onChartTypeChange('bar')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
              chartType === 'bar'
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            aria-label="Switch to bar chart"
          >
            <FaChartBar className="w-4 h-4" />
            <span className="hidden sm:inline">Bar</span>
          </button>
          <button
            onClick={() => onChartTypeChange('pie')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
              chartType === 'pie'
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            aria-label="Switch to pie chart"
          >
            <FaChartPie className="w-4 h-4" />
            <span className="hidden sm:inline">Pie</span>
          </button>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-4">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <FaChartBar className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              No data to display
            </h4>
            <p className="text-slate-500 dark:text-slate-400">
              Add some expenses to see your spending visualization.
            </p>
          </div>
        ) : (
          <div className="w-full">
            {chartType === 'bar' ? renderBarChart() : renderPieChart()}
          </div>
        )}
      </div>

      {/* Chart Legend/Summary for Mobile */}
      {data.length > 0 && (
        <div className="md:hidden p-4 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
            Summary
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {data.slice(0, 6).map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color || `hsl(${index * 45}, 70%, 60%)` }}
                />
                <span className="text-slate-600 dark:text-slate-400 truncate">
                  {item.name}: {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartContainer;