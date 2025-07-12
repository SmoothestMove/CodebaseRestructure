import React from 'react';
import { Owner, Box } from '@/types';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { FaPrint, FaBoxOpen, FaHashtag } from 'react-icons/fa'; 

interface Batch {
  id: string;
  name: string;
  boxId: string;
  boxRange?: string;
  count?: number;
  boxes?: Box[];
}

interface ReprintBatchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReprint: (batchId: string) => void;
  batches: Batch[];
  owner: Owner;
}

const ReprintBatchesModal: React.FC<ReprintBatchesModalProps> = ({
  isOpen,
  onClose,
  onReprint,
  batches,
  owner,
}) => {
  const [selectedBatch, setSelectedBatch] = React.useState<string | null>(null);

  const handleReprint = () => {
    if (selectedBatch) {
      onReprint(selectedBatch);
      onClose();
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBatchDetails = (batch: Batch) => {
    if (!batch.boxes || batch.boxes.length === 0) return null;
    
    const firstBox = batch.boxes[0];
    const createdDate = firstBox.createdAt ? formatDate(firstBox.createdAt) : 'N/A';
    const status = firstBox.currentStatus || 'Unknown';
    
    return (
      <div className="ml-7 mt-1 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center">
          <FaHashtag className="mr-1" />
          <span>{batch.boxes.length} {batch.boxes.length === 1 ? 'box' : 'boxes'}</span>
          <span className="mx-2">•</span>
          <FaBoxOpen className="mr-1" />
          <span>Status: {status}</span>
          <span className="mx-2">•</span>
          <span>Created: {createdDate}</span>
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reprint Batches">
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Select a batch to reprint for {owner.firstName} {owner.lastName || ''}
        </p>
        
        <div className="max-h-96 overflow-y-auto border rounded-lg divide-y divide-slate-200 dark:divide-slate-700">
          {batches.length > 0 ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {batches.map((batch) => (
                <li key={batch.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <label className="block p-4 cursor-pointer">
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="batch-selection"
                        className="h-4 w-4 text-brand-primary focus:ring-brand-primary mt-1"
                        checked={selectedBatch === batch.id}
                        onChange={() => setSelectedBatch(batch.id)}
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {batch.name}
                          </span>
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary-light rounded-full">
                            {batch.boxRange || batch.boxId}
                          </span>
                        </div>
                        {getBatchDetails(batch)}
                      </div>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center">
              <FaBoxOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                No batches found
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                This owner doesn't have any printed batches yet.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleReprint}
            disabled={!selectedBatch}
            className="px-4 py-2 flex items-center"
          >
            <FaPrint className="w-4 h-4 mr-2" />
            <span>Reprint Selected Batch</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReprintBatchesModal;
