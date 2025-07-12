
import React from 'react';
import { TRUCK_ZONES, Box as AppBox } from '@/types'; 
import { IconBox } from '@/lib/config/constants';
import { useTheme } from '@/hooks/useTheme'; // Import useTheme

type TruckZoneName = typeof TRUCK_ZONES[number];

export interface ZoneOccupancyInfo {
  area: TruckZoneName;
  count: number;
  items?: Pick<AppBox, 'id' | 'contents'>[]; 
}

interface TruckDiagramProps {
  onSelectZone?: (area: TruckZoneName) => void;
  selectedZone?: TruckZoneName | null;
  interactive?: boolean;
  zoneOccupancy?: ZoneOccupancyInfo[];
  highlightColorClass?: string;
  className?: string;
}

const TruckDiagram: React.FC<TruckDiagramProps> = ({
  onSelectZone,
  selectedZone,
  interactive = true,
  zoneOccupancy = [],
  highlightColorClass = 'ring-2 ring-offset-1 ring-brand-tertiary dark:ring-orange-400 bg-brand-tertiary/30 dark:bg-orange-500/30 dark:ring-offset-slate-800',
  className,
}) => {
  const { isDarkMode } = useTheme();

  const getOccupancyForZone = (
    zoneName: TruckZoneName,
    zoneOcc?: ZoneOccupancyInfo[]
  ): ZoneOccupancyInfo | undefined => {
    return zoneOcc?.find(zo => zo.area === zoneName);
  };

  const getFullnessColorClass = (count?: number, isCab?: boolean): string => {
    if (isCab) return 'bg-slate-300 dark:bg-slate-600';
    if (count === undefined || count === 0) return 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600';
    if (count <= 2) return 'bg-green-200 hover:bg-green-300 dark:bg-green-800/70 dark:hover:bg-green-700/70'; // Adjusted dark green
    if (count <= 5) return 'bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-800/70 dark:hover:bg-yellow-700/70'; // Adjusted dark yellow
    return 'bg-red-300 hover:bg-red-400 dark:bg-red-800/70 dark:hover:bg-red-700/70'; // Adjusted dark red
  };

  const truckZoneLayout: { name: TruckZoneName; label: string; gridClass: string }[] = [
    { name: "Cab", label: "Cab", gridClass: "col-start-1 col-span-3 row-start-1" },
    { name: "Overhead", label: "Overhead", gridClass: "col-start-1 col-span-3 row-start-2" },
    { name: "Front Left", label: "Front Left", gridClass: "col-start-1 row-start-3" },
    { name: "Front Center", label: "Front Center", gridClass: "col-start-2 row-start-3" },
    { name: "Front Right", label: "Front Right", gridClass: "col-start-3 row-start-3" },
    { name: "Middle Left", label: "Middle Left", gridClass: "col-start-1 row-start-4" },
    { name: "Middle Center", label: "Middle Center", gridClass: "col-start-2 row-start-4" },
    { name: "Middle Right", label: "Middle Right", gridClass: "col-start-3 row-start-4" },
    { name: "Back Left", label: "Back Left", gridClass: "col-start-1 row-start-5" },
    { name: "Back Center", label: "Back Center", gridClass: "col-start-2 row-start-5" },
    { name: "Back Right", label: "Back Right", gridClass: "col-start-3 row-start-5" },
  ];

  return (
      <div
        className={`truck-diagram-container relative w-full max-w-xs mx-auto bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md border border-slate-300 dark:border-slate-700 ${className || ''}`}
      >
        <div className="relative aspect-[9/16] border-2 border-black dark:border-slate-400 rounded-t-lg rounded-b-md overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-5 gap-0.5 p-1">
            {truckZoneLayout.map((zone) => {
              const occupancy = getOccupancyForZone(zone.name, zoneOccupancy);
              const isSelected = selectedZone === zone.name;
              const isCab = zone.name === "Cab";
              const isCurrentlyInteractive = interactive;

              const cellClasses = [
                "zone-cell flex flex-col items-center justify-center text-center border border-slate-400 dark:border-slate-600",
                "text-xs font-medium text-slate-700 dark:text-slate-300 select-none",
                isCurrentlyInteractive ? "cursor-pointer" : "cursor-default",
                getFullnessColorClass(occupancy?.count, isCab),
                isSelected && isCurrentlyInteractive ? highlightColorClass : "",
                zone.gridClass
              ].join(" ");

              return (
                <div
                  key={zone.name}
                  onClick={() => isCurrentlyInteractive && onSelectZone?.(zone.name)}
                  onKeyDown={(e) => {
                    if (isCurrentlyInteractive && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onSelectZone?.(zone.name);
                    }
                  }}
                  role={isCurrentlyInteractive ? "button" : "button"}
                  tabIndex={isCurrentlyInteractive ? 0 : -1}
                  aria-label={zone.name}
                  aria-pressed={isSelected && isCurrentlyInteractive}
                  className={cellClasses}
                  title={zone.name + (occupancy && occupancy.count > 0 ? ` (${occupancy.count} items)`: '')}
                >
                  <span>{zone.label}</span>
                  {occupancy && occupancy.count > 0 && (
                    <div className="mt-0.5 text-[10px] flex items-center">
                      <IconBox className="w-2.5 h-2.5 mr-0.5 opacity-70 dark:text-slate-400" /> {occupancy.count}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="wheel-well absolute left-[1px] top-[calc(40%-10px)] h-5 w-3 bg-black dark:bg-slate-500 rounded-r-sm sm:top-[calc(40%-12px)] sm:h-6 sm:w-4" title="Left Front Wheel Well Area"></div>
          <div className="wheel-well absolute left-[1px] top-[calc(60%-10px)] h-5 w-3 bg-black dark:bg-slate-500 rounded-r-sm sm:top-[calc(60%-12px)] sm:h-6 sm:w-4" title="Left Rear Wheel Well Area"></div>

          <div className="wheel-well absolute right-[1px] top-[calc(40%-10px)] h-5 w-3 bg-black dark:bg-slate-500 rounded-l-sm sm:top-[calc(40%-12px)] sm:h-6 sm:w-4" title="Right Front Wheel Well Area"></div>
          <div className="wheel-well absolute right-[1px] top-[calc(60%-10px)] h-5 w-3 bg-black dark:bg-slate-500 rounded-l-sm sm:top-[calc(60%-12px)] sm:h-6 sm:w-4" title="Right Rear Wheel Well Area"></div>
        </div>
        <div className="text-center mt-1">
          <div className="inline-block text-[10px] text-slate-400 dark:text-slate-500 tracking-wider">
            ▼ REAR OF TRUCK ▼
          </div>
        </div>
      </div>
  );
};

export default TruckDiagram;