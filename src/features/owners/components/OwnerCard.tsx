// components/OwnerCard.tsx
import React, { useState, useMemo } from 'react';
import type { PersonalOwner, CommunalSpace, OwnerOrSpace } from '@/types';
import { isPersonalOwner, isCommunalSpace, isCustomCommunalSpace, getDisplayName } from '@/types';
import Button from '@/components/common/Button';
import { IconTrash } from '@/lib/config/constants';
import { useOwnersSpacesSeparation } from '@/features/owners/hooks/useOwnersSpacesSeparation';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { useBoxes } from '@/features/boxes/hooks/useBoxes';
import type { Box } from '@/types';
import { FaPrint, FaCouch, FaBath, FaChair, FaRedo, FaUtensils, FaLaptop, FaWarehouse } from 'react-icons/fa'; 
import { BsFillHouseDownFill } from 'react-icons/bs';
import { addPreppedBoxesForPrint } from '@/features/boxes/services/boxService';
import { generateLabelPdf } from '@/utils/pdfGenerator'; 
import PrintLabelsModal from '@/features/owners/components/PrintLabelsModal';
import ReprintBatchesModal from '@/features/owners/components/ReprintBatchesModal';

interface OwnerCardProps {
  owner: PersonalOwner | CommunalSpace;
  isCommunal?: boolean; 
}

const COMMUNAL_ROOM_ICONS: Record<string, React.FC<any>> = {
  KT: FaUtensils,  // Kitchen
  LR: FaCouch,     // Living Room
  BR: FaBath,      // Bathroom
  DR: FaChair,     // Dining Room
  BM: BsFillHouseDownFill, // Basement
  GA: FaWarehouse,  // Garage
  OF: FaLaptop,     // Office
};

const OwnerCard: React.FC<OwnerCardProps> = ({ owner, isCommunal = false }) => {
  const { moveId } = useAuth();
  const { deleteOwnerByUid } = useOwnersSpacesSeparation(); 
  const [isPrintLabelsModalOpen, setIsPrintLabelsModalOpen] = useState(false);
  const [isReprintModalOpen, setIsReprintModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { boxes } = useBoxes();

  const ownerDisplayName = useMemo(() => getDisplayName(owner), [owner]);
  const isCustomSpace = isCustomCommunalSpace(owner);
  const ownerTypeLabel = isCommunalSpace(owner) ? (isCustomSpace ? 'custom space' : 'space') : 'owner';

  // Count boxes by status for this owner
  const boxCounts = useMemo(() => {
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
    if (window.confirm(`Are you sure you want to delete ${ownerTypeLabel} "${ownerDisplayName}" (${owner.uid})? This action cannot be undone and might affect box assignments.`)) {
      try {
        deleteOwnerByUid(owner.uid);
      } catch (error) {
        console.error('Failed to delete entity:', error);
        setFeedbackMessage({ type: 'error', message: `Failed to delete ${ownerTypeLabel}: ${error instanceof Error ? error.message : 'Unknown error'}` });
      }
    }
  };

  const handleReprintBatch = () => {
    if (isCommunal) return;
    setIsReprintModalOpen(true);
  };

  // Get all batches for this owner
  const getPrintedBatches = () => {
    const ownerBoxes = boxes
      .filter((box: Box) => box.ownerUid === owner.uid)
      .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
    
    if (ownerBoxes.length === 0) return [];
    
    const batches: Array<{
      id: string;
      name: string;
      boxRange: string;
      count: number;
      boxes: Box[];
    }> = [];
    
    for (let i = 0; i < ownerBoxes.length; i += 9) {
      const batchBoxes = ownerBoxes.slice(i, i + 9);
      const batchNumber = batches.length + 1;
      const firstBox = batchBoxes[0];
      const lastBox = batchBoxes[batchBoxes.length - 1];
      
      batches.push({
        id: `batch-${batchNumber}`,
        name: `Batch ${batchNumber}`,
        boxRange: `${firstBox.id}-${lastBox.id}`,
        count: batchBoxes.length,
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
      const labelsDataForPdf = batch.boxes.map(box => ({
        boxId: box.id,
        qrCodeValue: box.qrCodeValue || box.id,
        ownerColor: owner.color,
      }));

      await generateLabelPdf(labelsDataForPdf, owner);
      
      setFeedbackMessage({ 
        type: 'success', 
        message: `Successfully generated PDF for ${batch.boxes.length} box labels for ${ownerDisplayName}.` 
      });
      
      setTimeout(() => {
        setIsReprintModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to generate labels:', error);
      const errorMessage = `Error generating labels: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setFeedbackMessage({ type: 'error', message: errorMessage });
    }
  };

  const triggerPrintLabels = async (ownerForPrint: OwnerOrSpace, numLabels: number) => {
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
        setFeedbackMessage({ type: 'success', message: `Successfully generated PDF for ${numLabels} box labels for ${getDisplayName(ownerForPrint)}. Boxes are 'PREPARED'.` });
        setIsPrintLabelsModalOpen(false); 
      } catch (error) {
        console.error('Failed to generate labels:', error);
        const errorMessage = `Error generating labels: ${error instanceof Error ? error.message : 'Unknown error'}`;
        setFeedbackMessage({ type: 'error', message: errorMessage });
      }
    } else {
      setFeedbackMessage({ type: 'error', message: 'Please enter a valid number of labels to print.' });
    }
  };

  const IconComponent = isCommunalSpace(owner) ? COMMUNAL_ROOM_ICONS[owner.uid] : undefined;

  const entityMeta = isPersonalOwner(owner)
    ? {
        primaryLabel: `${owner.firstName}${owner.lastName ? ` ${owner.lastName}` : ''}`.trim(),
        secondaryLabel: undefined
      }
    : {
        primaryLabel: owner.name,
        secondaryLabel: isCustomSpace ? 'Custom Defined Space' : 'Predefined Shared Space'
      };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase tracking-wide text-brand-secondary/70 dark:text-slate-400">
                    {ownerTypeLabel}
                  </span>
                  <h3 className="text-2xl font-semibold text-brand-primary dark:text-slate-100">
                    {entityMeta.primaryLabel}
                  </h3>
                  {entityMeta.secondaryLabel && (
                    <p className="text-xs text-brand-secondary/80 dark:text-slate-400/80 mt-1">
                      {entityMeta.secondaryLabel}
                    </p>
                  )}

                  <div className="mt-2 flex items-center space-x-3 text-sm text-brand-secondary dark:text-slate-300">
                    <span className="bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-primary-light px-2 py-0.5 rounded-full font-medium">
                      UID: {owner.uid}
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="text-xs uppercase tracking-wide">Color</span>
                      <span
                        className="inline-block w-4 h-4 rounded-sm border border-slate-200 dark:border-slate-600"
                        style={{ backgroundColor: owner.color }}
                        title={`Color: ${owner.color}`}
                      ></span>
                      <span className="font-mono text-xs">{owner.color}</span>
                    </span>
                  </div>
                </div>
                {IconComponent ? (
                  <IconComponent className="w-7 h-7 text-brand-primary dark:text-slate-300 opacity-80" title={`Icon for ${ownerDisplayName}`} />
                ) : (
                  <div 
                    className="w-8 h-8 rounded-full shadow-inner border-2 border-white dark:border-slate-700"
                    style={{ backgroundColor: owner.color }}
                    title={`Color: ${owner.color}`}
                  ></div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand-secondary/70 dark:text-slate-400">Box Snapshot</p>
                  <p className="text-3xl font-bold text-brand-primary dark:text-slate-100 mt-1">{boxCounts.total}</p>
                  <p className="text-xs text-brand-secondary/80 dark:text-slate-400/80">Total boxes linked</p>
                </div>
                <div className="space-y-1 text-xs text-brand-secondary dark:text-slate-300">
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

              {feedbackMessage && (
                <div className={`mt-3 text-xs p-2 rounded-md ${feedbackMessage.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                  {feedbackMessage.message}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  title={`Print New Labels for ${ownerDisplayName}`}
                  onClick={() => setIsPrintLabelsModalOpen(true)}
                >
                  <FaPrint className="w-4 h-4 text-green-600 dark:text-green-400" />
                </Button>
                {!isCommunal && !isCustomSpace && (
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
                      title={`Delete ${ownerTypeLabel}`}
                      onClick={handleDelete}
                    >
                      <IconTrash className="w-4 h-4 text-red-500 dark:text-red-400" />
                    </Button>
                  </>
                )}
                {!isCommunal && isCustomSpace && (
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
