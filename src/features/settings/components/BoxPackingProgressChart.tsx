import React, { useMemo, useState, ReactNode } from 'react';
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
  Bar,
} from 'recharts';
import { ItemStatus, Box } from '@/types';
import { PersonalOwner, CommunalSpace, isPersonalOwner } from '@/types/owners-spaces';

interface OwnerBoxCounts {
  total: number;
  [ItemStatus.PREPARED]: number;
  [ItemStatus.PACKED]: number;
  [ItemStatus.LOADED]: number;
  [ItemStatus.DELIVERED]: number;
  [ItemStatus.UNLOADED]: number;
  [ItemStatus.UNPACKED]: number;
  [ItemStatus.UNKNOWN]?: number;
  ownerId: string;
  name: string;
  color: string;
}

// Progress data is calculated in the useMemo hook and not used as a type

interface BoxPackingProgressChartProps {
  boxes: Box[];
  owners: (PersonalOwner | CommunalSpace)[];
}

export const BoxPackingProgressChart: React.FC<BoxPackingProgressChartProps> = ({
  boxes = [],
  owners = []
}) => {
  // Helper function to get display name for an owner or space
  const getOwnerDisplayName = (entity: PersonalOwner | CommunalSpace): string => {
    if (isPersonalOwner(entity)) {
      return `${entity.firstName} ${entity.lastName}`.trim();
    }
    return entity.name || 'Unnamed Space';
  };

  const [viewMode, setViewMode] = useState<'overall' | 'individual'>('overall');
  
  // Calculate progress data based on boxes and owners
  const progressData = useMemo(() => {
    if (!owners || owners.length === 0) {
      return {
        total: 0,
        prepared: 0,
        packed: 0,
        loaded: 0,
        delivered: 0,
        unloaded: 0,
        unpacked: 0,
        overallProgress: 0,
        ownerBoxCounts: {},
      };
    }
    const statusCounts = boxes.reduce((acc, box) => {
      acc[box.currentStatus] = (acc[box.currentStatus] || 0) + 1;
      return acc;
    }, {} as Record<ItemStatus, number>);

    const ownerBoxCounts = owners.reduce<Record<string, OwnerBoxCounts>>((acc, owner) => {
      acc[owner.uid] = {
        total: 0,
        [ItemStatus.PREPARED]: 0,
        [ItemStatus.PACKED]: 0,
        [ItemStatus.LOADED]: 0,
        [ItemStatus.DELIVERED]: 0,
        [ItemStatus.UNLOADED]: 0,
        [ItemStatus.UNPACKED]: 0,
        [ItemStatus.UNKNOWN]: 0,
        ownerId: owner.uid,
        name: getOwnerDisplayName(owner),
        color: owner.color
      };
      return acc;
    }, {});

    (boxes || []).forEach(box => {
      if (box.ownerUid && ownerBoxCounts[box.ownerUid]) {
        ownerBoxCounts[box.ownerUid].total++;
        ownerBoxCounts[box.ownerUid][box.currentStatus]++;
      }
    });

    const totalBoxes = boxes.length;
    const unpackedBoxes = statusCounts[ItemStatus.UNPACKED] || 0;

    return {
      total: totalBoxes,
      prepared: statusCounts[ItemStatus.PREPARED] || 0,
      packed: statusCounts[ItemStatus.PACKED] || 0,
      loaded: statusCounts[ItemStatus.LOADED] || 0,
      delivered: statusCounts[ItemStatus.DELIVERED] || 0,
      unloaded: statusCounts[ItemStatus.UNLOADED] || 0,
      unpacked: unpackedBoxes,
      overallProgress: totalBoxes > 0 ? Math.round((unpackedBoxes / totalBoxes) * 100) : 0,
      ownerBoxCounts,
    };
  }, [boxes, owners]);

  const chartData = useMemo(() => {
    const phases: { name: string, key: ItemStatus }[] = [
      { name: 'Prepared', key: ItemStatus.PREPARED },
      { name: 'Packed', key: ItemStatus.PACKED },
      { name: 'Loaded', key: ItemStatus.LOADED },
      { name: 'Delivered', key: ItemStatus.DELIVERED },
      { name: 'Unloaded', key: ItemStatus.UNLOADED },
      { name: 'Unpacked', key: ItemStatus.UNPACKED },
    ];

    return phases.map(phase => {
      const phaseData: Record<string, string | number> = { phase: phase.name };
      (owners || []).forEach(owner => {
        const ownerName = getOwnerDisplayName(owner);
        const count = progressData.ownerBoxCounts[owner.uid]?.[phase.key] ?? 0;
        phaseData[ownerName] = typeof count === 'number' ? count : 0;
      });
      return phaseData;
    });
  }, [progressData, owners]);

  const ownerBoxCounts = useMemo(() => {
    // The ownerBoxCounts already contains all necessary data
    return Object.values(progressData.ownerBoxCounts);
  }, [progressData, owners]);

  const individualData = useMemo(() => {
    if (!owners.length || viewMode === 'overall') return [];

    return ownerBoxCounts.map(counts => {
        const total = counts.total || 0;
        const packed = counts[ItemStatus.PACKED] || 0;
        const unpacked = counts[ItemStatus.UNPACKED] || 0;
        const owner = owners.find(o => o.uid === counts.ownerId);
        
        return {
          name: counts.name,
          progress: total > 0 ? Math.round(((packed + unpacked) / total) * 100) : 0,
          packed,
          unpacked,
          color: owner?.color || '#000000',
        };
      });
  }, [owners, viewMode, ownerBoxCounts]);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string; payload: Record<string, unknown> }>;
    label?: string;
  }): ReactNode => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{label}</p>
        <div className="mt-2 space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-600 dark:text-slate-300">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
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
            {progressData.overallProgress}%
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
                {owners?.map((owner) => {
                  const ownerName = getOwnerDisplayName(owner);
                  const ownerKey = ownerName.replace(/\s+/g, '_');
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
                ownerBoxCounts.map((ownerCounts) => {
                  const owner = owners.find(o => o.uid === ownerCounts.ownerId);
                  if (!owner) return null;
                  const ownerName = getOwnerDisplayName(owner);
                  const ownerKey = ownerName.replace(/\s+/g, '_');
                  return (
                    <Area
                      key={ownerKey}
                      type="monotone"
                      dataKey={ownerKey}
                      stackId="1"
                      stroke={owner.color}
                      fill={`url(#gradient_${ownerKey})`}
                      name={ownerName}
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
              {ownerBoxCounts.map((owner) => {
                const ownerName = owner.name;
                // Calculate total boxes for this owner across all phases
                const totalOwnerBoxes = chartData.reduce((sum, phase) => {
                  const phaseValue = phase[ownerName];
                  return sum + (typeof phaseValue === 'number' ? phaseValue : 0);
                }, 0);
                
                return (
                  <div key={owner.ownerId} className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: owner.color }}
                    />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {ownerName}
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