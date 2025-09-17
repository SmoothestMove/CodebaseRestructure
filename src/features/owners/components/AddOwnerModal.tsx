import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useOwnersSpacesSeparation } from '../hooks/useOwnersSpacesSeparation';
import type { PersonalOwner, LegacyOwner } from '@/types';
import { legacyOwnerToModern } from '@/types';
import { IconPlus } from '@/lib/config/constants';
import Alert from '@/components/common/Alert';

interface AddOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOwnerAdded: (newOwner: PersonalOwner) => void;
  onAddError?: (errorMessage: string) => void;
  initialFirstName?: string;
  initialLastName?: string;
}

const AddOwnerModal: React.FC<AddOwnerModalProps> = ({ isOpen, onClose, onOwnerAdded, onAddError, initialFirstName, initialLastName }) => {
  const [firstName, setFirstName] = useState(initialFirstName || '');
  const [lastName, setLastName] = useState(initialLastName || '');
  const [color, setColor] = useState('#FF7E00'); // Default to brand-tertiary
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addOwner } = useOwnersSpacesSeparation();

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setColor('#FF7E00');
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
    if (!firstName.trim()) {
      setError('First name is required.');
      return;
    }
    if (!lastName.trim()) {
      setError('Last name is required.');
      return;
    }
    setIsLoading(true);
    setShowSuccess(false);

    try {
      const newOwnerPayload = { 
        firstName: firstName.trim(), 
        lastName: lastName.trim(), 
        color 
      };
      
      const newOwnerLegacy = await addOwner(newOwnerPayload);
      const newOwner = legacyOwnerToModern(newOwnerLegacy as LegacyOwner) as PersonalOwner;

      setIsLoading(false);
      setShowSuccess(true);
      onOwnerAdded(newOwner);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: unknown) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add owner. Please try again.';
      setError(errorMessage);
      if (onAddError) {
        onAddError(errorMessage);
      }
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Add New Owner" 
      size="md"
      showCloseButton={false} // Hide the 'X' button for this modal
      footer={<></>} // Suppress the default footer with "Close" button
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        <Input
          label="First Name*"
          id="ownerFirstName"
          value={firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
          placeholder="e.g., John"
          required
          disabled={isLoading || showSuccess}
        />
        <Input
          label="Last Name*"
          id="ownerLastName"
          value={lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
          placeholder="e.g., Doe"
          required
          disabled={isLoading || showSuccess}
        />
        <div>
          <label htmlFor="ownerColor" className="block text-sm font-medium text-brand-secondary mb-1">
            Assign a Color Tag
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              id="ownerColor"
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
          <p className="text-xs text-brand-secondary/80 mt-1.5">This color helps visually identify the owner's boxes.</p>
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
            {isLoading ? 'Adding...' : (showSuccess ? 'Owner Added!' : 'Add Owner')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddOwnerModal;
