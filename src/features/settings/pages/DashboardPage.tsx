import React from 'react';
import { useMove } from '@/features/settings/hooks/MoveContext';
import { Link } from 'react-router-dom';
import { useBoxes } from '@/features/boxes/hooks/useBoxes'; 
import { ItemStatus } from '@/types';
import { IconListBullet, IconCamera } from '@/lib/config/constants'; 
import Button from '@/components/common/Button';
import { MOVING_STATUS_LABELS } from '@/utils/statusUtils'; 
import { FaEquals, FaBox, FaTruckMoving, FaCheck, FaQrcode, FaDollyFlatbed, FaPrint, FaBoxOpen } from 'react-icons/fa'; 
import { FaHouseCircleCheck, FaUserPlus } from 'react-icons/fa6';

interface ParticipantPresence {
  online?: boolean;
  displayName?: string;
  photoURL?: string;
} 

const DashboardPage: React.FC = () => {
    const { boxes, isLoading } = useBoxes(); 
  const { move, presence, loading: moveLoading, error: moveError } = useMove(); 

  const iconClass = "w-8 h-8 text-white opacity-90"; 

  const stats = [
    { 
      label: 'Total Boxes Tracked', 
      value: boxes.length, 
      icon: <FaEquals className={iconClass} />,
      gridPlacement: 'col-start-2 row-start-1 col-span-2 row-span-2 md:col-start-2 md:row-start-1 md:col-span-2 md:row-span-2' 
    },
    { 
      label: MOVING_STATUS_LABELS[ItemStatus.PACKED], 
      value: boxes.filter(box => box.currentStatus === ItemStatus.PACKED).length, 
      icon: <FaBox className={iconClass} />,
      gridPlacement: 'col-start-1 row-start-1 md:col-start-1 md:row-start-1 md:col-span-1 md:row-span-1' 
    },
    { 
      label: MOVING_STATUS_LABELS[ItemStatus.LOADED], 
      value: boxes.filter(box => box.currentStatus === ItemStatus.LOADED).length, 
      icon: <FaTruckMoving className={iconClass} />,
      gridPlacement: 'col-start-1 row-start-2 md:col-start-1 md:row-start-2 md:col-span-1 md:row-span-1' 
    },
    {
      label: MOVING_STATUS_LABELS[ItemStatus.UNLOADED], 
      value: boxes.filter(box => box.currentStatus === ItemStatus.UNLOADED).length,
      icon: <FaDollyFlatbed className={iconClass} />, 
      gridPlacement: 'col-start-2 row-start-3 md:col-start-2 md:row-start-3 md:col-span-1 md:row-span-1' 
    },
    { 
      label: MOVING_STATUS_LABELS[ItemStatus.DELIVERED], 
      value: boxes.filter(box => box.currentStatus === ItemStatus.DELIVERED).length, 
      icon: <FaHouseCircleCheck className={iconClass} />,
      gridPlacement: 'col-start-1 row-start-3 md:col-start-1 md:row-start-3 md:col-span-1 md:row-span-1' 
    },
    { 
      label: MOVING_STATUS_LABELS[ItemStatus.UNPACKED], 
      value: boxes.filter(box => box.currentStatus === ItemStatus.UNPACKED).length, 
      icon: <FaCheck className={iconClass} />,
      gridPlacement: 'col-start-3 row-start-3 row-span-2 md:col-start-3 md:row-start-3 md:col-span-1 md:row-span-2' 
    },
    { 
      label: 'Labels Printed (PREP & Active)', 
      value: boxes.length, 
      icon: <FaQrcode className={iconClass} />,
      gridPlacement: 'col-start-1 row-start-4 col-span-2 md:col-start-1 md:row-start-4 md:col-span-2 md:row-span-1' 
    },
  ];
  
  const orderedStats = [
    stats.find(s => s.label === MOVING_STATUS_LABELS[ItemStatus.PACKED])!,
    stats.find(s => s.label === MOVING_STATUS_LABELS[ItemStatus.LOADED])!,
    stats.find(s => s.label === MOVING_STATUS_LABELS[ItemStatus.DELIVERED])!,
    stats.find(s => s.label === 'Total Boxes Tracked')!,
    stats.find(s => s.label === MOVING_STATUS_LABELS[ItemStatus.UNLOADED])!,
    stats.find(s => s.label === MOVING_STATUS_LABELS[ItemStatus.UNPACKED])!,
    stats.find(s => s.label === 'Labels Printed (PREP & Active)')!,
  ].filter(Boolean); 

  const quickActions = [
    { to: "/app/owners", icon: <FaPrint className="h-10 w-10 text-brand-tertiary dark:text-orange-400 group-hover:text-brand-tertiary-dark dark:group-hover:text-orange-500 transition-colors" />, title: "Print Box Labels", description: "Generate batches of QR labels for owners.", bgColor: "bg-brand-secondary/10 dark:bg-slate-700/50 hover:bg-brand-secondary/20 dark:hover:bg-slate-700", area: "md:col-span-1 md:row-span-1" },
    { to: "/app/scan", icon: <IconCamera className="h-10 w-10 text-brand-tertiary dark:text-orange-400 group-hover:text-brand-tertiary-dark dark:group-hover:text-orange-500 transition-colors" />, title: "Scan Box Label", description: "Update box location or status. Detail PREP boxes.", bgColor: "bg-brand-secondary/10 dark:bg-slate-700/50 hover:bg-brand-secondary/20 dark:hover:bg-slate-700", area: "md:col-span-1 md:row-span-1" },
    { to: "/app/boxes", icon: <IconListBullet className="h-10 w-10 text-brand-tertiary dark:text-orange-400 group-hover:text-brand-tertiary-dark dark:group-hover:text-orange-500 transition-colors" />, title: "View All Boxes", description: "Browse your entire inventory of tracked boxes.", bgColor: "bg-brand-secondary/10 dark:bg-slate-700/50 hover:bg-brand-secondary/20 dark:hover:bg-slate-700", area: "md:col-span-2 md:row-span-1" },
  ];

  return (
    <div className="space-y-10">
      <header className="bg-brand-primary dark:bg-slate-800 shadow-xl rounded-xl p-6 sm:p-8 text-white dark:text-slate-100">
        <h1 className="text-3xl sm:text-4xl font-bold">Smooth Moves: <span className="text-gradient-orange-peach">Your Relocation Partner</span></h1>
        <p className="mt-2 text-brand-light-gray dark:text-slate-300 max-w-2xl">Making your move stress-free, one box at a time. Track your containers from your old home to your new one.</p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-5">
          Move Participants
          {move && <span className="text-base font-normal text-slate-500 ml-2">(Code: {move.moveCode})</span>}
        </h2>
        <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6">
          {moveLoading ? (
            <p className="text-slate-500 dark:text-slate-400">Loading participants...</p>
          ) : moveError ? (
            <div className="text-red-500">
              <p className="font-semibold">Error loading participants:</p>
              <p className="text-sm">{moveError.message}</p>
              {moveError.message.includes('permissions') && (
                <p className="text-xs mt-2 text-orange-600">
                  This may be due to Firestore security rules. Please check console for details.
                </p>
              )}
            </div>
          ) : move && move.participants ? (
            <ul className="space-y-4">
              {Object.keys(move.participants || {}).map((userId) => {
                const participantPresence: ParticipantPresence = presence?.[`${move.id}_${userId}`] || presence?.[userId] || {};
                const isOnline = participantPresence?.online || false;
                const displayName = participantPresence?.displayName || 'Loading...';
                const photoURL = participantPresence?.photoURL;

                return (
                  <li key={userId} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {photoURL ? (
                        <img 
                          src={photoURL} 
                          alt={displayName} 
                          className="w-10 h-10 rounded-full mr-4 object-cover"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-4 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 font-semibold">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {displayName}
                        {isOnline && (
                          <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                            Online
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span 
                        className={`inline-block w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
                        title={isOnline ? 'Online' : 'Offline'}
                      />
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {isOnline ? 'Active now' : 'Offline'}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-slate-500 dark:text-slate-400">No participants found for this move.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-5">Your Moving Progress</h2>
        <div className="grid grid-cols-3 grid-rows-4 gap-2">
          {orderedStats.map(stat => (
            <div 
              key={stat.label} 
              className={`${stat.gridPlacement || ''} 
                         bg-gradient-to-r from-brand-primary to-brand-secondary dark:from-slate-800 dark:to-slate-700
                         p-6 rounded-xl shadow-lg 
                         flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:scale-105`}
            >
              <div className="flex justify-between items-start"> 
                <div className="text-4xl lg:text-5xl font-bold text-white dark:text-slate-100">{stat.value}</div>
                {React.cloneElement(stat.icon, { className: `${iconClass} dark:text-orange-400`})}
              </div>
              <div className="mt-2 text-sm sm:text-base font-medium text-white dark:text-slate-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-5">Quick Actions for Your Move</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quickActions.map(action => (
            <Link 
              key={action.title} 
              to={action.to} 
              className={`group block p-6 ${action.bgColor} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${action.area} flex flex-col items-start space-y-3`}
            >
              {action.icon}
              <div>
                <h3 className="text-xl font-semibold text-brand-primary dark:text-slate-100 group-hover:text-gradient-orange-peach">{action.title}</h3>
                <p className="text-brand-secondary dark:text-slate-400 text-sm">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {isLoading && <p className="text-center text-brand-secondary dark:text-slate-400 py-8">Loading your boxes data...</p>}
      {!isLoading && boxes.length === 0 && (
         <div className="text-center py-12 px-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
            <div className="mx-auto flex justify-center mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                <FaBoxOpen className="h-12 w-12 text-brand-primary dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Organize Your Move</h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
              Get started by adding your first owner to begin organizing and tracking your moving boxes.
            </p>
            <Link to="/app/owners"> 
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="group transition-all duration-200 shadow-md hover:shadow-lg"
                  leftIcon={<FaUserPlus className="group-hover:scale-110 transition-transform" />}
                >
                  <span className="relative">
                    Add First Owner
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/50 group-hover:bg-white/80 transition-colors"></span>
                  </span>
                </Button>
            </Link>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;
