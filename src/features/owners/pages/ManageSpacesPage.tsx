import React, { useState, useMemo } from 'react';
import { useOwnersSpacesSeparation } from '@/features/owners/hooks/useOwnersSpacesSeparation';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import type { CommunalSpace } from '@/types';
import Button from '@/components/common/Button';
import OwnerCard from '@/features/owners/components/OwnerCard';
import AddSpaceModal from '@/features/owners/components/AddSpaceModal'; 
import Alert from '@/components/common/Alert';
import { IconPlus, PREDEFINED_COMMUNAL_ROOMS } from '@/lib/config/constants';
import { FaHouseUser } from 'react-icons/fa6'; 
import { addPreppedBoxesForPrint } from '@/features/boxes/services/boxService';
import { generateLabelPdf } from '@/utils/pdfGenerator';
import BatchPrintConfirmationModal from '@/features/owners/components/BatchPrintConfirmationModal';
import { useSettings } from '@/features/settings/hooks/useSettings'; 

const ManageSpacesPage: React.FC = () => {
  const { predefinedSpaces, customSpaces, isLoading: isLoadingOwners } = useOwnersSpacesSeparation();
  const { moveId } = useAuth();
  const { settings } = useSettings(); 
  const [isAddSpaceModalOpen, setIsAddSpaceModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const [isBatchPrintModalOpen, setIsBatchPrintModalOpen] = useState(false);
  const [selectedSpaceForBatchPrint, setSelectedSpaceForBatchPrint] = useState<CommunalSpace | null>(null);

  const orderedPredefinedSpaces = useMemo(() => {
    const orderMap = new Map(PREDEFINED_COMMUNAL_ROOMS.map((room, index) => [room.uid, index]));
    return [...predefinedSpaces].sort((a, b) => (orderMap.get(a.uid) ?? Number.MAX_SAFE_INTEGER) - (orderMap.get(b.uid) ?? Number.MAX_SAFE_INTEGER));
  }, [predefinedSpaces]);

  const handleSpaceAdded = (newSpace: CommunalSpace) => {
    setFeedbackMessage({ type: 'success', message: `Custom Space "${newSpace.name}" added successfully!` });
    setIsAddSpaceModalOpen(false);
    
    setSelectedSpaceForBatchPrint(newSpace);
    setIsBatchPrintModalOpen(true);
  };

  const handleAddSpaceError = (errorMessage: string) => {
    setFeedbackMessage({ type: 'error', message: errorMessage });
  };
  
  const handleConfirmInitialBatchPrintForSpace = async (space: CommunalSpace) => {
    if (!space) throw new Error("Space data is missing for batch printing.");
    if (!moveId) {
      setFeedbackMessage({ type: 'error', message: "No active move found. Please join or create a move first." });
      return;
    }

    const countToPrint = settings.defaultBatchPrintCount; 
    try {
      const newPreppedBoxes = await addPreppedBoxesForPrint(moveId, space.uid, countToPrint); 
      if (!newPreppedBoxes || newPreppedBoxes.length === 0) {
        throw new Error("No boxes were prepared for this space. Check ID generation.");
      }
      const labelsDataForPdf = newPreppedBoxes.map(box => ({
        boxId: box.id,
        qrCodeValue: box.qrCodeValue,
        ownerColor: space.color, 
      }));
      await generateLabelPdf(labelsDataForPdf, space); 
      setFeedbackMessage({ type: 'success', message: `PDF generated for ${countToPrint} initial labels for space "${space.name}". Boxes are in 'PREPARED' status.`});
    } catch (error) {
      console.error("Failed to generate initial batch labels for space:", error);
      const errMessage = error instanceof Error ? error.message : 'Unknown error during PDF generation for space.';
      setFeedbackMessage({ type: 'error', message: `Error generating labels for space: ${errMessage}`});
      throw error; 
    }
  };

  return (
    <div className="space-y-10">
      <header className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <FaHouseUser className="w-8 h-8 text-brand-tertiary dark:text-orange-400" />
          <h1 className="text-3xl font-bold text-brand-primary dark:text-slate-100">
            Manage Your Spaces
          </h1>
        </div>
        <Button variant="primary" size="md" leftIcon={<IconPlus />} onClick={() => setIsAddSpaceModalOpen(true)}>
          Add New Custom Space
        </Button>
      </header>

      {feedbackMessage && (
        <Alert 
          type={feedbackMessage.type} 
          message={feedbackMessage.message} 
          onClose={() => setFeedbackMessage(null)} 
          duration={7000}
        />
      )}

      <section>
        <div className="flex items-center space-x-3 mb-5">
            <h2 className="text-2xl font-semibold text-brand-primary dark:text-slate-100">
                Predefined Communal Spaces <span className="text-brand-secondary dark:text-slate-400 font-normal">({orderedPredefinedSpaces.length})</span>
            </h2>
        </div>
        {isLoadingOwners && (
            <div className="flex flex-col items-center justify-center h-40 text-brand-secondary dark:text-slate-400">
            <svg className="animate-spin h-8 w-8 text-brand-tertiary dark:text-orange-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Loading predefined spaces...</p>
            </div>
        )}
        {!isLoadingOwners && orderedPredefinedSpaces.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {orderedPredefinedSpaces.map(space => (
                <OwnerCard key={space.uid} owner={space} isCommunal={true} />
            ))}
            </div>
        )}
      </section>

      <section>
        <div className="flex items-center space-x-3 mb-5">
            <IconPlus className="w-7 h-7 text-brand-primary dark:text-slate-200" />
            <h2 className="text-2xl font-semibold text-brand-primary dark:text-slate-100">
                Your Custom Spaces <span className="text-brand-secondary dark:text-slate-400 font-normal">({customSpaces.length})</span>
            </h2>
        </div>
         {isLoadingOwners && (
             <p className="text-brand-secondary dark:text-slate-400 text-center py-5">Loading custom spaces...</p>
        )}
        {!isLoadingOwners && customSpaces.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {customSpaces.map(space => (
                <OwnerCard key={space.uid} owner={space} isCommunal={false} />
            ))}
            </div>
        )}
        {!isLoadingOwners && customSpaces.length === 0 && (
            <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg animate-fade-in border border-slate-200 dark:border-slate-700">
            <FaHouseUser className="mx-auto h-16 w-16 text-brand-secondary/50 dark:text-slate-500/50 mb-5" />
            <h3 className="text-xl font-semibold text-brand-primary dark:text-slate-100">No Custom Spaces Added Yet</h3>
            <p className="text-brand-secondary dark:text-slate-300 mt-1.5">Click "Add New Custom Space" to define additional rooms or areas.</p>
            </div>
        )}
      </section>

      <AddSpaceModal
        isOpen={isAddSpaceModalOpen}
        onClose={() => setIsAddSpaceModalOpen(false)}
        onSpaceAdded={handleSpaceAdded}
        onAddError={handleAddSpaceError}
      />
      
      <BatchPrintConfirmationModal
        isOpen={isBatchPrintModalOpen}
        onClose={() => {
            setIsBatchPrintModalOpen(false);
            setSelectedSpaceForBatchPrint(null);
        }}
        owner={selectedSpaceForBatchPrint} 
        onConfirmPrint={handleConfirmInitialBatchPrintForSpace}
      />

    </div>
  );
};

export default ManageSpacesPage;
