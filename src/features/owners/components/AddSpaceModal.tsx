
import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useOwners } from '@/features/owners/hooks/useOwners';
import { Owner } from '@/types'; 
import { IconPlus } from '@/lib/config/constants';
import Alert from '@/components/common/Alert';

/**
 * @interface AddSpaceModalProps
 * @property {boolean} isOpen - Whether the modal is open.
 * @property {function(): void} onClose - A callback function for when the modal is closed.
 * @property {function(Owner): void} onSpaceAdded - A callback function for when a space is added.
 * @property {function(string): void} onAddError - A callback function for when an error occurs.
 */
interface AddSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpaceAdded: (newSpace: Owner) => void;
  onAddError: (errorMessage: string) => void;
}

/**
 * A modal for adding a new custom space.
 * @param {AddSpaceModalProps} props - The props for the component.
 * @returns {JSX.Element} The rendered AddSpaceModal component.
 */
const AddSpaceModal: React.FC<AddSpaceModalProps> = ({ isOpen, onClose, onSpaceAdded, onAddError }) => {
  const [spaceName, setSpaceName] = useState('');
  const [color, setColor] = useState('#708090'); // Default to brand-secondary for spaces
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addOwner } = useOwners();

  const resetForm = () => {
    setSpaceName('');
    setColor('#708090');
    setIsLoading(false);
    setShowSuccess(false);
    setError(null);
  };

  const handleClose = () => {
    if (isLoading) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!spaceName.trim()) {
      setError('Space Name is required.');
      return;
    }
    setIsLoading(true);
    setShowSuccess(false);

    try {
      // Simulate API call
      const newSpacePayload = { 
        firstName: spaceName.trim(), 
        lastName: "(Custom Space)", // Fixed lastName for custom spaces
        color 
      };
      const newSpace = await addOwner(newSpacePayload);
      setIsLoading(false);
      setShowSuccess(true);
      onSpaceAdded(newSpace); 
      setTimeout(() => {
        handleClose();
      }, 1500); 
    } catch (err: any) {
      setIsLoading(false);
      const errorMessage = err.message || 'Failed to add space. Please try again.';
      setError(errorMessage);
      onAddError(errorMessage);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Add New Custom Space" 
      size="md"
      showCloseButton={false}
      footer={<></>} 
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        <Input
          label="Space Name*"
          id="spaceName"
          value={spaceName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpaceName(e.target.value)}
          placeholder="e.g., Master Closet, Storage Shed"
          required
          disabled={isLoading || showSuccess}
        />
        <div>
          <label htmlFor="spaceColor" className="block text-sm font-medium text-brand-secondary mb-1">
            Assign a Color Tag
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              id="spaceColor"
              value={color}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColor(e.target.value)}
              className="h-10 w-10 rounded-md border-slate-300 cursor-pointer shadow-sm focus:ring-2 focus:ring-brand-tertiary focus:outline-none disabled:opacity-50"
              disabled={isLoading || showSuccess}
            />
            <span 
                className="px-3 py-1 rounded-md text-sm font-medium text-white shadow" 
                style={{ backgroundColor: color }}
            >
                {color.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-brand-secondary/80 mt-1.5">This color helps visually identify the space's boxes.</p>
        </div>

        <div className="flex justify-end space-x-3 pt-3">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={isLoading} 
            isSuccess={showSuccess} 
            showSuccessIcon={true}
            leftIcon={!isLoading && !showSuccess ? <IconPlus /> : null}
            disabled={showSuccess}
          >
            {isLoading ? 'Adding...' : (showSuccess ? 'Space Added!' : 'Add Custom Space')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSpaceModal;
