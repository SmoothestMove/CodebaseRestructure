// @ts-nocheck

import React, { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import TruckDiagram from '@/components/common/TruckDiagram';
import { Box, TruckZone, VerticalPosition, TRUCK_ZONES } from '@/types';
import { IconCheck } from '@/lib/config/constants';

interface TruckZoneSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  box: Box | null;
  onPositionSelected: (boxId: string, zone: TruckZone, verticalPosition: VerticalPosition) => void;
}

const VERTICAL_POSITIONS: VerticalPosition[] = ['Bottom', 'Middle', 'Top'];

const TruckZoneSelectorModal: React.FC<TruckZoneSelectorModalProps> = ({
  isOpen,
  onClose,
  box,
  onPositionSelected,
}) => {
  const [selectedZone, setSelectedZone] = useState<TruckZone | null>(null);
  const [selectedVerticalPosition, setSelectedVerticalPosition] = useState<VerticalPosition | null>(null);
  const [step, setStep] = useState<'zone' | 'position' | 'confirm'>(box?.truckZone ? 'confirm' : 'zone');

  useEffect(() => {
    if (isOpen) {
      setSelectedZone(box?.truckZone || null);
      setSelectedVerticalPosition(box?.truckVerticalPosition || null);
      setStep(box?.truckZone && box?.truckVerticalPosition ? 'confirm' : 'zone');
    } else {
      setSelectedZone(null);
      setSelectedVerticalPosition(null);
      setStep('zone');
    }
  }, [isOpen, box]);

  const handleZoneSelect = (zone: TruckZone) => {
    setSelectedZone(zone);
    setStep('position');
  };

  const handleVerticalSelect = (position: VerticalPosition) => {
    setSelectedVerticalPosition(position);
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (box && selectedZone && selectedVerticalPosition) {
      onPositionSelected(box.id, selectedZone, selectedVerticalPosition);
      onClose(); 
    }
  };
  
  const handleBack = () => {
    if (step === 'confirm') {
      setStep('position');
    } else if (step === 'position') {
      setStep('zone');
      setSelectedVerticalPosition(null);
    }
  };


  const modalTitle = () => {
    if (!box) return "Loading...";
    if (step === 'zone') return `Select Zone for "${box.name}"`;
    if (step === 'position') return `Vertical Position in "${selectedZone}"`;
    if (step === 'confirm') return `Confirm Placement for "${box.name}"`;
    return "Place Box in Truck";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle()}
      size="lg"
      showCloseButton={true}
      footer={ 
        <div className="w-full flex justify-between items-center">
          {step !== 'zone' ? (
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
          ) : <div />} 
          
          {step === 'confirm' && (
            <Button 
                variant="success" 
                onClick={handleConfirm} 
                disabled={!selectedZone || !selectedVerticalPosition}
                leftIcon={<IconCheck />}
            >
              Confirm Placement
            </Button>
          )}
          {step !== 'confirm' && (
             <Button variant="ghost" onClick={onClose}>
                Cancel
            </Button>
          )}
        </div>
      }
    >
      {box && (
        <div className="space-y-4 md:space-y-6">
          {step === 'zone' && (
            <>
              <p className="text-brand-secondary dark:text-slate-300 text-center">Tap a zone in the diagram below where the box is being placed.</p>
              <TruckDiagram onSelectZone={handleZoneSelect} selectedZone={selectedZone} interactive={true} />
            </>
          )}

          {step === 'position' && selectedZone && (
            <div className="flex flex-col items-center space-y-4 p-4">
              <h3 className="text-xl font-semibold text-brand-primary dark:text-slate-100">Selected Zone: <span className="text-brand-tertiary dark:text-orange-400">{selectedZone}</span></h3>
              <p className="text-brand-secondary dark:text-slate-300">Choose the vertical position within this zone:</p>
              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 w-full max-w-md">
                {VERTICAL_POSITIONS.map((pos) => (
                  <Button
                    key={pos}
                    variant={selectedVerticalPosition === pos ? 'primary' : 'secondary'}
                    onClick={() => handleVerticalSelect(pos)}
                    className="w-full py-3 text-lg"
                    size="lg"
                  >
                    {pos}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 'confirm' && selectedZone && selectedVerticalPosition && (
            <div className="text-center p-4 space-y-3">
              <p className="text-lg text-brand-secondary dark:text-slate-300">
                You are about to place box <strong className="text-brand-primary dark:text-slate-100">"{box.name}"</strong> in:
              </p>
              <div className="text-2xl font-semibold">
                <span className="text-brand-tertiary dark:text-orange-400">{selectedZone}</span>
                <span className="text-brand-secondary dark:text-slate-400 mx-2">&rarr;</span>
                <span className="text-brand-tertiary dark:text-orange-400">{selectedVerticalPosition}</span>
              </div>
              <p className="text-sm text-brand-secondary/80 dark:text-slate-400/80">Is this correct?</p>
            </div>
          )}
        </div>
      )}
      {!box && <p className="text-center text-brand-secondary dark:text-slate-400 p-8">Loading box information...</p>}
    </Modal>
  );
};

export default TruckZoneSelectorModal;
