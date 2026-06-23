// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { useOwnersSpacesSeparation } from '@/features/owners/hooks/useOwnersSpacesSeparation';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import type { CommunalSpace } from '@/types';
import Button from '@/components/common/Button';
import OwnerCard from '@/features/owners/components/OwnerCard';
import AddSpaceModal from '@/features/owners/components/AddSpaceModal'; 
import Alert from '@/components/common/Alert';
import { PREDEFINED_COMMUNAL_ROOMS } from '@/lib/config/constants';
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
    <div className="space-y-8">
      <header className="bg-surface shadow-lg rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <span className="material-symbols-outlined text-3xl text-accent">home</span>
          <h1 className="text-3xl font-bold text-text-main">
            Manage Your Spaces
          </h1>
        </div>
        <Button variant="primary" size="md" leftIcon={<span className="material-symbols-outlined text-lg">add</span>} onClick={() => setIsAddSpaceModalOpen(true)}>
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
            <h2 className="text-xl font-semibold text-text-main">
                Predefined Communal Spaces <span className="text-text-muted font-normal">({orderedPredefinedSpaces.length})</span>
            </h2>
        </div>
        {isLoadingOwners && (
            <div className="flex flex-col items-center justify-center h-40 text-text-muted">
            <span className="material-symbols-outlined text-4xl text-accent mb-3 animate-spin">progress_activity</span>
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
            <span className="material-symbols-outlined text-2xl text-accent">add_circle</span>
            <h2 className="text-xl font-semibold text-text-main">
                Your Custom Spaces <span className="text-text-muted font-normal">({customSpaces.length})</span>
            </h2>
        </div>
         {isLoadingOwners && (
             <p className="text-text-muted text-center py-5">Loading custom spaces...</p>
        )}
        {!isLoadingOwners && customSpaces.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {customSpaces.map(space => (
                <OwnerCard key={space.uid} owner={space} isCommunal={false} />
            ))}
            </div>
        )}
        {!isLoadingOwners && customSpaces.length === 0 && (
            <div className="text-center py-10 bg-surface rounded-xl shadow-lg animate-fade-in border border-border">
            <span className="material-symbols-outlined text-6xl text-text-muted/50 mb-5">home</span>
            <h3 className="text-xl font-semibold text-text-main">No Custom Spaces Added Yet</h3>
            <p className="text-text-secondary mt-1.5">Click "Add New Custom Space" to define additional rooms or areas.</p>
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
