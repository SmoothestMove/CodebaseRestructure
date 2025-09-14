import React, { useState, useMemo } from 'react';
import { MOVING_STATUS_LABELS } from '@/utils/statusUtils';
import { ItemStatus } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useLongPress } from '@/hooks/useLongPress';

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

interface IndividualProgressData extends ProgressData {
  name: string;
  type: string;
}

interface ProgressBarComponentProps {
  data: ProgressData;
  individualData: Record<string, IndividualProgressData>;
}

const StatusBreakdownTooltip: React.FC<{ status: any; individualData: Record<string, IndividualProgressData> }> = ({ status, individualData }) => {
  const relevantIndividuals = useMemo(() => {
    return Object.values(individualData)
      .filter(individual => (individual[status.key] as number) > 0)
      .sort((a, b) => b[status.key] - a[status.key]);
  }, [status, individualData]);

  if (relevantIndividuals.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute z-10 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 mt-2 top-full left-1/2 -translate-x-1/2"
    >
      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{status.label} Breakdown</h4>
      <div className="space-y-2">
        {relevantIndividuals.map(individual => (
          <div key={individual.name} className="flex justify-between items-center text-sm">
            <span className="text-slate-600 dark:text-slate-400">{individual.name}</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{individual[status.key]}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const ProgressBarComponent: React.FC<ProgressBarComponentProps> = ({ data, individualData }) => {
  const [activeStatus, setActiveStatus] = useState<any | null>(null);

  const statusConfig = [
    { key: 'prepared', label: MOVING_STATUS_LABELS[ItemStatus.PREPARED], color: 'bg-slate-500', lightColor: 'bg-slate-200' },
    { key: 'packed', label: MOVING_STATUS_LABELS[ItemStatus.PACKED], color: 'bg-blue-500', lightColor: 'bg-blue-200' },
    { key: 'loaded', label: MOVING_STATUS_LABELS[ItemStatus.LOADED], color: 'bg-yellow-500', lightColor: 'bg-yellow-200' },
    { key: 'delivered', label: MOVING_STATUS_LABELS[ItemStatus.DELIVERED], color: 'bg-orange-500', lightColor: 'bg-orange-200' },
    { key: 'unloaded', label: MOVING_STATUS_LABELS[ItemStatus.UNLOADED], color: 'bg-purple-500', lightColor: 'bg-purple-200' },
    { key: 'unpacked', label: MOVING_STATUS_LABELS[ItemStatus.UNPACKED], color: 'bg-green-500', lightColor: 'bg-green-200' },
  ];

  const getPercentage = (value: number, total: number) => (total > 0 ? (value / total) * 100 : 0);

  const longPressHandlers = (status: any) => useLongPress(() => setActiveStatus(activeStatus === status ? null : status));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Box Status Breakdown</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{data.total} total boxes</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Moving Progress</span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{data.overallProgress}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden flex">
          {statusConfig.map(status => {
            const percentage = getPercentage(data[status.key as keyof ProgressData] as number, data.total);
            return percentage > 0 ? (
              <div
                key={status.key}
                className={`h-full ${status.color} transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
                title={`${status.label}: ${data[status.key as keyof ProgressData]} boxes (${percentage.toFixed(1)}%)`}
              />
            ) : null;
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statusConfig.map(status => {
          const count = data[status.key as keyof ProgressData] as number;
          const percentage = getPercentage(count, data.total);
          const handlers = longPressHandlers(status);

          return (
            <div
              key={status.key}
              className="relative"
              onMouseEnter={() => setActiveStatus(status)}
              onMouseLeave={() => setActiveStatus(null)}
              onFocus={() => setActiveStatus(status)}
              onBlur={() => setActiveStatus(null)}
              {...handlers}
            >
              <div className={`p-4 rounded-lg ${status.lightColor} dark:bg-slate-700 transition-all hover:scale-105 cursor-pointer`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-4 h-4 rounded-full ${status.color}`} />
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{count}</span>
                </div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm mb-1">{status.label}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">{percentage.toFixed(1)}% of total</p>
              </div>
              <AnimatePresence>
                {activeStatus === status && <StatusBreakdownTooltip status={status} individualData={individualData} />}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

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