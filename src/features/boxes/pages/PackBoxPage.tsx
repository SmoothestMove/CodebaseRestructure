
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoxes } from '../hooks/useBoxes'; // Renamed from useItems
import { useOwners } from '../hooks/useOwners';
import { NewBoxData, Box } from '../types'; // Renamed Item to Box, NewItemData to NewBoxData
import QRCodeDisplay from '../components/QRCodeDisplay';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Alert from '../components/Alert';
import { IconPlus, IconQrCode } from '../constants';
import { getItemStatusDisplayLabel } from '../utils/statusUtils';

const PackBoxPage: React.FC = () => { // Renamed from AddItemPage
  const [name, setName] = useState('');
  const [contents, setContents] = useState(''); // Renamed from description
  const [initialLocation, setInitialLocation] = useState('');
  const [destinationRoom, setDestinationRoom] = useState(''); // Added destinationRoom state
  const [imageUrl, setImageUrl] = useState('');
  const [ownerUid, setOwnerUid] = useState<string | undefined>(undefined);
  
  const [generatedBox, setGeneratedBox] = useState<Box | null>(null); // Renamed from generatedItem
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDetails, setShowSuccessDetails] = useState(false);

  const { addBox } = useBoxes(); // Renamed from addItem
  const { owners, getOwnerByUid } = useOwners();
  const navigate = useNavigate();

  const ownerOptions = useMemo(() => {
    return [
      { value: '', label: 'Unassigned / No Owner' },
      ...owners.map(owner => ({
        value: owner.uid,
        label: `${owner.firstName} ${owner.lastName} (${owner.uid})`
      }))
    ];
  }, [owners]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setGeneratedBox(null);
    setShowSuccessDetails(false);

    if (!name.trim()) {
      setError('Box name is required.');
      return;
    }
    setIsLoading(true);

    const newBoxData: NewBoxData = {
      name,
      contents,
      initialLocation: initialLocation || "Origin (To be specified)",
      destinationRoom: destinationRoom || '',
      imageUrl: imageUrl || '',
      ownerUid: ownerUid,
    };

    try {
      const box = await addBox(newBoxData);
      setGeneratedBox(box);
      const owner = box.ownerUid ? getOwnerByUid(box.ownerUid) : null;
      const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Unassigned';
      setSuccessMessage(`Box "${box.name}" packed (Owner: ${ownerName}) and QR label ready!`);
      setShowSuccessDetails(true);
      
      // Reset form
      setName('');
      setContents('');
      setInitialLocation('');
      setDestinationRoom('');
      setImageUrl('');
      setOwnerUid(undefined);
    } catch (err) {
      console.error("Failed to add box:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if(successMessage) {
        const timer = setTimeout(() => setSuccessMessage(null), 5000);
        return () => clearTimeout(timer);
    }
  }, [successMessage]);


  return (
    <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
      <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-200">
        <IconPlus className="w-8 h-8 text-brand-tertiary" />
        <h1 className="text-3xl font-bold text-brand-primary">Pack New Box</h1>
      </div>
      
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {successMessage && !generatedBox && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} duration={5000}/>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Box Name*"
          id="boxName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Kitchen Box #1 (Fragile), Master Bedroom Clothes"
          required
        />
        <Textarea
          label="Contents of Box (Optional)" // Changed label
          id="boxContents" // Changed id
          value={contents}
          onChange={(e) => setContents(e.target.value)}
          placeholder="List key contents, notes like 'Dishes, glassware', or 'Important documents, handle with care'."
        />
        <Input
          label="Origin Room / Current Location (Optional)"
          id="initialLocation"
          type="text"
          value={initialLocation}
          onChange={(e) => setInitialLocation(e.target.value)}
          placeholder="e.g., Old Kitchen Counter, Study (Old House)"
        />
        <Input
          label="Destination Room (Optional)" // Added field
          id="destinationRoom"
          type="text"
          value={destinationRoom}
          onChange={(e) => setDestinationRoom(e.target.value)}
          placeholder="e.g., New Kitchen Pantry, New Office Closet"
        />
        <Select
          label="Assign to Owner (Optional)"
          id="ownerUid"
          options={ownerOptions}
          value={ownerUid || ''}
          onChange={(e) => setOwnerUid(e.target.value || undefined)}
          placeholder="Select an owner or communal room"
        />
         <Input
          label="Photo URL (Optional)"
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Link to a photo of the box or its contents"
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" isLoading={isLoading} size="lg" leftIcon={!isLoading ? <IconPlus /> : null}>
            {isLoading ? 'Packing...' : 'Pack & Generate QR Label'}
          </Button>
        </div>
      </form>

      {generatedBox && showSuccessDetails && (
        <div className={`mt-10 p-6 border border-green-300 bg-green-50 rounded-xl shadow-lg transition-all duration-500 ease-out transform ${showSuccessDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <IconQrCode className="w-7 h-7 text-green-600" />
            <h2 className="text-2xl font-semibold text-green-700">Box Packed & Ready!</h2>
          </div>
          {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} duration={8000} />}
          
          <div className="grid md:grid-cols-2 gap-6 items-center mt-4">
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-brand-primary">{generatedBox.name}</h3>
              <p className="text-sm text-brand-secondary">{generatedBox.contents || "No contents list provided."}</p>
              {generatedBox.ownerUid && getOwnerByUid(generatedBox.ownerUid) && (
                <p className="text-sm text-brand-secondary/80 flex items-center">
                  <strong>Owner:</strong> 
                  <span 
                    className="w-3 h-3 rounded-full inline-block ml-2 mr-1" 
                    style={{ backgroundColor: getOwnerByUid(generatedBox.ownerUid)?.color || 'transparent' }}
                    title={`Owner: ${getOwnerByUid(generatedBox.ownerUid)?.firstName} ${getOwnerByUid(generatedBox.ownerUid)?.lastName}`}
                  ></span>
                  {getOwnerByUid(generatedBox.ownerUid)?.firstName} {getOwnerByUid(generatedBox.ownerUid)?.lastName}
                </p>
              )}
              <p className="text-sm text-brand-secondary/80"><strong>Origin:</strong> {generatedBox.currentLocation}</p>
              {generatedBox.destinationRoom && <p className="text-sm text-brand-secondary/80"><strong>Destination:</strong> {generatedBox.destinationRoom}</p>}
              <p className="text-sm text-brand-secondary/80"><strong>Status:</strong> {getItemStatusDisplayLabel(generatedBox.currentStatus)}</p>
               <p className="text-xs text-slate-400 pt-1">ID: <span className="font-mono">{generatedBox.id}</span></p>
            </div>
            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-brand-secondary mb-2 font-medium">Print & Attach This QR Label:</p>
              <QRCodeDisplay value={generatedBox.qrCodeValue} size={180} className="rounded-md border-2 border-green-300"/>
              <Button 
                variant="secondary" 
                size="md" 
                className="mt-5 w-full"
                onClick={() => navigate(`/app/box/${generatedBox.id}`)} // Updated route
              >
                View Box Details
              </Button>
            </div>
          </div>
           <Button 
            variant="ghost" 
            size="sm" 
            className="mt-6 text-brand-tertiary hover:text-brand-tertiary-dark"
            onClick={() => {
                setGeneratedBox(null);
                setShowSuccessDetails(false);
                setSuccessMessage(null);
                document.getElementById('boxName')?.focus();
            }}
            leftIcon={<IconPlus />}
            >
            Pack Another Box
          </Button>
        </div>
      )}
    </div>
  );
};

export default PackBoxPage;
