import React, { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { ItemStatus } from '@/types';
import type { Owner } from '@/types';

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

interface BoxPackingProgressChartProps {
  data: ProgressData;
  owners?: Owner[];
}

export const BoxPackingProgressChart: React.FC<BoxPackingProgressChartProps> = ({
  data,
  owners = []
}) => {
  const [viewMode, setViewMode] = useState<'overall' | 'individual'>('overall');

  // Transform data for area chart with owner breakdown
  const chartData = useMemo(() => {
    if (!owners?.length) {
      // Fallback to single data source if no owners
      const phases = [
        { phase: 'Prepared', value: data.prepared, color: '#64748b' },
        { phase: 'Packed', value: data.packed, color: '#3b82f6' },
        { phase: 'Loaded', value: data.loaded, color: '#f59e0b' },
        { phase: 'Delivered', value: data.delivered, color: '#10b981' },
        { phase: 'Unloaded', value: data.unloaded, color: '#8b5cf6' },
        { phase: 'Unpacked', value: data.unpacked, color: '#22c55e' }
      ];
      return phases;
    }

    // Create data structure with each owner as a separate data source
    const phases = ['Prepared', 'Packed', 'Loaded', 'Delivered', 'Unloaded', 'Unpacked'];
    
    return phases.map(phase => {
      const phaseData: any = { phase };
      
      // Add each owner's count for this phase
      owners.forEach(owner => {
        const ownerKey = `${owner.firstName}_${owner.lastName}`.replace(/\s+/g, '_');
        // In a real implementation, we would filter boxes by owner and phase
        // For now, distribute the total proportionally based on owner count
        const ownerPortion = Math.floor((data[phase.toLowerCase() as keyof typeof data] as number || 0) / owners.length);
        phaseData[ownerKey] = ownerPortion;
        phaseData[`${ownerKey}_color`] = owner.color;
      });
      
      return phaseData;
    });
  }, [data, owners]);

  // Calculate individual owner progress (mock data for now)
  const individualData = useMemo(() => {
    if (!owners.length || viewMode === 'overall') return [];

    return owners.slice(0, 6).map((owner, index) => {
      // Mock individual progress data - in real implementation, 
      // this would come from box assignments by owner
      const mockProgress = Math.floor(Math.random() * 100);
      return {
        name: `${owner.firstName} ${owner.lastName}`,
        progress: mockProgress,
        packed: Math.floor(mockProgress * 0.8),
        unpacked: Math.floor(mockProgress * 0.2),
        color: owner.color
      };
    });
  }, [owners, viewMode]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value} boxes`}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Toggle Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('overall')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'overall'
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Overall Progress
          </button>
          <button
            onClick={() => setViewMode('individual')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'individual'
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Individual Breakdown
          </button>
        </div>

        {/* Progress Summary */}
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {data.overallProgress}%
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Overall Complete</p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'overall' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                {/* Create gradients for each owner */}
                {owners?.map((owner, index) => {
                  const ownerKey = `${owner.firstName}_${owner.lastName}`.replace(/\s+/g, '_');
                  return (
                    <linearGradient key={ownerKey} id={`gradient_${ownerKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={owner.color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={owner.color} stopOpacity={0.2}/>
                    </linearGradient>
                  );
                })}
                {/* Fallback gradient */}
                <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="phase" 
                className="text-xs fill-slate-600 dark:fill-slate-400"
              />
              <YAxis className="text-xs fill-slate-600 dark:fill-slate-400" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {owners?.length ? (
                // Render stacked areas for each owner
                owners.map((owner, index) => {
                  const ownerKey = `${owner.firstName}_${owner.lastName}`.replace(/\s+/g, '_');
                  return (
                    <Area
                      key={ownerKey}
                      type="monotone"
                      dataKey={ownerKey}
                      stackId="1"
                      stroke={owner.color}
                      fill={`url(#gradient_${ownerKey})`}
                      name={`${owner.firstName} ${owner.lastName}`}
                    />
                  );
                })
              ) : (
                // Fallback single area
                <Area
                  type="monotone"
                  dataKey="value"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="url(#progressGradient)"
                  name="Boxes"
                />
              )}
            </AreaChart>
          ) : (
            <BarChart data={individualData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                className="text-xs fill-slate-600 dark:fill-slate-400"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis className="text-xs fill-slate-600 dark:fill-slate-400" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="packed" stackId="a" fill="#3b82f6" name="Packed" />
              <Bar dataKey="unpacked" stackId="a" fill="#22c55e" name="Unpacked" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Owner Legend */}
      {owners?.length > 0 && (
        <div className="mt-6">
          <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Owner Progress Breakdown
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {owners.map((owner) => {
              const ownerKey = `${owner.firstName}_${owner.lastName}`.replace(/\s+/g, '_');
              // Calculate total boxes for this owner across all phases
              const totalOwnerBoxes = chartData.reduce((sum, phase) => sum + (phase[ownerKey] || 0), 0);
              
              return (
                <div key={owner.uid} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: owner.color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {owner.firstName} {owner.lastName}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {totalOwnerBoxes} boxes
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};