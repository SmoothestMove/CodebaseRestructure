// @ts-nocheck
import React, { useState } from 'react';
import { useOwnersSpacesSeparation } from '@/features/owners/hooks/useOwnersSpacesSeparation';
import type { PersonalOwner } from '@/types';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import Button from '@/components/common/Button';
import AddOwnerModal from '@/features/owners/components/AddOwnerModal';
import OwnerCard from '@/features/owners/components/OwnerCard';
import BatchPrintConfirmationModal from '@/features/owners/components/BatchPrintConfirmationModal';
import Alert from '@/components/common/Alert';
import { addPreppedBoxesForPrint } from '@/features/boxes/services/boxService';
import { generateLabelPdf } from '@/utils/pdfGenerator';
import { useSettings } from '@/features/settings/hooks/useSettings'; 

const ManageOwnersPage: React.FC = () => {
  const { personalOwners, isLoading: isLoadingOwners } = useOwnersSpacesSeparation();
  const { moveId } = useAuth();
  const { settings } = useSettings(); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [isBatchPrintModalOpen, setIsBatchPrintModalOpen] = useState(false);
  const [selectedOwnerForBatchPrint, setSelectedOwnerForBatchPrint] = useState<PersonalOwner | null>(null);

  const handleOwnerAdded = (newOwner: PersonalOwner) => {
    const ownerDisplayName = `${newOwner.firstName} ${newOwner.lastName}`.trim();
    setFeedbackMessage({ type: 'success', message: `Owner "${ownerDisplayName}" added successfully!` });
    setIsAddModalOpen(false);
    
    setSelectedOwnerForBatchPrint(newOwner);
    setIsBatchPrintModalOpen(true);
  };

  const handleAddOwnerError = (errorMessage: string) => {
    setFeedbackMessage({ type: 'error', message: errorMessage });
  };

  const handleConfirmInitialBatchPrint = async (owner: PersonalOwner) => {
    if (!owner) throw new Error("Owner data is missing for batch printing.");
    if (!moveId) {
      setFeedbackMessage({ type: 'error', message: "No active move found. Please join or create a move first." });
      return;
    }
    
    const countToPrint = settings.defaultBatchPrintCount; 
    try {
      const newPreppedBoxes = await addPreppedBoxesForPrint(moveId, owner.uid, countToPrint); 
      if (!newPreppedBoxes || newPreppedBoxes.length === 0) {
        throw new Error("No boxes were prepared. Check ID generation.");
      }
      const labelsDataForPdf = newPreppedBoxes.map(box => ({
        boxId: box.id,
        qrCodeValue: box.qrCodeValue,
        ownerColor: owner.color,
      }));
      await generateLabelPdf(labelsDataForPdf, owner);
      setFeedbackMessage({ type: 'success', message: `PDF generated for ${countToPrint} initial labels for ${owner.firstName}. Boxes are in 'PREPARED' status.`});
    } catch (error) {
      console.error("Failed to generate initial batch labels:", error);
      const errMessage = error instanceof Error ? error.message : 'Unknown error during PDF generation.';
      setFeedbackMessage({ type: 'error', message: `Error generating labels: ${errMessage}`});
      throw error; 
    }
  };

  return (
    <div className="space-y-8">
      <header className="bg-surface shadow-lg rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <span className="material-symbols-outlined text-3xl text-accent">group</span>
          <h1 className="text-3xl font-bold text-text-main">
            Manage Personal Owners
          </h1>
        </div>
        <Button variant="primary" size="md" leftIcon={<span className="material-symbols-outlined text-lg">add</span>} onClick={() => setIsAddModalOpen(true)}>
          Add New Personal Owner
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
            <span className="material-symbols-outlined text-2xl text-accent">person</span>
            <h2 className="text-xl font-semibold text-text-main">
                Personal Owners <span className="text-text-muted font-normal">({personalOwners.length})</span>
            </h2>
        </div>
        {isLoadingOwners && (
            <div className="flex flex-col items-center justify-center h-40 text-text-muted">
            <span className="material-symbols-outlined text-4xl text-accent mb-3 animate-spin">progress_activity</span>
            <p>Loading owners...</p>
            </div>
        )}
        {!isLoadingOwners && personalOwners.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {personalOwners.map(owner => (
                <OwnerCard key={owner.uid} owner={owner} isCommunal={false} />
            ))}
            </div>
        )}
        {!isLoadingOwners && personalOwners.length === 0 && (
            <div className="text-center py-10 bg-surface rounded-xl shadow-lg animate-fade-in border border-border">
            <span className="material-symbols-outlined text-6xl text-text-muted/50 mb-5">group</span>
            <h3 className="text-xl font-semibold text-text-main">No Personal Owners Added Yet</h3>
            <p className="text-text-secondary mt-1.5">Click "Add New Personal Owner" to start associating boxes with individuals.</p>
            </div>
        )}
      </section>

      <AddOwnerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onOwnerAdded={handleOwnerAdded}
        onAddError={handleAddOwnerError}
      />
      
      <BatchPrintConfirmationModal
        isOpen={isBatchPrintModalOpen}
        onClose={() => {
            setIsBatchPrintModalOpen(false);
            setSelectedOwnerForBatchPrint(null);
        }}
        owner={selectedOwnerForBatchPrint}
        onConfirmPrint={handleConfirmInitialBatchPrint}
      />
    </div>
  );
};

export default ManageOwnersPage;
