
import React, { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Owner } from '@/types';
import { IconQrCode, IconCheck } from '@/lib/config/constants';
import Alert from '@/components/common/Alert';
import { useSettings } from '@/features/settings/hooks/useSettings'; // Import useSettings

interface PrintLabelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner: Owner | null;
  onConfirmPrint: (owner: Owner, numLabels: number) => Promise<void>;
}

const PrintLabelsModal: React.FC<PrintLabelsModalProps> = ({
  isOpen,
  onClose,
  owner,
  onConfirmPrint,
}) => {
  const { settings } = useSettings(); // Get settings
  const [numLabelsInput, setNumLabelsInput] = useState<string>(String(settings.defaultBatchPrintCount || 9));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNumLabelsInput(String(settings.defaultBatchPrintCount || 9)); // Use settings for default
      setError(null);
      setIsLoading(false);
      setPrintSuccess(false);
    }
  }, [isOpen, owner, settings.defaultBatchPrintCount]);

  const handleConfirm = async () => {
    if (!owner) return;
    
    const numLabels = parseInt(numLabelsInput, 10);
    if (isNaN(numLabels) || numLabels <= 0) {
      setError('Please enter a valid number greater than 0.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setPrintSuccess(false);

    try {
      await onConfirmPrint(owner, numLabels);
      setPrintSuccess(true);
      setTimeout(() => {
        onClose(); 
      }, 1500);
    } catch (err) {
      setPrintError(err instanceof Error ? err.message : "An unexpected error occurred during printing.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const setPrintError = (message: string) => { 
    setError(message);
  }

  if (!owner) return null;

  const ownerDisplayName = `${owner.firstName} ${owner.lastName && owner.lastName !== '(Communal)' && owner.lastName !== '(Custom Space)' ? owner.lastName : ''}`.trim();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Print Labels for ${ownerDisplayName}`}
      size="md"
      footer={
        <div className="w-full flex justify-end space-x-3">
           <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirm} 
            isLoading={isLoading}
            isSuccess={printSuccess}
            showSuccessIcon={true}
            leftIcon={!isLoading && !printSuccess ? <IconQrCode /> : null}
          >
            {isLoading ? 'Generating PDF...' : (printSuccess ? 'PDF Generated!' : 'Print Labels')}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        <p className="text-brand-secondary">
          Enter the number of unique QR code labels you want to generate for boxes belonging to <strong className="text-brand-primary">{ownerDisplayName}</strong>.
        </p>
        <div className="flex items-center space-x-2">
            <span className="text-sm text-brand-secondary">Assigned Color:</span>
            <span 
                className="inline-block w-5 h-5 rounded-sm border border-slate-400 align-middle"
                style={{ backgroundColor: owner.color }}
                title={`Owner color: ${owner.color}`}
            ></span>
             <span className="font-mono text-sm">{owner.color}</span>
        </div>
        <Input
          id="numLabels"
          type="number"
          label="Number of Labels to Print:"
          value={numLabelsInput}
          onChange={(e) => setNumLabelsInput(e.target.value)}
          placeholder="e.g., 9"
          min="1"
          required
          disabled={isLoading || printSuccess}
          containerClassName="mt-2"
        />
        <p className="text-xs text-brand-secondary/80">
          Each label will get a unique ID (e.g., <span className="font-mono bg-slate-100 px-0.5 rounded">{owner.uid}01</span>, <span className="font-mono bg-slate-100 px-0.5 rounded">{owner.uid}02</span>, etc.).
          The generated boxes will be in 'PREPARED' status.
        </p>
      </div>
    </Modal>
  );
};

export default PrintLabelsModal;
