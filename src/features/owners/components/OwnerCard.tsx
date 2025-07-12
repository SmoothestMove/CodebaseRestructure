
// components/OwnerCard.tsx
import React, { useState } from 'react';
import { Owner } from '../types';
import Button from './Button';
import { IconTrash } from '../constants';
import { useOwners } from '../hooks/useOwners';
import { useAuth } from '../context/AuthContext';
import { useBoxes } from '../hooks/useBoxes';
import { Box } from '../types';
import { FaPrint, FaCouch, FaBath, FaChair, FaRedo, FaUtensils, FaLaptop, FaWarehouse } from 'react-icons/fa'; 
import { BsFillHouseDownFill } from "react-icons/bs";
import { addPreppedBoxesForPrint } from '../services/boxService';
import { generateLabelPdf } from '../utils/pdfGenerator'; 
import PrintLabelsModal from './PrintLabelsModal';
import ReprintBatchesModal from './ReprintBatchesModal';

interface OwnerCardProps {
  owner: Owner;
  isCommunal?: boolean; 
}

const COMMUNAL_ROOM_ICONS: Record<string, React.FC<any>> = {
  'KT': FaUtensils,  // Kitchen
  'LR': FaCouch,     // Living Room
  'BR': FaBath,      // Bathroom
  'DR': FaChair,     // Dining Room
  'BM': BsFillHouseDownFill, // Basement
  'GA': FaWarehouse,  // Garage
  'OF': FaLaptop,     // Office
};

const OwnerCard: React.FC<OwnerCardProps> = ({ owner, isCommunal = false }) => {
    const { moveId } = useAuth();
  const { deleteOwnerByUid } = useOwners(); 
  const [isPrintLabelsModalOpen, setIsPrintLabelsModalOpen] = useState(false);
  const [isReprintModalOpen, setIsReprintModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { boxes } = useBoxes();

  // Count boxes by status for this owner
  const boxCounts = React.useMemo(() => {
    const ownerBoxes = boxes.filter(box => box.ownerUid === owner.uid);
    return {
      total: ownerBoxes.length,
      prepared: ownerBoxes.filter(b => b.currentStatus === 'Prepared').length,
      packed: ownerBoxes.filter(b => b.currentStatus === 'Packed').length,
      loaded: ownerBoxes.filter(b => b.currentStatus === 'Loaded').length,
      unloaded: ownerBoxes.filter(b => b.currentStatus === 'Unloaded').length,
      delivered: ownerBoxes.filter(b => b.currentStatus === 'Delivered').length,
      unpacked: ownerBoxes.filter(b => b.currentStatus === 'Unpacked').length,
    };
  }, [boxes, owner.uid]);

  const handleDelete = () => {
    if (isCommunal) return; 
    if (window.confirm(`Are you sure you want to delete owner "${owner.firstName} ${owner.lastName} (${owner.uid})"? This action cannot be undone and might affect box assignments.`)) {
      try {
        deleteOwnerByUid(owner.uid);
      } catch (error) {
        console.error("Failed to delete owner:", error);
        setFeedbackMessage({ type: 'error', message: `Failed to delete owner: ${error instanceof Error ? error.message : 'Unknown error'}` });
      }
    }
  };

  const handleReprintBatch = () => {
    if (isCommunal) return;
    setIsReprintModalOpen(true);
  };

  // Get all batches for this owner
  const getPrintedBatches = () => {
    // Get all boxes for this owner and sort them
    const ownerBoxes = boxes
      .filter((box: Box) => box.ownerUid === owner.uid)
      .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
    
    if (ownerBoxes.length === 0) return [];
    
    // Group boxes into batches of exactly 9 boxes each
    const batches: Array<{
      id: string;
      name: string;
      boxRange: string;
      count: number;
      boxes: Box[];
    }> = [];
    
    // Process boxes in chunks of 9
    for (let i = 0; i < ownerBoxes.length; i += 9) {
      const batchBoxes = ownerBoxes.slice(i, i + 9);
      const batchNumber = batches.length + 1;
      const firstBox = batchBoxes[0];
      const lastBox = batchBoxes[batchBoxes.length - 1];
      
      batches.push({
        id: `batch-${batchNumber}`,
        name: `Batch ${batchNumber}`,
        boxRange: `${firstBox.id}-${lastBox.id}`,
        count: 9, // Always 9 boxes per batch
        boxes: batchBoxes
      });
    }
    
    return batches;
  };

  const handleReprintConfirm = async (batchId: string) => {
    const batch = getPrintedBatches().find(b => b.id === batchId);
    if (!batch) {
      setFeedbackMessage({ 
        type: 'error', 
        message: 'Batch not found. Please try again.' 
      });
      return;
    }

    try {
      // Generate PDF for the batch using the same logic as triggerPrintLabels
      const labelsDataForPdf = batch.boxes.map(box => ({
        boxId: box.id,
        qrCodeValue: box.qrCodeValue || box.id, // Fallback to box.id if qrCodeValue is not available
        ownerColor: owner.color,
      }));

      await generateLabelPdf(labelsDataForPdf, owner);
      
      setFeedbackMessage({ 
        type: 'success', 
        message: `Successfully generated PDF for ${batch.boxes.length} box labels for ${owner.firstName} ${owner.lastName || ''}.` 
      });
      
      // Close the modal after a short delay
      setTimeout(() => {
        setIsReprintModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to generate labels:", error);
      const errorMessage = `Error generating labels: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setFeedbackMessage({ type: 'error', message: errorMessage });
    }
  };

  const triggerPrintLabels = async (ownerForPrint: Owner, numLabels: number) => {
    if (numLabels > 0 && !isNaN(numLabels)) {
      try {
                if (!moveId) {
          throw new Error('No active move found. Cannot print labels.');
        }
        const newPreppedBoxes = await addPreppedBoxesForPrint(moveId, ownerForPrint.uid, numLabels);
        
        const labelsDataForPdf = newPreppedBoxes.map(box => ({
          boxId: box.id, 
          qrCodeValue: box.qrCodeValue, 
          ownerColor: ownerForPrint.color, 
        }));

        await generateLabelPdf(labelsDataForPdf, ownerForPrint);
        setFeedbackMessage({ type: 'success', message: `Successfully generated PDF for ${numLabels} box labels for ${ownerForPrint.firstName} ${ownerForPrint.lastName || ''}. Boxes are 'PREPARED'.` });
        setIsPrintLabelsModalOpen(false); 
      } catch (error) {
        console.error("Failed to generate labels:", error);
        const errorMessage = `Error generating labels: ${error instanceof Error ? error.message : 'Unknown error'}`;
        setFeedbackMessage({ type: 'error', message: errorMessage });
        throw error; 
      }
    } else {
       const errorMessage = "Please enter a valid number greater than 0.";
       setFeedbackMessage({ type: 'error', message: errorMessage });
       throw new Error(errorMessage); 
    }
  };


  const IconComponent = isCommunal ? COMMUNAL_ROOM_ICONS[owner.uid] : null;

  React.useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  return (
    <>
      <div 
          className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl group border-l-8"
          style={{ borderLeftColor: owner.color }}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-semibold text-brand-primary dark:text-slate-100 group-hover:text-gradient-orange-peach">
                {owner.firstName} {owner.lastName && owner.lastName !== '(Communal)' && owner.lastName !== '(Custom Space)' ? owner.lastName : ''}
                {(isCommunal || owner.lastName === '(Custom Space)') && <span className="text-sm text-brand-secondary dark:text-slate-400 font-normal ml-1">{owner.lastName}</span>}
              </h3>
              <p className="text-sm text-brand-secondary dark:text-slate-400 font-mono mb-2">UID: {owner.uid}</p>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Box Status:</h4>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total:</span>
                    <span className="font-medium dark:text-gray-100">{boxCounts.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600 dark:text-yellow-400">Prepared:</span>
                    <span className="font-medium dark:text-gray-100">{boxCounts.prepared}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600 dark:text-green-400">Packed:</span>
                    <span className="font-medium dark:text-gray-100">{boxCounts.packed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600 dark:text-blue-400">Loaded:</span>
                    <span className="font-medium dark:text-gray-100">{boxCounts.loaded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-600 dark:text-indigo-400">Unloaded:</span>
                    <span className="font-medium dark:text-gray-100">{boxCounts.unloaded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600 dark:text-purple-400">Delivered:</span>
                    <span className="font-medium dark:text-gray-100">{boxCounts.delivered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Unpacked:</span>
                    <span className="font-medium dark:text-gray-100">{boxCounts.unpacked}</span>
                  </div>
                </div>
              </div>
            </div>
            {IconComponent ? (
              <IconComponent className="w-7 h-7 text-brand-primary dark:text-slate-300 opacity-80" title={`Icon for ${owner.firstName}`} />
            ) : (
              <div 
                className="w-8 h-8 rounded-full shadow-inner border-2 border-white dark:border-slate-700"
                style={{ backgroundColor: owner.color }}
                title={`Color: ${owner.color}`}
              ></div>
            )}
          </div>
          
          {isCommunal && (
               <p className="text-xs text-brand-secondary/80 dark:text-slate-400/80 mt-1">
                  Predefined Shared Space
              </p>
           )}
           {owner.lastName === '(Custom Space)' && (
             <p className="text-xs text-brand-secondary/80 dark:text-slate-400/80 mt-1">
                Custom Defined Space
            </p>
           )}

          {feedbackMessage && (
            <div className={`mt-2 text-xs p-2 rounded-md ${feedbackMessage.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
              {feedbackMessage.message}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              title={`Print New Labels for ${owner.firstName} ${owner.lastName || ''}`}
              onClick={() => setIsPrintLabelsModalOpen(true)}
            >
              <FaPrint className="w-4 h-4 text-green-600 dark:text-green-400" />
            </Button>
            {!isCommunal && owner.lastName !== '(Custom Space)' && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Reprint Labels"
                  onClick={handleReprintBatch}
                >
                  <FaRedo className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  title="Delete Owner"
                  onClick={handleDelete}
                >
                  <IconTrash className="w-4 h-4 text-red-500 dark:text-red-400" />
                </Button>
              </>
            )}
            {owner.lastName === '(Custom Space)' && !isCommunal && (
              <Button 
                variant="ghost" 
                size="icon" 
                title="Delete Custom Space"
                onClick={handleDelete} 
              >
                <IconTrash className="w-4 h-4 text-red-500 dark:text-red-400" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <PrintLabelsModal
        isOpen={isPrintLabelsModalOpen}
        onClose={() => setIsPrintLabelsModalOpen(false)}
        owner={owner}
        onConfirmPrint={triggerPrintLabels}
      />
      <ReprintBatchesModal
        isOpen={isReprintModalOpen}
        onClose={() => setIsReprintModalOpen(false)}
        owner={owner}
        batches={getPrintedBatches().map(batch => ({
          id: batch.id,
          name: batch.name,
          boxId: batch.boxRange || batch.id,
          boxRange: batch.boxRange,
          count: batch.count,
          boxes: batch.boxes
        }))}
        onReprint={handleReprintConfirm}
      />
    </>
  );
};

export default OwnerCard;