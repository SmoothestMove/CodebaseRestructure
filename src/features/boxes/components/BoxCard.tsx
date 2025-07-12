
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, ItemStatus } from '@/types'; 
import QRCodeDisplay from '@/components/common/QRCodeDisplay';
import { IconEdit, IconTrash, IconExternalLink } from '@/lib/config/constants';
import { useBoxes } from '@/features/boxes/hooks/useBoxes'; 
import { useOwners } from '@/features/owners/hooks/useOwners';
import Button from '@/components/common/Button'; 
import { getItemStatusDisplayLabel } from '@/utils/statusUtils'; 

interface BoxCardProps { 
  box: Box; 
}

const BoxCard: React.FC<BoxCardProps> = ({ box }) => { 
  const { deleteBoxById } = useBoxes(); 
  const { getOwnerByUid } = useOwners(); 

  const owner = box.ownerUid ? getOwnerByUid(box.ownerUid) : null;

  const getStatusPillStyle = (status: ItemStatus) => {
    // Dark mode status pills
    switch (status) {
      case ItemStatus.PREPARED: return 'bg-brand-accent/20 text-brand-accent-dark border-brand-accent/50 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/40'; 
      case ItemStatus.PACKED: return 'bg-green-500/20 text-green-700 border-green-500/50 dark:bg-green-500/20 dark:text-dark-green-success dark:border-green-500/40';
      case ItemStatus.LOADED: return 'bg-brand-secondary/20 text-brand-secondary-dark border-brand-secondary/50 dark:bg-slate-600/30 dark:text-slate-300 dark:border-slate-500/50';
      case ItemStatus.UNLOADED: return 'bg-brand-primary/20 text-brand-primary-dark border-brand-primary/50 dark:bg-blue-600/20 dark:text-blue-300 dark:border-blue-500/40'; 
      case ItemStatus.DELIVERED: return 'bg-purple-500/20 text-purple-700 border-purple-500/50 dark:bg-purple-500/20 dark:text-dark-purple-delivered dark:border-purple-500/40';
      case ItemStatus.UNPACKED: return 'bg-brand-light-gray text-slate-600 border-brand-light-gray-dark dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600';
      default: return 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-600 dark:text-slate-300 dark:border-slate-500';
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete this box: "${box.name}"? This action cannot be undone.`)) {
        deleteBoxById(box.id);
    }
  };

  const displayImage = box.imageUrl && !box.imageUrl.includes('picsum.photos');

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl transform hover:-translate-y-1 group">
      <div className="md:flex">
        <div className="md:w-1/3 p-4 flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-800/60 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 space-y-3">
           <Link to={`/app/box/${box.id}`} className="block w-full"> 
            {displayImage ? (
                <img 
                    className="h-36 w-36 object-cover rounded-lg shadow-md mx-auto transition-transform duration-300 group-hover:scale-105" 
                    src={box.imageUrl} 
                    alt={box.name} 
                />
            ) : (
                <div className="h-36 w-36 flex items-center justify-center">
                    <QRCodeDisplay 
                        value={box.qrCodeValue} 
                        size={128} // Slightly smaller than h-36 (144px) to allow for padding/visual balance
                        className="rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            )}
           </Link>
           <div className="md:hidden"> 
             <QRCodeDisplay value={box.qrCodeValue} size={80} className="shadow-md"/>
           </div>
        </div>
        
        <div className="p-6 flex-grow md:w-2/3">
          <div className="flex justify-between items-start mb-2">
              <Link to={`/app/box/${box.id}`} className="block hover:no-underline"> 
                <h3 className="text-lg font-semibold text-brand-tertiary dark:text-orange-400 hover:text-brand-tertiary-dark dark:hover:text-orange-300 transition-colors group-hover:text-gradient-orange-peach">{box.name}</h3>
              </Link>
              <div className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusPillStyle(box.currentStatus)} whitespace-nowrap`}>
                  {getItemStatusDisplayLabel(box.currentStatus)}
              </div>
          </div>
          
          <p className="mt-1 text-sm text-brand-secondary dark:text-slate-300 leading-relaxed h-12 overflow-hidden text-ellipsis">
            {box.contents || 'No contents list provided.'} 
          </p>
          
          <div className="mt-3 text-xs text-brand-secondary/80 dark:text-slate-400/80 space-y-0.5">
            {owner && (
              <p className="flex items-center">
                <strong>Owner:</strong>
                <span 
                  className="w-2.5 h-2.5 rounded-full inline-block ml-1.5 mr-1 border border-slate-400 dark:border-slate-500" 
                  style={{ backgroundColor: owner.color }}
                  title={`Color for ${owner.firstName} ${owner.lastName}`}
                ></span> 
                {owner.firstName} {owner.lastName} ({owner.uid})
              </p>
            )}
            {!owner && <p><strong>Owner:</strong> Unassigned</p>}
            <p><strong>Box ID:</strong> <span className="font-mono">{box.id.substring(0,8)}...</span></p>
            <p><strong>Last Seen:</strong> {box.currentLocation || 'N/A'}</p>
            {box.destinationRoom && <p><strong>Destination:</strong> {box.destinationRoom}</p>}
            {box.truckZone && box.truckVerticalPosition && (
              <p><strong>In Truck:</strong> {box.truckZone} ({box.truckVerticalPosition})</p>
            )}
            <p><strong>Last Update:</strong> {new Date(box.updatedAt).toLocaleDateString()}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="hidden md:block"> 
              <QRCodeDisplay value={box.qrCodeValue} size={70} className="shadow-md"/>
            </div>
            <div className="flex items-center space-x-2">
              <Link to={`/app/box/${box.id}`} className="block"> 
                <Button variant="ghost" size="sm" leftIcon={<IconExternalLink className="w-4 h-4 text-brand-tertiary dark:text-orange-400"/>}>
                  Details
                </Button>
              </Link>
              <Link to={`/app/box/${box.id}?edit=true`} onClick={(e) => e.stopPropagation()}> 
                  <Button variant="ghost" size="icon" title="Edit Box Details">
                      <IconEdit className="w-4 h-4 text-brand-primary dark:text-slate-300" />
                  </Button>
              </Link>
              <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleDelete}
                  title="Delete Box"
              >
                  <IconTrash className="w-4 h-4 text-red-500 dark:text-red-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxCard;
