import React, { useState } from 'react';
import { MOVING_STATUS_LABELS } from '@/utils/statusUtils';
import { ItemStatus } from '@/types';

interface ProgressData {
  total: number;
  prepared: number;
  packed: number;
  loaded: number;
  delivered: number;
  unloaded: number;
  unpacked: number;
  overallProgress: number;
}

interface ProgressBarComponentProps {
  data: ProgressData;
}

export const ProgressBarComponent: React.FC<ProgressBarComponentProps> = ({ data }) => {
  const [showIndividual, setShowIndividual] = useState(false);

  // Status configurations with colors
  const statusConfig = [
    { 
      key: 'prepared' as keyof ProgressData, 
      label: MOVING_STATUS_LABELS[ItemStatus.PREPARED],
      color: 'bg-slate-500',
      lightColor: 'bg-slate-200'
    },
    { 
      key: 'packed' as keyof ProgressData, 
      label: MOVING_STATUS_LABELS[ItemStatus.PACKED],
      color: 'bg-blue-500',
      lightColor: 'bg-blue-200'
    },
    { 
      key: 'loaded' as keyof ProgressData, 
      label: MOVING_STATUS_LABELS[ItemStatus.LOADED],
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-200'
    },
    { 
      key: 'delivered' as keyof ProgressData, 
      label: MOVING_STATUS_LABELS[ItemStatus.DELIVERED],
      color: 'bg-orange-500',
      lightColor: 'bg-orange-200'
    },
    { 
      key: 'unloaded' as keyof ProgressData, 
      label: MOVING_STATUS_LABELS[ItemStatus.UNLOADED],
      color: 'bg-purple-500',
      lightColor: 'bg-purple-200'
    },
    { 
      key: 'unpacked' as keyof ProgressData, 
      label: MOVING_STATUS_LABELS[ItemStatus.UNPACKED],
      color: 'bg-green-500',
      lightColor: 'bg-green-200'
    }
  ];

  // Calculate percentages
  const getPercentage = (value: number) => {
    return data.total > 0 ? (value / data.total) * 100 : 0;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Box Status Breakdown
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {data.total} total boxes across all statuses
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowIndividual(false)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              !showIndividual
                ? 'bg-brand-tertiary text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            Overall
          </button>
          <button
            onClick={() => setShowIndividual(true)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              showIndividual
                ? 'bg-brand-tertiary text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            Individual
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Moving Progress
          </span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {data.overallProgress}%
          </span>
        </div>
        
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
          {statusConfig.map((status, index) => {
            const percentage = getPercentage(data[status.key] as number);
            const cumulativePercentage = statusConfig
              .slice(0, index + 1)
              .reduce((sum, s) => sum + getPercentage(data[s.key] as number), 0);
            
            return percentage > 0 ? (
              <div
                key={status.key}
                className={`h-full ${status.color} transition-all duration-500 ease-out`}
                style={{
                  width: `${percentage}%`,
                  marginLeft: index === 0 ? '0%' : `${cumulativePercentage - percentage}%`
                }}
                title={`${status.label}: ${data[status.key]} boxes (${percentage.toFixed(1)}%)`}
              />
            ) : null;
          })}
        </div>
      </div>

      {/* Status Grid */}
      <div className={`grid gap-4 ${showIndividual ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'}`}>
        {statusConfig.map((status) => {
          const count = data[status.key] as number;
          const percentage = getPercentage(count);
          
          return (
            <div key={status.key} className={`p-4 rounded-lg ${status.lightColor} dark:bg-slate-700 transition-all hover:scale-105`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`w-4 h-4 rounded-full ${status.color}`} />
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {count}
                </span>
              </div>
              
              <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm mb-1">
                {status.label}
              </h4>
              
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {percentage.toFixed(1)}% of total
              </p>

              {showIndividual && (
                <div className="mt-3">
                  <div className="w-full bg-slate-300 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className={`h-2 ${status.color} rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-brand-tertiary">{data.total}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Boxes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-500">{data.packed}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Packed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-500">{data.loaded}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">In Transit</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-500">{data.unpacked}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
};