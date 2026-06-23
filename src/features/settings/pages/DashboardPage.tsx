// @ts-nocheck
import React, { useMemo, useState } from 'react';
import { useMove } from '@/features/settings/hooks/MoveContext';
import { useBoxes } from '@/features/boxes/hooks/useBoxes';
import { useOwnersSpacesSeparation } from '@/features/owners/hooks/useOwnersSpacesSeparation';
import { ItemStatus, legacyOwnerToModern } from '@/types';
import { BoxPackingProgressChart } from '../components/BoxPackingProgressChart';
import { ProgressBarComponent } from '../components/ProgressBarComponent';
import { DynamicBentoGrid } from '../components/DynamicBentoGrid';
import { TruckLayoutVisualization } from '../components/TruckLayoutVisualization';
import { BudgetOverviewWidget } from '../components/BudgetOverviewWidget';
import { ParticipantsSkeleton } from '@/components/design-system';
import { generateEnhancedRandomizedMoveData, type EnhancedRandomizedData } from '@/lib/utils/randomization-enhanced';
import { SeparationTestWidget } from '@/features/owners/components/SeparationTestWidget';

interface ParticipantPresence {
  online?: boolean;
  displayName?: string;
  photoURL?: string;
}

const DashboardPage: React.FC = () => {
  const { boxes, isLoading } = useBoxes();
  const { owners, personalOwners, communalSpaces, stats } = useOwnersSpacesSeparation();
  const { move, presence, loading: moveLoading, error: moveError } = useMove();
  
  // Enhanced randomization state for dev mode
  const [randomizedData, setRandomizedData] = useState<EnhancedRandomizedData | null>(null);
  const [isRandomized, setIsRandomized] = useState(false);

  // Enhanced randomization handler for dev mode
  const handleRandomize = () => {
    if (import.meta.env.DEV) {
      const newRandomizedData = generateEnhancedRandomizedMoveData();
      setRandomizedData(newRandomizedData);
      setIsRandomized(true);
    }
  };

  const handleResetRandomization = () => {
    setRandomizedData(null);
    setIsRandomized(false);
  };

  // Use randomized data when available, otherwise use real data
  const displayBoxes = isRandomized && randomizedData ? randomizedData.boxes : boxes;
  const displayEntities = useMemo(() => {
    if (isRandomized && randomizedData) {
      return [...randomizedData.personalOwners, ...randomizedData.communalSpaces];
    }
    return owners.map(legacyOwnerToModern);
  }, [isRandomized, randomizedData, owners]);

  const { progressData, individualProgressData } = useMemo(() => {
    if (!displayBoxes.length) return { progressData: null, individualProgressData: {} };

    const overallStatusCounts = displayBoxes.reduce((acc, box) => {
      acc[box.currentStatus] = (acc[box.currentStatus] || 0) + 1;
      return acc;
    }, {} as Record<ItemStatus, number>);

    const totalBoxes = displayBoxes.length;
    const unpackedBoxes = overallStatusCounts[ItemStatus.UNPACKED] || 0;

    const progressData = {
      total: totalBoxes,
      prepared: overallStatusCounts[ItemStatus.PREPARED] || 0,
      packed: overallStatusCounts[ItemStatus.PACKED] || 0,
      loaded: overallStatusCounts[ItemStatus.LOADED] || 0,
      delivered: overallStatusCounts[ItemStatus.DELIVERED] || 0,
      unloaded: overallStatusCounts[ItemStatus.UNLOADED] || 0,
      unpacked: unpackedBoxes,
      overallProgress: totalBoxes > 0 ? Math.round((unpackedBoxes / totalBoxes) * 100) : 0,
    };

    const individualData = displayBoxes.reduce((acc, box) => {
      const owner = displayEntities.find((e: any) => e.uid === (box as any).ownerUid);
      const space = displayEntities.find((e: any) => e.uid === (box as any).spaceUid);
      const entity = owner || space;

      if (entity) { const key = (entity as any).uid as string; if (!acc[key]) { const name = (entity as any).name ?? `${(entity as any).firstName ?? ""} ${(entity as any).lastName ?? ""}`.trim(); acc[key] = { name, type: (entity as any).isCommunal ? "Space" : "Owner", counts: {}, total: 0, }; } acc[key].counts[box.currentStatus] = (acc[key].counts[box.currentStatus] || 0) + 1; acc[key].total += 1;
      }
      return acc;
    }, {} as Record<string, { name: string; type: string; counts: Record<ItemStatus, number>; total: number }>);

    const individualProgressData = Object.entries(individualData).reduce((acc, [id, data]) => {
      const total = data.total;
      const unpacked = data.counts[ItemStatus.UNPACKED] || 0;
      acc[id] = {
        name: data.name,
        type: data.type,
        total: total,
        prepared: data.counts[ItemStatus.PREPARED] || 0,
        packed: data.counts[ItemStatus.PACKED] || 0,
        loaded: data.counts[ItemStatus.LOADED] || 0,
        delivered: data.counts[ItemStatus.DELIVERED] || 0,
        unloaded: data.counts[ItemStatus.UNLOADED] || 0,
        unpacked: unpacked,
        overallProgress: total > 0 ? Math.round((unpacked / total) * 100) : 0,
      };
      return acc;
    }, {} as Record<string, any>);

    return { progressData, individualProgressData };
  }, [displayBoxes, displayEntities]);

  // Check if any boxes are loaded for truck visualization
  const hasLoadedBoxes = useMemo(() => {
    return displayBoxes.some(box => box.currentStatus === ItemStatus.LOADED);
  }, [displayBoxes]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-surface-elevated h-8 w-64 rounded mb-4"></div>
          <div className="bg-surface-elevated h-64 rounded-xl mb-6"></div>
          <div className="bg-surface-elevated h-32 rounded-xl mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-surface-elevated h-32 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-text-main tracking-tight text-2xl md:text-3xl font-bold leading-tight">
          Hi there! 📦
        </h1>
        <p className="text-text-secondary text-sm font-medium">
          Let's get moving.
        </p>
        {move && (
          <p className="text-text-muted text-xs">Move Code: {move.moveCode}</p>
        )}
        
        {/* Dev Mode Randomization Button */}
        {import.meta.env.DEV && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleRandomize}
              className="bg-accent hover:bg-accent-hover text-background px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1 text-sm"
              title="Randomize data for testing (Dev Mode Only)"
            >
              <span className="material-symbols-outlined text-base">shuffle</span>
              Randomize
            </button>
            {isRandomized && (
              <button
                onClick={handleResetRandomization}
                className="bg-semantic-error hover:opacity-80 text-white px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm"
                title="Reset to real data"
              >
                Reset
              </button>
            )}
          </div>
        )}
        
        {/* Enhanced separation statistics */}
        {!isRandomized && stats.totalEntities > 0 && (
          <div className="mt-2 flex items-center space-x-4 text-sm text-text-secondary">
            <div className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-base">person</span>
              <span>{stats.personalOwners} Personal Owners</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-base">apartment</span>
              <span>{stats.communalSpaces} Communal Spaces</span>
            </div>
          </div>
        )}
        
        {isRandomized && (
          <div className="mt-2 space-y-1">
            <p className="text-sm bg-semantic-warning text-background px-2 py-1 rounded inline-block">
              🎲 Viewing randomized data
            </p>
            {randomizedData && (
              <div className="flex items-center space-x-4 text-xs text-text-muted">
                <div className="flex items-center space-x-1">
                  <span className="material-symbols-outlined text-sm">person</span>
                  <span>{randomizedData.personalOwners.length} Random Owners</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="material-symbols-outlined text-sm">apartment</span>
                  <span>{randomizedData.communalSpaces.length} Random Spaces</span>
                </div>
                <span>{randomizedData.boxes.length} Random Boxes</span>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Box Packing Progress Chart */}
      {progressData && (
        <section>
          <h2 className="text-lg font-bold text-text-main mb-3">
            Total Progress
          </h2>
          <div className="bg-surface rounded-xl shadow-sm border border-border p-4">
            <BoxPackingProgressChart boxes={displayBoxes} owners={displayEntities} />
          </div>
        </section>
      )}

      {/* Progress Bar */}
      {progressData && (
        <section>
          <ProgressBarComponent data={progressData} individualData={individualProgressData} />
        </section>
      )}

      {/* Separation Test Widget - Dev Mode Only */}
      {import.meta.env.DEV && (
        <section>
          <h2 className="text-lg font-bold text-text-main mb-3">
            Development: Separation Status
          </h2>
          <SeparationTestWidget />
        </section>
      )}

      {/* Dynamic Bento Grid - Spaces Overview */}
      <section>
        <h2 className="text-lg font-bold text-text-main mb-3">
          Spaces
        </h2>
        <DynamicBentoGrid boxes={displayBoxes} entities={displayEntities} />
      </section>

      {/* Truck Layout Visualization - Conditional */}
      {hasLoadedBoxes && (
        <section>
          <h2 className="text-lg font-bold text-text-main mb-3">
            Truck Load
          </h2>
          <TruckLayoutVisualization boxes={displayBoxes} entities={displayEntities} />
        </section>
      )}

      {/* Budget Overview */}
      <section>
        <h2 className="text-lg font-bold text-text-main mb-3">
          Budget Overview
        </h2>
        <BudgetOverviewWidget 
          randomizedBudgetData={isRandomized && randomizedData ? randomizedData.budget : undefined}
        />
      </section>

      {/* Move Participants */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-text-main">
            Movers Crew
          </h2>
          <button className="text-accent text-sm font-medium hover:opacity-80">Invite</button>
        </div>
        {moveLoading ? (
          <ParticipantsSkeleton count={3} />
        ) : moveError ? (
          <div className="bg-surface shadow-sm rounded-xl border border-border p-4">
            <div className="text-semantic-error">
              <p className="font-semibold">Error loading participants</p>
              <p className="text-sm">{moveError.message}</p>
            </div>
          </div>
        ) : move && move.participants ? (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {Object.keys(move.participants || {}).map((userId) => {
              const participantPresence: ParticipantPresence = 
                presence?.[`${move.id}_${userId}`] || presence?.[userId] || {};
              const isOnline = participantPresence?.online || false;
              const displayName = participantPresence?.displayName || 'Loading...';

              return (
                <div key={userId} className="flex flex-col items-center gap-2 min-w-[72px]">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-accent text-background flex items-center justify-center text-lg font-semibold shadow-sm">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className={`absolute bottom-0 right-0 block w-3.5 h-3.5 rounded-full ring-2 ring-background ${isOnline ? 'bg-semantic-success' : 'bg-text-muted'}`}></span>
                  </div>
                  <span className="text-xs font-medium text-text-main truncate max-w-[72px]">
                    {displayName.split(' ')[0]}
                  </span>
                </div>
              );
            })}
            {/* Add button */}
            <div className="flex flex-col items-center gap-2 min-w-[72px]">
              <button className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-dashed border-border bg-surface text-text-muted hover:border-accent hover:text-accent transition-colors">
                <span className="material-symbols-outlined">add</span>
              </button>
              <span className="text-xs font-medium text-text-muted">Add</span>
            </div>
          </div>
        ) : (
          <div className="bg-surface shadow-sm rounded-xl border border-border p-4">
            <p className="text-text-secondary">No participants found for this move.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;

