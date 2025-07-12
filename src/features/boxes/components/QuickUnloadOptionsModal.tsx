
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { Box } from '../types';
import { IconCheck, IconHome, IconBox as IconBoxCustom } from '../constants'; 
import Alert from './Alert';

interface QuickUnloadOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  box: Box | null;
  onDeliver: (box: Box) => void;
  onStage: (box: Box, stagingLocation: string) => void;
}

const QuickUnloadOptionsModal: React.FC<QuickUnloadOptionsModalProps> = ({
  isOpen,
  onClose,
  box,
  onDeliver,
  onStage,
}) => {
  const [showStagingInput, setShowStagingInput] = useState(false);
  const [stagingLocation, setStagingLocation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowStagingInput(false);
      setStagingLocation('');
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!box) return null;

  // Handle modal close
  const handleClose = () => {
    if (isLoading) return; // Prevent closing while processing
    onClose();
  };

  const handleDeliver = () => {
    if (!box.destinationRoom) {
      setError(`Box "${box.name}" has no destination room defined. Cannot deliver directly. Please stage it or update box details.`);
      return;
    }
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      onDeliver(box);
      setIsLoading(false);
    }, 300); 
  };

  const handleStageClick = () => {
    setShowStagingInput(true);
    setError(null);
  };

  const handleConfirmStaging = () => {
    if (!stagingLocation.trim()) {
      setError('Please enter a staging location.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      onStage(box, stagingLocation.trim());
      setIsLoading(false);
    }, 300);
  };

  const modalTitle = `Unload Box: "${box.name}"`;
  const destinationText = box.destinationRoom ? `Deliver to: ${box.destinationRoom}` : "Deliver (No Destination Set)";

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={modalTitle}
      size="md"
      showCloseButton={!isLoading}
      footer={
        !showStagingInput ? (
          <div className="w-full flex justify-end space-x-3">
            <Button variant="secondary" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          </div>
        ) : (
          <div className="w-full flex justify-between items-center">
            <Button variant="secondary" onClick={() => {setShowStagingInput(false); setError(null);}} disabled={isLoading}>
              Back to Options
            </Button>
            <Button 
                variant="primary" 
                onClick={handleConfirmStaging} 
                isLoading={isLoading}
                leftIcon={<IconCheck />}
            >
              {isLoading ? "Confirming..." : "Confirm Staging"}
            </Button>
          </div>
        )
      }
    >
      <div className="space-y-4 py-2">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        
        {!showStagingInput ? (
          <>
            <p className="text-brand-secondary dark:text-slate-300">Choose an action for this unloaded box:</p>
            <Button
              variant="success"
              onClick={handleDeliver}
              className="w-full py-3 text-lg"
              leftIcon={<IconHome className="w-6 h-6 mr-2"/>}
              size="lg"
              disabled={isLoading || !box.destinationRoom}
              title={!box.destinationRoom ? "Define a destination room in box details to enable direct delivery." : `Deliver box to ${box.destinationRoom}`}
              aria-label={!box.destinationRoom ? "Deliver (No Destination Set), button disabled" : `Deliver box to ${box.destinationRoom}`}
            >
              {destinationText}
            </Button>
            <Button
              variant="primary"
              onClick={handleStageClick}
              className="w-full py-3 text-lg"
              leftIcon={<IconBoxCustom className="w-6 h-6 mr-2"/>}
              size="lg"
              disabled={isLoading}
              aria-label="Place box in a temporary staging area"
            >
              Place in Staging Area
            </Button>
          </>
        ) : (
          <>
            <p className="text-brand-secondary dark:text-slate-300">Enter the temporary staging location for <strong className="text-brand-primary dark:text-slate-100">"{box.name}"</strong>:</p>
            <Input
              id="stagingLocation"
              label="Staging Location"
              value={stagingLocation}
              onChange={(e) => setStagingLocation(e.target.value)}
              placeholder="e.g., Garage - Bay 1, Entryway Table"
              disabled={isLoading}
              autoFocus
              aria-required="true"
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default QuickUnloadOptionsModal;