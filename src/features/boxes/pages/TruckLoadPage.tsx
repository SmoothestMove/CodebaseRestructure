// @ts-nocheck

import React, { useState, useMemo, useEffect } from 'react';
import { useBoxes } from '@/features/boxes/hooks/useBoxes';
import { Box, ItemStatus, TruckZone, TRUCK_ZONES } from '@/types';
import TruckDiagram, { ZoneOccupancyInfo } from '@/components/common/TruckDiagram'; 
import BoxCard from '@/features/boxes/components/BoxCard';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { IconListBullet } from '@/lib/config/constants';
import { FaSearch, FaTimesCircle, FaTruck } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';

const TruckLoadPage: React.FC = () => {
  const { boxes, isLoading } = useBoxes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<TruckZone | null>(null);

  const loadedBoxes = useMemo(() => {
    return boxes.filter(box => box.currentStatus === ItemStatus.LOADED);
  }, [boxes]);

  const zoneCounts = useMemo(() => {
    const counts = TRUCK_ZONES.reduce((acc, zone) => {
      acc[zone] = 0;
      return acc;
    }, {} as Record<TruckZone, number>);

    loadedBoxes.forEach(box => {
      if (box.truckZone && counts[box.truckZone] !== undefined) {
        counts[box.truckZone]++;
      }
    });
    return counts;
  }, [loadedBoxes]);

  const zoneOccupancy: ZoneOccupancyInfo[] = useMemo(() => {
    return TRUCK_ZONES.map(zone => ({
        area: zone,
        count: zoneCounts[zone] || 0,
    }));
  }, [zoneCounts]);


  const filteredBoxes = useMemo(() => {
    let currentBoxes = loadedBoxes;

    if (selectedZone) {
      currentBoxes = currentBoxes.filter(box => box.truckZone === selectedZone);
    }

    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      currentBoxes = currentBoxes.filter(box =>
        box.name.toLowerCase().includes(lowerSearch) ||
        box.id.toLowerCase().includes(lowerSearch) ||
        box.contents?.toLowerCase().includes(lowerSearch) ||
        (box.ownerUid && box.ownerUid.toLowerCase().includes(lowerSearch)) ||
        (box.destinationRoom && box.destinationRoom.toLowerCase().includes(lowerSearch))
      );
    }
    return currentBoxes.sort((a,b) => b.updatedAt - a.updatedAt);
  }, [loadedBoxes, selectedZone, searchTerm]);

  const handleZoneClick = (zone: TruckZone) => {
    setSelectedZone(prevZone => prevZone === zone ? null : zone); 
  };
  
  const clearFilters = () => {
    setSelectedZone(null);
    setSearchTerm('');
  };

  return (
    <div className="space-y-8">
      <header className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <FaTruck className="w-8 h-8 text-brand-tertiary dark:text-orange-400" />
          <h1 className="text-3xl font-bold text-brand-primary dark:text-slate-100">Truck Loading Bay</h1>
        </div>
        <p className="mt-1 text-brand-secondary dark:text-slate-300">Visualize and manage boxes loaded onto the truck. Tap a zone to filter.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-4">
                <h2 className="text-xl font-semibold text-brand-primary dark:text-slate-100 mb-3">Truck Diagram</h2>
                <TruckDiagram 
                    onSelectZone={handleZoneClick} 
                    selectedZone={selectedZone}
                    zoneOccupancy={zoneOccupancy} 
                    interactive={true}
                />
                 {selectedZone && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedZone(null)} 
                        className="w-full mt-3 text-brand-tertiary dark:text-orange-400 hover:text-brand-tertiary-dark dark:hover:text-orange-300"
                        leftIcon={<FaTimesCircle />}
                    >
                        Clear Zone Selection ({selectedZone})
                    </Button>
                )}
            </div>
            <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-4">
                 <h2 className="text-xl font-semibold text-brand-primary dark:text-slate-100 mb-3 flex items-center">
                    <FaSearch className="w-5 h-5 mr-2 text-brand-secondary dark:text-slate-400"/> Search Loaded Boxes
                </h2>
                <Input
                    id="truckSearch"
                    placeholder={selectedZone ? `Search within ${selectedZone}...` : "Search all loaded boxes..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    containerClassName="mb-0"
                />
                {(selectedZone || searchTerm) && (
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters} 
                        className="w-full mt-3 text-brand-tertiary dark:text-orange-400 hover:text-brand-tertiary-dark dark:hover:text-orange-300"
                        leftIcon={<FaTimesCircle />}
                    >
                        Clear All Filters
                    </Button>
                )}
            </div>
        </div>

        <div className="lg:col-span-2">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-brand-secondary dark:text-slate-400">
              <svg className="animate-spin h-10 w-10 text-brand-tertiary dark:text-orange-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p>Loading box data...</p>
            </div>
          )}
          {!isLoading && (
            <>
              <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-4 mb-6">
                <h2 className="text-xl font-semibold text-brand-primary dark:text-slate-100 mb-2">
                  {selectedZone ? `Boxes in ${selectedZone}` : "All Loaded Boxes"}
                  <span className="text-brand-secondary dark:text-slate-400 font-normal text-base ml-2">({filteredBoxes.length} found)</span>
                </h2>
              </div>
              {filteredBoxes.length > 0 ? (
                <div className="space-y-5">
                  {filteredBoxes.map(box => (
                    <BoxCard key={box.id} box={box} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                    <IconListBullet className="mx-auto h-16 w-16 text-brand-secondary/60 dark:text-slate-500/60 mb-5" />
                    <h3 className="text-xl font-semibold text-brand-primary dark:text-slate-100">
                        {loadedBoxes.length === 0 ? "No boxes are currently loaded on the truck." : "No boxes match your current filters."}
                    </h3>
                    {loadedBoxes.length === 0 && (
                         <p className="text-brand-secondary dark:text-slate-300 mt-2">Scan boxes and set their status to 'Loaded' to see them here.</p>
                    )}
                    {loadedBoxes.length > 0 && (searchTerm || selectedZone) && (
                         <p className="text-brand-secondary dark:text-slate-300 mt-2">Try adjusting your search term or selecting a different zone.</p>
                    )}
                     <Link to="/scan">
                        <Button variant="primary" className="mt-6">
                            Scan a Box to Load
                        </Button>
                    </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TruckLoadPage;
