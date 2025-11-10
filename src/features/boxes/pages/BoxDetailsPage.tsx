import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useBoxes } from '@/features/boxes/hooks/useBoxes';
import { useOwners } from '@/features/owners/hooks/useOwners';
import { Box, ItemStatus, NewBoxData, TruckZone, VerticalPosition } from '@/types';
import QRCodeDisplay from '@/components/common/QRCodeDisplay';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Select from '@/components/common/Select';
import Modal from '@/components/common/Modal';
import Alert from '@/components/common/Alert';
import TruckZoneSelectorModal from '@/features/boxes/components/TruckZoneSelectorModal';
import { IconChevronLeft, IconEdit, IconCamera, IconTrash, IconCheck, IconQrCode } from '@/lib/config/constants';
import { getItemStatusDisplayLabel, getItemStatusOptionsForSelect } from '@/utils/statusUtils';
import { useAuth } from '@/features/auth/hooks/AuthContext';

/**
 * A page that displays the details of a box, including its contents, owner,
 * history, and a QR code. It also allows the user to edit, update, and
 * delete the box.
 * @returns {JSX.Element} The rendered BoxDetailsPage component.
 */
const BoxDetailsPage: React.FC = () => {
  const { boxId } = useParams<{ boxId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { moveId } = useAuth(); // Get moveId from Auth context
  const { getBox, updateBox, addScanEntryToBox, deleteBoxById, isLoading: boxesLoading } = useBoxes();
  const { owners, getOwnerByUid } = useOwners();

  const [box, setBox] = useState<Box | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isTruckZoneModalOpen, setIsTruckZoneModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [editFormData, setEditFormData] = useState<Partial<NewBoxData> & { ownerUid?: string; spaceUid?: string }>({});
  const [scanFormData, setScanFormData] = useState<{ location: string; notes?: string; newStatus: ItemStatus }>({ location: '', notes: '', newStatus: ItemStatus.PACKED });

  const [pendingScanForLoad, setPendingScanForLoad] = useState<{ location: string; notes?: string; newStatus: ItemStatus.LOADED } | null>(null);

  const itemStatusOptions = getItemStatusOptionsForSelect();

  // Separate people from spaces for better UX
  const peopleOptions = useMemo(() => [
    { value: '', label: 'Unassigned to Person' },
    ...owners
      .filter(owner => owner.lastName !== '(Communal)' && owner.lastName !== '(Custom Space)')
      .map(person => ({
        value: person.uid,
        label: `${person.firstName} ${person.lastName}`,
        color: person.color
      }))
  ], [owners]);

  const spaceOptions = useMemo(() => [
    { value: '', label: 'Unassigned to Space' },
    ...owners
      .filter(owner => owner.lastName === '(Communal)' || owner.lastName === '(Custom Space)')
      .map(space => ({
        value: space.uid,
        label: space.firstName + (space.lastName === '(Custom Space)' ? ' (Custom)' : ''),
        color: space.color,
        isSpace: true
      }))
  ], [owners]);

  // Legacy combined options for backward compatibility if needed
  const ownerOptionsForSelect = useMemo(() => [
    { value: '', label: 'Unassigned / No Owner' },
    ...owners.map(owner => ({
      value: owner.uid,
      label: `${owner.firstName} ${owner.lastName} (${owner.uid})`
    }))
  ], [owners]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get('action');
    if (action) {
      let message = '';
      if (action === 'scanned') message = 'Box label successfully scanned! Details loaded.';
      if (action === 'packed') message = 'Box details saved and status set to PACKED.';
      if (action === 'loaded') message = 'Box successfully loaded onto truck and position recorded.';
      setSuccessMessage(message);
      navigate(location.pathname, { replace: true }); // Clear query params
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [location.search, navigate]);

  useEffect(() => {
    if (!boxId) {
      navigate('/boxes');
      return;
    }

    if (boxesLoading) {
      setIsLoading(true);
      return;
    }

    const fetchedBox = getBox(boxId);
    if (fetchedBox) {
      setBox(fetchedBox);
      // Pre-fill forms with the latest data
      setScanFormData({ location: fetchedBox.currentLocation || '', notes: '', newStatus: fetchedBox.currentStatus });
      
      // Determine if current assignment is to a person or space
      const currentOwner = fetchedBox.ownerUid ? getOwnerByUid(fetchedBox.ownerUid) : null;
      const isCurrentlySpace = currentOwner && (currentOwner.lastName === '(Communal)' || currentOwner.lastName === '(Custom Space)');
      
      setEditFormData({ 
        name: fetchedBox.name,
        contents: fetchedBox.contents,
        destinationRoom: fetchedBox.destinationRoom,
        imageUrl: fetchedBox.imageUrl,
        ownerUid: isCurrentlySpace ? '' : fetchedBox.ownerUid || '',
        spaceUid: isCurrentlySpace ? fetchedBox.ownerUid || '' : ''
      });
    } else {
      setError('Box not found. It might have been deleted or the link is incorrect.');
    }
    setIsLoading(false);
  }, [boxId, getBox, navigate, boxesLoading]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!box || !editFormData.name) {
      setError("Box name is required.");
      return;
    }
    if (!moveId) {
      setError("Cannot update box: No active move found.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Determine final assignment - prioritize person over space, or use space if person is empty
      const finalOwnerUid = editFormData.ownerUid || editFormData.spaceUid || '';
      
      const updatedDetails: Partial<Omit<Box, 'id' | 'history'>> = {
        name: editFormData.name,
        contents: editFormData.contents,
        destinationRoom: editFormData.destinationRoom,
        imageUrl: editFormData.imageUrl,
        ownerUid: finalOwnerUid, // Unified storage but separate UI
      };

      await updateBox(box.id, updatedDetails);

      setShowSuccess(true);
      setSuccessMessage('Box details updated successfully!');
      setTimeout(() => {
        setIsEditModalOpen(false);
        setShowSuccess(false);
        setSuccessMessage(null);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update box.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!box || !scanFormData.location) {
      setError("Location is required for a scan entry.");
      return;
    }
    if (!moveId) {
      setError("Cannot update box: No active move found.");
      return;
    }

    // If user is trying to mark as LOADED, divert to the truck zone selector flow
    if (scanFormData.newStatus === ItemStatus.LOADED && box.currentStatus !== ItemStatus.LOADED) {
      setPendingScanForLoad({ ...scanFormData, newStatus: ItemStatus.LOADED });
      setIsScanModalOpen(false);
      setIsTruckZoneModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addScanEntryToBox(box.id, scanFormData);

      setShowSuccess(true);
      setSuccessMessage(`Box status updated to "${getItemStatusDisplayLabel(scanFormData.newStatus)}".`);
      setTimeout(() => {
        setIsScanModalOpen(false);
        setShowSuccess(false);
        setSuccessMessage(null);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add scan entry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTruckPositionSelected = async (targetBoxId: string, zone: TruckZone, verticalPosition: VerticalPosition) => {
    if (!box || targetBoxId !== box.id || !pendingScanForLoad) {
      setError("Data mismatch or missing pending load data.");
      return;
    }
    if (!moveId) {
      setError("Cannot update box: No active move found.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // First, update the truck position and status
      await updateBox(box.id, {
        truckZone: zone,
        truckVerticalPosition: verticalPosition,
        currentStatus: ItemStatus.LOADED,
        currentLocation: "On Truck",
      });

      // Then, add the corresponding history entry
      await addScanEntryToBox(box.id, {
        location: `On Truck - ${zone}`,
        notes: `Placed at ${verticalPosition}. ${pendingScanForLoad.notes || ''}`.trim(),
        newStatus: ItemStatus.LOADED,
      });

      setSuccessMessage(`Box loaded into ${zone} (${verticalPosition}).`);
      setTimeout(() => setSuccessMessage(null), 4000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save truck placement.");
    } finally {
      setIsTruckZoneModalOpen(false);
      setPendingScanForLoad(null);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!box) return;
    if (!moveId) {
      setError("Cannot delete box: No active move found.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete the box "${box.name}"? This cannot be undone.`)) {
      setIsLoading(true); // Show loading state during deletion
      try {
        await deleteBoxById(box.id);
        setSuccessMessage(`Box "${box.name}" deleted successfully. Redirecting...`);
        setTimeout(() => navigate('/boxes'), 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete box.");
        setIsLoading(false);
      }
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-64 text-brand-secondary dark:text-slate-400">
      <svg aria-hidden="true" className="animate-spin h-10 w-10 text-brand-tertiary dark:text-orange-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <title>Loading box details</title>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-xl">Loading box details...</p>
    </div>
  );

  if (error && !box) return (
    <div className="max-w-xl mx-auto text-center py-10">
      <Alert type="error" message={error} onClose={() => setError(null)} />
      <Button onClick={() => navigate('/boxes')} variant="secondary" className="mt-6" leftIcon={<IconChevronLeft />}>
        Back to All Boxes
      </Button>
    </div>
  );

  if (!box) return null; // Should not happen if loading and error states are handled

  const currentOwnerDetails = box.ownerUid ? getOwnerByUid(box.ownerUid) : null;
  const displayImage = box.imageUrl && !box.imageUrl.includes('picsum.photos');

  const statusPillStyle = (status: ItemStatus): string => {
    switch (status) {
      case ItemStatus.PREPARED: return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/40';
      case ItemStatus.PACKED: return 'bg-green-500/20 text-green-700 border-green-500/50 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/40';
      case ItemStatus.LOADED: return 'bg-blue-500/20 text-blue-700 border-blue-500/50 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40';
      case ItemStatus.UNLOADED: return 'bg-indigo-500/20 text-indigo-700 border-indigo-500/50 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/40';
      case ItemStatus.DELIVERED: return 'bg-purple-500/20 text-purple-700 border-purple-500/50 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/40';
      case ItemStatus.UNPACKED: return 'bg-slate-500/20 text-slate-700 border-slate-500/50 dark:bg-slate-600/30 dark:text-slate-300 dark:border-slate-500/50';
      default: return 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-600 dark:text-slate-300 dark:border-slate-500';
    }
  };

  return (
    <div className="space-y-8">
      <Button onClick={() => navigate(-1)} variant="ghost" size="md" className="text-brand-secondary dark:text-slate-400 hover:text-brand-secondary-dark dark:hover:text-slate-300" leftIcon={<IconChevronLeft className="w-5 h-5"/>}>
        Back
      </Button>

      {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} duration={5000} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-brand-primary dark:bg-slate-700 text-white dark:text-slate-100 p-6 md:p-8">
          <div className="md:flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold break-words">{box.name}</h1>
              {currentOwnerDetails ? (
                <div className="flex items-center mt-1.5">
                  <span
                    className="w-4 h-4 rounded-full inline-block mr-2 border-2 border-white/50 dark:border-slate-400/50"
                    style={{ backgroundColor: currentOwnerDetails.color }}
                    title={`${currentOwnerDetails.firstName} ${currentOwnerDetails.lastName} color`}
                  />
                  <span className="text-sm text-brand-light-gray dark:text-slate-300">
                    {currentOwnerDetails.lastName === '(Communal)' ? 'Space: ' : 
                     currentOwnerDetails.lastName === '(Custom Space)' ? 'Custom Space: ' : 
                     'Person: '}
                    {currentOwnerDetails.firstName}
                    {currentOwnerDetails.lastName !== '(Communal)' && currentOwnerDetails.lastName !== '(Custom Space)' 
                      ? ` ${currentOwnerDetails.lastName}` 
                      : ''}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-brand-light-gray dark:text-slate-300 mt-1.5">Assignment: Unassigned</p>
              )}
              <p className="text-sm text-brand-light-gray/80 dark:text-slate-400/80 mt-1 font-mono">Box ID: {box.id}</p>
            </div>
            <div className={`mt-4 md:mt-0 px-3 py-1.5 text-sm font-semibold rounded-full border-2 whitespace-nowrap ${statusPillStyle(box.currentStatus)} shadow-sm text-center`}>
              Current Stage: {getItemStatusDisplayLabel(box.currentStatus)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-0">
          <div className="md:col-span-3 p-6 bg-slate-50 dark:bg-slate-800/50 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 flex flex-col items-center space-y-6">
            {displayImage ? (
              <img
                src={box.imageUrl}
                alt={`Image of ${box.name}`}
                className="w-full max-w-sm h-auto object-cover rounded-lg shadow-xl border-4 border-white dark:border-slate-700"
              />
            ) : (
              <div className="w-full max-w-sm flex items-center justify-center p-4">
                <QRCodeDisplay
                  value={box.qrCodeValue}
                  size={Math.min(300, window.innerWidth * 0.6)} // Responsive size
                  className="rounded-lg shadow-xl border-4 border-white dark:border-slate-700"
                />
              </div>
            )}
            <div className="text-center p-4 bg-white dark:bg-slate-700 rounded-lg shadow-md">
              <p className="text-sm text-brand-secondary dark:text-slate-300 mb-2 font-medium">Box QR Label:</p>
              <QRCodeDisplay value={box.qrCodeValue} size={200} className="border-2 border-brand-light-gray dark:border-slate-600 rounded-md" />
            </div>
          </div>

          <div className="md:col-span-4 p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-brand-primary dark:text-slate-100 mb-3">Box Details</h2>
              <p className="text-brand-secondary dark:text-slate-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none">{box.contents || <span className="italic">No contents list provided.</span>}</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-brand-secondary/80 dark:text-slate-400/80">
                <p><strong>Last Seen:</strong> <span className="text-brand-secondary-dark dark:text-slate-300">{box.currentLocation || 'N/A'}</span></p>
                {box.destinationRoom && <p><strong>Destination Room:</strong> <span className="text-brand-secondary-dark dark:text-slate-300">{box.destinationRoom}</span></p>}
                {box.currentStatus === ItemStatus.LOADED && box.truckZone && (
                  <p><strong>Truck Placement:</strong> <span className="text-brand-secondary-dark dark:text-slate-300">{box.truckZone} ({box.truckVerticalPosition})</span></p>
                )}
                <p><strong>Packed On:</strong> <span className="text-brand-secondary-dark dark:text-slate-300">{new Date(box.createdAt).toLocaleString()}</span></p>
                <p><strong>Last Update:</strong> <span className="text-brand-secondary-dark dark:text-slate-300">{new Date(box.updatedAt).toLocaleString()}</span></p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button onClick={() => { 
                // Determine if current assignment is to a person or space
                const currentOwner = box.ownerUid ? getOwnerByUid(box.ownerUid) : null;
                const isCurrentlySpace = currentOwner && (currentOwner.lastName === '(Communal)' || currentOwner.lastName === '(Custom Space)');
                
                setEditFormData({ 
                  name: box.name, 
                  contents: box.contents, 
                  destinationRoom: box.destinationRoom, 
                  imageUrl: box.imageUrl, 
                  ownerUid: isCurrentlySpace ? '' : box.ownerUid || '',
                  spaceUid: isCurrentlySpace ? box.ownerUid || '' : ''
                }); 
                setError(null); 
                setIsEditModalOpen(true); 
              }} variant="primary" leftIcon={<IconEdit />}>
                Edit Details
              </Button>
              <Button onClick={() => { setScanFormData({ location: box.currentLocation || '', notes: '', newStatus: box.currentStatus }); setError(null); setIsScanModalOpen(true); }} variant="success" leftIcon={<IconCamera />}>
                Update Location/Status
              </Button>
              <Button onClick={handleDelete} variant="danger" leftIcon={<IconTrash />}>
                Delete Box
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
          <h2 className="text-2xl font-semibold text-brand-primary dark:text-slate-100 mb-4">Moving History <span className="text-brand-secondary dark:text-slate-400 font-normal">({box.history.length} entries)</span></h2>
          {box.history.length > 0 ? (
            <ul className="space-y-4 max-h-[30rem] overflow-y-auto pr-2 custom-scrollbar">
              {[...box.history].sort((a,b) => b.timestamp - a.timestamp).map((entry, index) => (
                <li key={index} className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-md border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusPillStyle(entry.statusChange || ItemStatus.UNKNOWN)}`}>
                      {getItemStatusDisplayLabel(entry.statusChange || ItemStatus.UNKNOWN)}
                    </span>
                    <span className="text-xs text-brand-secondary/80 dark:text-slate-400/80">{new Date(entry.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-brand-secondary-dark dark:text-slate-300"><strong>Location:</strong> {entry.location}</p>
                  {entry.notes && <p className="text-xs text-brand-secondary dark:text-slate-400 mt-1.5 bg-brand-light-gray/30 dark:bg-slate-600/50 p-2 rounded-md border border-brand-light-gray/50 dark:border-slate-500/50"><em>Notes:</em> {entry.notes}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-brand-secondary dark:text-slate-400">
                <IconQrCode className="w-12 h-12 mx-auto mb-3 text-brand-secondary/60 dark:text-slate-500/60" />
                <p>No moving history recorded for this box yet.</p>
                <p className="text-xs mt-1">Scan the box label to track its journey to your new home.</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => !isSubmitting && setIsEditModalOpen(false)} title="Edit Box Details" size="lg">
        <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
        {error && isEditModalOpen && <Alert type="error" message={error} onClose={() => setError(null)} />}
          <Input 
            label="Box Name*" 
            id="editName" 
            value={editFormData.name || ''} 
            onChange={e => setEditFormData({...editFormData, name: e.target.value})} 
            placeholder="e.g., Kitchen Box #2 (Appliances)"
            required 
            aria-required="true"
          />
          <Textarea 
            label="Contents of Box" 
            id="editContents" 
            value={editFormData.contents || ''} 
            placeholder="e.g., Toaster, blender, coffee maker"
            onChange={e => setEditFormData({...editFormData, contents: e.target.value})} 
          />
          <Input
            label="Current Location (If changed, will add history)"
            id="editCurrentLocation" 
            type="text"
            value={editFormData.initialLocation || ''} 
            onChange={e => setEditFormData({...editFormData, initialLocation: e.target.value})}
            placeholder="e.g., Old Living Room Shelf"
            aria-describedby="editCurrentLocationHelp"
          />
          <p id="editCurrentLocationHelp" className="text-xs text-brand-secondary/80 dark:text-slate-400/80 -mt-3">Changing this updates the box's current location and adds a history entry.</p>
          <Input
            label="Destination Room" 
            id="editDestinationRoom"
            type="text"
            value={editFormData.destinationRoom || ''}
            onChange={e => setEditFormData({...editFormData, destinationRoom: e.target.value})}
            placeholder="e.g., New Office Closet"
          />
          <Input
            label="Image URL"
            id="editImageUrl"
            type="url"
            value={editFormData.imageUrl || ''}
            onChange={e => setEditFormData({...editFormData, imageUrl: e.target.value})}
            placeholder="Link to a photo of the box or its contents"
          />
          {/* Separate Person and Space Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Assign to Person"
                id="editOwnerUid"
                value={editFormData.ownerUid || ''}
                onChange={e => setEditFormData({...editFormData, ownerUid: e.target.value, spaceUid: e.target.value ? '' : editFormData.spaceUid})}
                options={peopleOptions}
              />
              {editFormData.ownerUid && (
                <div className="mt-2 flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <span 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: peopleOptions.find(p => p.value === editFormData.ownerUid)?.color || '#6B7280' }}
                  />
                  Person Assignment
                </div>
              )}
            </div>
            
            <div>
              <Select
                label="Assign to Space"
                id="editSpaceUid"
                value={editFormData.spaceUid || ''}
                onChange={e => setEditFormData({...editFormData, spaceUid: e.target.value, ownerUid: e.target.value ? '' : editFormData.ownerUid})}
                options={spaceOptions}
              />
              {editFormData.spaceUid && (
                <div className="mt-2 flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <span 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: spaceOptions.find(s => s.value === editFormData.spaceUid)?.color || '#6B7280' }}
                  />
                  Space Assignment
                </div>
              )}
            </div>
          </div>
          
          {editFormData.ownerUid && editFormData.spaceUid && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                ⚠️ Both person and space are selected. Person assignment will take priority.
              </p>
            </div>
          )}
          <div className="flex justify-end items-center gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting} leftIcon={<IconCheck />}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
          {showSuccess && <Alert type="success" message="Box details updated!" />}
        </form>
      </Modal>

      <Modal isOpen={isScanModalOpen} onClose={() => !isSubmitting && setIsScanModalOpen(false)} title="Update Box Status & Location" size="lg">
        <form onSubmit={handleScanSubmit} className="space-y-4 mt-2">
          {error && isScanModalOpen && <Alert type="error" message={error} onClose={() => setError(null)} />}
          <Input 
            label="Current Location*" 
            id="scanLocation" 
            value={scanFormData.location} 
            onChange={e => setScanFormData({...scanFormData, location: e.target.value})} 
            placeholder="e.g., Garage Shelf B"
            required 
          />
          <Select
            label="New Status*"
            id="scanNewStatus"
            value={scanFormData.newStatus}
            onChange={e => setScanFormData({...scanFormData, newStatus: e.target.value as ItemStatus})}
            options={itemStatusOptions}
          />
          <Textarea 
            label="Notes" 
            id="scanNotes" 
            value={scanFormData.notes || ''}
            onChange={e => setScanFormData({...scanFormData, notes: e.target.value})}
            placeholder="e.g., All fragile items from the living room."
            rows={3}
          />
          <div className="flex justify-end items-center gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsScanModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="success" isLoading={isSubmitting} disabled={isSubmitting} leftIcon={<IconCheck />}>
              {isSubmitting ? 'Saving...' : 'Save Update'}
            </Button>
          </div>
          {showSuccess && <Alert type="success" message="Status updated!" />}
        </form>
      </Modal>

      <TruckZoneSelectorModal
        isOpen={isTruckZoneModalOpen}
        onClose={() => {
            setIsTruckZoneModalOpen(false);
            setPendingScanForLoad(null); 
        }}
        box={box} 
        onPositionSelected={handleTruckPositionSelected}
      />

    </div>
  );
};

export default BoxDetailsPage;