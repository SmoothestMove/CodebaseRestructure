import React, { useMemo, useState } from 'react';
import { useMove } from '@/features/settings/hooks/MoveContext';
import { useBoxes } from '@/features/boxes/hooks/useBoxes';
import { useOwnersSpacesSeparation } from '@/features/owners/hooks/useOwnersSpacesSeparation';
import { ItemStatus } from '@/types';
import { BoxPackingProgressChart } from '../components/BoxPackingProgressChart';
import { ProgressBarComponent } from '../components/ProgressBarComponent';
import { DynamicBentoGrid } from '../components/DynamicBentoGrid';
import { TruckLayoutVisualization } from '../components/TruckLayoutVisualization';
import { BudgetOverviewWidget } from '../components/BudgetOverviewWidget';
import { ParticipantsSkeleton } from '@/components/design-system';
import { BsQuestionCircle } from 'react-icons/bs';
import { FaUser, FaBuilding } from 'react-icons/fa';
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
  
  // Create legacy-compatible owners array for components that still need it
  const displayOwners = useMemo(() => {
    if (isRandomized && randomizedData) {
      // Convert enhanced data back to legacy format
      return [
        ...randomizedData.personalOwners.map(owner => ({
          uid: owner.uid,
          firstName: owner.firstName,
          lastName: owner.lastName,
          color: owner.color,
          createdAt: owner.createdAt
        })),
        ...randomizedData.communalSpaces.map(space => ({
          uid: space.uid,
          firstName: space.name,
          lastName: '(Communal)',
          color: space.color,
          createdAt: space.createdAt
        }))
      ];
    }
    return owners;
  }, [isRandomized, randomizedData, owners]);

  // Aggregate box packing progress data
  const progressData = useMemo(() => {
    if (!displayBoxes.length) return null;
    
    const statusCounts = displayBoxes.reduce((acc, box) => {
      acc[box.currentStatus] = (acc[box.currentStatus] || 0) + 1;
      return acc;
    }, {} as Record<ItemStatus, number>);

    // Calculate overall progress
    const totalBoxes = displayBoxes.length;
    const packedBoxes = statusCounts[ItemStatus.PACKED] || 0;
    const loadedBoxes = statusCounts[ItemStatus.LOADED] || 0;
    const deliveredBoxes = statusCounts[ItemStatus.DELIVERED] || 0;
    const unpackedBoxes = statusCounts[ItemStatus.UNPACKED] || 0;

    return {
      total: totalBoxes,
      prepared: statusCounts[ItemStatus.PREPARED] || 0,
      packed: packedBoxes,
      loaded: loadedBoxes,
      delivered: deliveredBoxes,
      unloaded: statusCounts[ItemStatus.UNLOADED] || 0,
      unpacked: unpackedBoxes,
      overallProgress: totalBoxes > 0 ? Math.round((unpackedBoxes / totalBoxes) * 100) : 0
    };
  }, [displayBoxes]);

  // Check if any boxes are loaded for truck visualization
  const hasLoadedBoxes = useMemo(() => {
    return displayBoxes.some(box => box.currentStatus === ItemStatus.LOADED);
  }, [displayBoxes]);

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <div className="animate-pulse">
          <div className="bg-slate-200 dark:bg-slate-700 h-8 w-64 rounded mb-4"></div>
          <div className="bg-slate-200 dark:bg-slate-700 h-64 rounded-xl mb-6"></div>
          <div className="bg-slate-200 dark:bg-slate-700 h-32 rounded-xl mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-200 dark:bg-slate-700 h-32 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <header className="bg-brand-primary dark:bg-slate-800 shadow-xl rounded-xl p-6 text-white dark:text-slate-100 relative">
        {/* Dev Mode Randomization Button */}
        {import.meta.env.DEV && (
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleRandomize}
              className="bg-brand-tertiary hover:bg-opacity-80 text-white p-2 rounded-lg transition-colors duration-200 flex items-center gap-1 text-sm"
              title="Randomize data for testing (Dev Mode Only)"
            >
              <BsQuestionCircle className="w-4 h-4" />
              Randomize
            </button>
            {isRandomized && (
              <button
                onClick={handleResetRandomization}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200 text-sm"
                title="Reset to real data"
              >
                Reset
              </button>
            )}
          </div>
        )}
        
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="mt-2 text-brand-light-gray dark:text-slate-300">
          Track your moving progress across all aspects of your relocation
        </p>
        {move && (
          <p className="mt-1 text-sm opacity-75">Move Code: {move.moveCode}</p>
        )}
        
        {/* Enhanced separation statistics */}
        {!isRandomized && stats.totalEntities > 0 && (
          <div className="mt-3 flex items-center space-x-4 text-sm text-brand-light-gray dark:text-slate-300">
            <div className="flex items-center space-x-1">
              <FaUser className="w-3 h-3" />
              <span>{stats.personalOwners} Personal Owners</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaBuilding className="w-3 h-3" />
              <span>{stats.communalSpaces} Communal Spaces</span>
            </div>
          </div>
        )}
        
        {isRandomized && (
          <div className="mt-2 space-y-1">
            <p className="text-sm bg-orange-500 text-white px-2 py-1 rounded inline-block">
              🎲 Viewing randomized data
            </p>
            {randomizedData && (
              <div className="flex items-center space-x-4 text-xs text-brand-light-gray dark:text-slate-300">
                <div className="flex items-center space-x-1">
                  <FaUser className="w-3 h-3" />
                  <span>{randomizedData.personalOwners.length} Random Owners</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaBuilding className="w-3 h-3" />
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
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Box Packing Progress
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <BoxPackingProgressChart data={progressData} owners={displayOwners} />
          </div>
        </section>
      )}

      {/* Progress Bar */}
      {progressData && (
        <section>
          <ProgressBarComponent data={progressData} />
        </section>
      )}

      {/* Separation Test Widget - Dev Mode Only */}
      {import.meta.env.DEV && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Development: Separation Status
          </h2>
          <SeparationTestWidget />
        </section>
      )}

      {/* Dynamic Bento Grid - Spaces Overview */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
          Spaces Overview
        </h2>
        <DynamicBentoGrid boxes={displayBoxes} owners={displayOwners} />
      </section>

      {/* Truck Layout Visualization - Conditional */}
      {hasLoadedBoxes && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Truck Load Status
          </h2>
          <TruckLayoutVisualization boxes={displayBoxes} owners={displayOwners} />
        </section>
      )}

      {/* Budget Overview */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
          Budget Overview
        </h2>
        <BudgetOverviewWidget 
          randomizedBudgetData={isRandomized && randomizedData ? randomizedData.budget : undefined}
        />
      </section>

      {/* Move Participants - Simplified */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
          Move Participants
        </h2>
        {moveLoading ? (
          <ParticipantsSkeleton count={3} />
        ) : moveError ? (
          <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6">
            <div className="text-red-500">
              <p className="font-semibold">Error loading participants</p>
              <p className="text-sm">{moveError.message}</p>
            </div>
          </div>
        ) : move && move.participants ? (
          <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.keys(move.participants || {}).map((userId) => {
                const participantPresence: ParticipantPresence = 
                  presence?.[`${move.id}_${userId}`] || presence?.[userId] || {};
                const isOnline = participantPresence?.online || false;
                const displayName = participantPresence?.displayName || 'Loading...';

                return (
                  <div key={userId} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                    <div className="w-8 h-8 rounded-full bg-brand-tertiary text-white flex items-center justify-center text-sm font-semibold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {displayName}
                      </p>
                      <div className="flex items-center space-x-1">
                        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6">
            <p className="text-slate-500 dark:text-slate-400">No participants found for this move.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;