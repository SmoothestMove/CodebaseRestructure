
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Owner } from '../types';
import { IconQrCode, IconCheck } from '../constants';
import Alert from './Alert';
import { useSettings } from '../hooks/useSettings';

interface BatchPrintConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner: Owner | null;
  onConfirmPrint: (owner: Owner) => Promise<void>;
}

const BatchPrintConfirmationModal: React.FC<BatchPrintConfirmationModalProps> = ({
  isOpen,
  onClose,
  owner,
  onConfirmPrint,
}) => {
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);

  const defaultLabelCount = settings.defaultBatchPrintCount;

  useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
      setPrintSuccess(false);
      setPrintError(null);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!owner) return;
    setIsLoading(true);
    setPrintError(null);
    setPrintSuccess(false);
    try {
      await onConfirmPrint(owner);
      setPrintSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch (error) {
      console.error("Error during batch print confirmation:", error);
      setPrintError(error instanceof Error ? error.message : "An unexpected error occurred during printing setup.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setIsLoading(false);
    setPrintSuccess(false);
    setPrintError(null);
    onClose();
  };

  if (!owner) return null;

  const ownerDisplayName = `${owner.firstName} ${owner.lastName || ''}`.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Print Initial Labels for ${ownerDisplayName}`}
      size="lg"
      footer={
        <div className="w-full flex justify-between items-center">
           <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Skip for Now
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            isLoading={isLoading}
            isSuccess={printSuccess}
            showSuccessIcon={true}
            leftIcon={!isLoading && !printSuccess ? <IconQrCode /> : null}
          >
            {isLoading ? 'Generating PDF...' : (printSuccess ? 'PDF Generated!' : `Print ${defaultLabelCount} Labels`)}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {printError && <Alert type="error" message={printError} onClose={() => setPrintError(null)} />}
        <p className="text-brand-secondary dark:text-slate-300">
          This will generate <strong className="text-brand-primary dark:text-slate-100">{defaultLabelCount}</strong> unique QR code labels for boxes assigned to <strong className="text-brand-primary dark:text-slate-100">{ownerDisplayName}</strong>.
        </p>
        <div className="flex items-center space-x-2">
            <span className="text-sm text-brand-secondary dark:text-slate-300">Assigned Color:</span>
            <span
                className="inline-block w-5 h-5 rounded-sm border border-slate-400 dark:border-slate-600 align-middle"
                style={{ backgroundColor: owner.color }}
                title={`Owner color: ${owner.color}`}
            ></span>
             <span className="font-mono text-sm text-slate-700 dark:text-slate-200">{owner.color}</span>
        </div>
        <p className="text-xs text-brand-secondary/80 dark:text-slate-400/80">
          The generated boxes will be in 'PREPARED' status. You can print more labels later.
        </p>
      </div>
    </Modal>
  );
};

export default BatchPrintConfirmationModal;
