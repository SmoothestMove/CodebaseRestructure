import React, { useMemo } from 'react';
import { FaUser, FaBuilding, FaHome } from 'react-icons/fa';
import { isPersonalOwner, separateOwnersAndSpaces } from '@/types';

interface DynamicBentoGridProps {
  boxes: Box[];
  entities: (PersonalOwner | CommunalSpace)[];
}

export const DynamicBentoGrid: React.FC<DynamicBentoGridProps> = ({ 
  boxes, 
  entities = []
}) => {
  const { owners: personalOwners = [], spaces: communalSpaces = [] } = useMemo(() => separateOwnersAndSpaces(entities || []), [entities]);
  
  const entityData = useMemo(() => {
    // Count boxes per entity
    const boxCounts: Record<string, number> = {};
    (boxes || []).forEach(box => {
      if (box.ownerUid) {
        boxCounts[box.ownerUid] = (boxCounts[box.ownerUid] || 0) + 1;
      }
    });
    
    // Build entity data with clear separation
    const entities: BoxCountByEntity[] = [];
    
    // Add Personal Owners
    (personalOwners || []).forEach(owner => {
      const boxCount = boxCounts[owner.uid] || 0;
      if (boxCount > 0 || personalOwners.length + communalSpaces.length <= 12) {
        entities.push({
          uid: owner.uid,
          name: `${owner.firstName} ${owner.lastName}`,
          color: owner.color,
          boxCount,
          entityType: 'Personal',
          isPersonal: true,
          icon: <FaUser className="w-4 h-4" />
        });
      }
    });
    
    // Add Communal Spaces
    (communalSpaces || []).forEach(space => {
      const boxCount = boxCounts[space.uid] || 0;
      if (boxCount > 0) {
        entities.push({
          uid: space.uid,
          name: space.name,
          color: space.color,
          boxCount,
          entityType: 'Communal',
          isPersonal: false,
          icon: <FaBuilding className="w-4 h-4" />
        });
      }
    });
    
    // Sort by box count descending, then by type (Personal first)
    return entities.sort((a, b) => {
      if (b.boxCount !== a.boxCount) {
        return b.boxCount - a.boxCount;
      }
      return a.isPersonal ? -1 : 1;
    });
  }, [boxes, personalOwners, communalSpaces]);

  // Calculate grid layout
  const getCardSize = (boxCount: number, maxCount: number) => {
    if (maxCount === 0) return 'normal';
    const ratio = boxCount / maxCount;
    
    if (ratio >= 0.8) return 'large'; // 2x2
    if (ratio >= 0.5) return 'wide';  // 2x1
    if (ratio >= 0.3) return 'tall';  // 1x2
    return 'normal'; // 1x1
  };

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

  const maxBoxCount = Math.max(...entityData.map(e => e.boxCount), 1);

  if (entityData.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <FaHome className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          No Assigned Boxes
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Start by adding owners and spaces, then assign boxes to see the overview here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with separation stats */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Owners & Spaces Overview
        </h3>
        <div className="flex space-x-4 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <FaUser className="w-3 h-3" />
            <span>{entityData.filter(e => e.isPersonal).length} Owners</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaBuilding className="w-3 h-3" />
            <span>{entityData.filter(e => !e.isPersonal).length} Spaces</span>
          </div>
        </div>
      </div>

      {/* Enhanced grid with clear visual separation */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-fr">
        {entityData.map((entity) => {
          const cardSize = getCardSize(entity.boxCount, maxBoxCount);
          const gridClasses = getGridClasses(cardSize);
          const heightClasses = getCardHeight(cardSize);
          
          return (
            <div
              key={entity.uid}
              className={`${gridClasses} ${heightClasses} relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 ${
                entity.isPersonal 
                  ? 'border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20' 
                  : 'border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
              }`}
            >
              {/* Entity Type Banner */}
              <div className={`absolute top-0 right-0 px-2 py-1 text-xs font-semibold rounded-bl-lg ${
                entity.isPersonal 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                {entity.entityType}
              </div>
              
              {/* Background Pattern */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, ${entity.color} 20%, transparent 21%), radial-gradient(circle at 75% 20%, ${entity.color} 20%, transparent 21%)`
                }}
              />
              
              {/* Content */}
              <div className="relative h-full p-4 flex flex-col justify-between">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-white"
                      style={{ backgroundColor: entity.color }}
                    />
                    {entity.icon}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                    {entity.name}
                  </h3>
                  
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold" style={{ color: entity.color }}>
                      {entity.boxCount}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {entity.boxCount === 1 ? 'box' : 'boxes'}
                    </span>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="mt-3">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300 group-hover:brightness-110"
                      style={{ 
                        backgroundColor: entity.color,
                        width: `${(entity.boxCount / maxBoxCount) * 100}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {((entity.boxCount / Math.max(boxes.length, 1)) * 100).toFixed(1)}% of total
                    </span>
                    {cardSize === 'large' && (
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Primary {entity.entityType}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                entity.isPersonal ? 'bg-blue-500' : 'bg-green-500'
              }`} />
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {entityData.filter(e => e.isPersonal).reduce((sum, e) => sum + e.boxCount, 0)}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Personal Boxes</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {entityData.filter(e => !e.isPersonal).reduce((sum, e) => sum + e.boxCount, 0)}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Communal Boxes</div>
        </div>
        
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
            {entityData.filter(e => e.isPersonal).length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Personal Owners</div>
        </div>
        
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
            {entityData.filter(e => !e.isPersonal).length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Communal Spaces</div>
        </div>
      </div>
    </div>
  );
};