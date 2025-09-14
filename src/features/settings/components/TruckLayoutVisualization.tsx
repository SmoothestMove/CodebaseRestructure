import React, { useMemo } from 'react';
import type { Box, Owner } from '@/types';
import { ItemStatus } from '@/types';
import { FaTruck } from 'react-icons/fa';

interface TruckZone {
  id: string;
  name: string;
  boxes: Box[];
  capacity: number;
  position: { x: number; y: number; width: number; height: number };
}

interface TruckLayoutVisualizationProps {
  boxes: Box[];
  owners: Owner[];
}

export const TruckLayoutVisualization: React.FC<TruckLayoutVisualizationProps> = ({
  boxes,
  owners
}) => {
  // Filter loaded boxes and organize by truck zones
  const { loadedBoxes, truckZones } = useMemo(() => {
    const loaded = boxes.filter(box => box.currentStatus === ItemStatus.LOADED);
    
    // Define truck zones (mock layout - in real app this might come from TruckLoadPage)
    const zones: TruckZone[] = [
      {
        id: 'front-left',
        name: 'Front Left',
        boxes: [],
        capacity: 12,
        position: { x: 0, y: 0, width: 50, height: 40 }
      },
      {
        id: 'front-right',
        name: 'Front Right',
        boxes: [],
        capacity: 12,
        position: { x: 50, y: 0, width: 50, height: 40 }
      },
      {
        id: 'middle-left',
        name: 'Middle Left',
        boxes: [],
        capacity: 15,
        position: { x: 0, y: 40, width: 50, height: 30 }
      },
      {
        id: 'middle-right',
        name: 'Middle Right',
        boxes: [],
        capacity: 15,
        position: { x: 50, y: 40, width: 50, height: 30 }
      },
      {
        id: 'back',
        name: 'Back Section',
        boxes: [],
        capacity: 20,
        position: { x: 0, y: 70, width: 100, height: 30 }
      }
    ];

    // Distribute boxes among zones (mock distribution based on box index)
    loaded.forEach((box, index) => {
      const zoneIndex = index % zones.length;
      zones[zoneIndex].boxes.push(box);
    });

    return { loadedBoxes: loaded, truckZones: zones };
  }, [boxes]);

  // Get owner by UID for color coding
  const getOwnerById = (ownerId: string) => {
    return owners.find(owner => owner.uid === ownerId);
  };

  // Calculate zone fill percentage
  const getZoneFillPercentage = (zone: TruckZone) => {
    return zone.capacity > 0 ? Math.min((zone.boxes.length / zone.capacity) * 100, 100) : 0;
  };

  // Get zone status color
  const getZoneStatusColor = (fillPercentage: number) => {
    if (fillPercentage >= 90) return 'bg-red-500';
    if (fillPercentage >= 70) return 'bg-yellow-500';
    if (fillPercentage >= 40) return 'bg-green-500';
    return 'bg-blue-500';
  };

  if (loadedBoxes.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <FaTruck className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          No Boxes in Transit
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Boxes will appear here once they are loaded onto the truck.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaTruck className="w-6 h-6 text-brand-tertiary" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Truck Load Overview
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {loadedBoxes.length} boxes loaded across {truckZones.filter(z => z.boxes.length > 0).length} zones
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-brand-tertiary">
            {loadedBoxes.length}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Loaded</p>
        </div>
      </div>

      {/* Truck Visualization */}
      <div className="relative bg-slate-100 dark:bg-slate-700 rounded-2xl p-6 mb-6" style={{ aspectRatio: '2/1' }}>
        {/* Truck Outline */}
        <div className="absolute inset-4 border-4 border-slate-400 dark:border-slate-500 rounded-xl">
          {/* Cab */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-slate-400 dark:bg-slate-500 rounded-t-lg" />
          
          {/* Zones */}
          {truckZones.map((zone) => {
            const fillPercentage = getZoneFillPercentage(zone);
            const statusColor = getZoneStatusColor(fillPercentage);
            
            return (
              <div
                key={zone.id}
                className="absolute border border-slate-300 dark:border-slate-600 rounded-md flex flex-col justify-center items-center p-2 transition-all hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer group"
                style={{
                  left: `${zone.position.x}%`,
                  top: `${zone.position.y}%`,
                  width: `${zone.position.width}%`,
                  height: `${zone.position.height}%`
                }}
                title={`${zone.name}: ${zone.boxes.length}/${zone.capacity} boxes`}
              >
                {/* Zone Fill Indicator */}
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${statusColor}`}
                    style={{ width: `${fillPercentage}%` }}
                  />
                </div>
                
                {/* Zone Label */}
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center">
                  {zone.name}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {zone.boxes.length}/{zone.capacity}
                </span>

                {/* Box Icons */}
                <div className="flex flex-wrap justify-center gap-1 mt-1 max-w-full overflow-hidden">
                  {zone.boxes.slice(0, 8).map((box, index) => {
                    const owner = getOwnerById(box.ownerUid || '');
                    return (
                      <div
                        key={`${box.id}-${index}`}
                        className="w-2 h-2 rounded-sm"
                        style={{ 
                          backgroundColor: owner?.color || '#64748b',
                        }}
                        title={`${box.name} - ${owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown Owner'}`}
                      />
                    );
                  })}
                  {zone.boxes.length > 8 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      +{zone.boxes.length - 8}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {truckZones
          .filter(zone => zone.boxes.length > 0)
          .map((zone) => {
            const fillPercentage = getZoneFillPercentage(zone);
            const statusColor = getZoneStatusColor(fillPercentage);
            
            // Group boxes by owner
            const boxesByOwner = zone.boxes.reduce((acc, box) => {
              const ownerId = box.ownerUid || 'unknown';
              if (!acc[ownerId]) {
                acc[ownerId] = [];
              }
              acc[ownerId].push(box);
              return acc;
            }, {} as Record<string, Box[]>);

            return (
              <div key={zone.id} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    {zone.name}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}>
                    {fillPercentage.toFixed(0)}% Full
                  </span>
                </div>

                <div className="space-y-2">
                  {Object.entries(boxesByOwner).map(([ownerId, ownerBoxes]) => {
                    const owner = getOwnerById(ownerId);
                    return (
                      <div key={ownerId} className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: owner?.color || '#64748b' }}
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
                          {ownerBoxes.length} boxes
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Capacity:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {zone.boxes.length} / {zone.capacity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Owner Legend */}
      {owners.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Owner Color Legend
          </h5>
          <div className="flex flex-wrap gap-4">
            {owners
              .filter(owner => loadedBoxes.some(box => box.ownerUid === owner.uid))
              .map((owner) => (
                <div key={owner.uid} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: owner.color }}
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {owner.firstName} {owner.lastName}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ({loadedBoxes.filter(box => box.ownerUid === owner.uid).length} boxes)
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};