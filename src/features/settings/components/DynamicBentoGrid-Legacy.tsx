import React, { useMemo } from 'react';
import type { Box, Owner } from '@/types';
import { PREDEFINED_COMMUNAL_ROOMS } from '@/lib/config/constants';
import { FaHome, FaBuilding } from 'react-icons/fa';

interface BoxCountByOwner {
  ownerId: string;
  name: string;
  color: string;
  boxCount: number;
  type: 'personal' | 'communal';
  isPersonal: boolean;
}

interface DynamicBentoGridProps {
  boxes: Box[];
  owners: Owner[];
}

export const DynamicBentoGrid: React.FC<DynamicBentoGridProps> = ({ boxes, owners }) => {
  // Calculate box counts per owner/space
  const ownerBoxCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Count boxes per owner
    boxes.forEach(box => {
      if (box.ownerUid) {
        counts[box.ownerUid] = (counts[box.ownerUid] || 0) + 1;
      }
    });

    // Combine personal owners and communal spaces
    const allSpaces: BoxCountByOwner[] = [];

    // Add personal owners
    owners.forEach(owner => {
      const boxCount = counts[owner.uid] || 0;
      if (boxCount > 0 || owners.length <= 8) { // Show all if few owners, otherwise only those with boxes
        allSpaces.push({
          ownerId: owner.uid,
          name: `${owner.firstName} ${owner.lastName}`,
          color: owner.color,
          boxCount,
          type: 'personal',
          isPersonal: true
        });
      }
    });

    // Add communal rooms with boxes
    PREDEFINED_COMMUNAL_ROOMS.forEach(room => {
      const boxCount = counts[room.uid] || 0;
      if (boxCount > 0) {
        allSpaces.push({
          ownerId: room.uid,
          name: room.firstName, // This is the room name
          color: room.color,
          boxCount,
          type: 'communal',
          isPersonal: false
        });
      }
    });

    // Sort by box count descending
    return allSpaces.sort((a, b) => b.boxCount - a.boxCount);
  }, [boxes, owners]);

  // Determine card size based on box count
  const getCardSize = (boxCount: number, maxCount: number) => {
    if (maxCount === 0) return 'normal';
    const ratio = boxCount / maxCount;
    
    if (ratio >= 0.8) return 'large'; // 2x2
    if (ratio >= 0.5) return 'wide';  // 2x1
    if (ratio >= 0.3) return 'tall';  // 1x2
    return 'normal'; // 1x1
  };

  const maxBoxCount = Math.max(...ownerBoxCounts.map(o => o.boxCount), 1);

  // Generate grid layout classes
  const getGridClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'col-span-2 row-span-2 md:col-span-2 md:row-span-2';
      case 'wide':
        return 'col-span-2 row-span-1 md:col-span-2 md:row-span-1';
      case 'tall':
        return 'col-span-1 row-span-2 md:col-span-1 md:row-span-2';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  const getCardHeight = (size: string) => {
    switch (size) {
      case 'large':
        return 'h-48 md:h-64';
      case 'tall':
        return 'h-40 md:h-48';
      default:
        return 'h-32 md:h-36';
    }
  };

  if (ownerBoxCounts.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <FaHome className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          No Spaces with Boxes
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Start by adding owners and assigning boxes to see space overviews here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-fr">
      {ownerBoxCounts.map((space) => {
        const cardSize = getCardSize(space.boxCount, maxBoxCount);
        const gridClasses = getGridClasses(cardSize);
        const heightClasses = getCardHeight(cardSize);
        
        return (
          <div
            key={space.ownerId}
            className={`${gridClasses} ${heightClasses} relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
            style={{
              background: `linear-gradient(135deg, ${space.color}20 0%, ${space.color}10 100%)`
            }}
          >
            {/* Background Pattern */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, ${space.color} 20%, transparent 21%), radial-gradient(circle at 75% 20%, ${space.color} 20%, transparent 21%)`
              }}
            />
            
            {/* Content */}
            <div className="relative h-full p-4 flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: space.color }}
                  />
                  {space.isPersonal ? (
                    <FaHome className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <FaBuilding className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  )}
                </div>
                
                <span className="text-xs px-2 py-1 bg-white dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 font-medium">
                  {space.type === 'personal' ? 'Personal' : 'Communal'}
                </span>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                  {space.name}
                </h3>
                
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold" style={{ color: space.color }}>
                    {space.boxCount}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {space.boxCount === 1 ? 'box' : 'boxes'}
                  </span>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-3">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300 group-hover:brightness-110"
                    style={{ 
                      backgroundColor: space.color,
                      width: `${(space.boxCount / maxBoxCount) * 100}%`
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {((space.boxCount / Math.max(boxes.length, 1)) * 100).toFixed(1)}% of total
                  </span>
                  {cardSize === 'large' && (
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Primary Space
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-white dark:bg-slate-800 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </div>
        );
      })}
    </div>
  );
};