
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { QRCodeScanner, ScannerError } from '@/features/boxes/components/QRCodeScanner'; // Updated import
import { useBoxes } from '@/features/boxes/hooks/useBoxes';
import { Box, ItemStatus, NewBoxData, Owner, TruckZone, VerticalPosition } from '@/types';
import Alert from '@/components/common/Alert';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import TruckZoneSelectorModal from '@/features/boxes/components/TruckZoneSelectorModal';
import QuickUnloadOptionsModal from '@/features/boxes/components/QuickUnloadOptionsModal';
import { useOwners } from '@/features/owners/hooks/useOwners';
import { useTheme } from '@/hooks/useTheme'; // Import useTheme
import { IconCamera, IconQrCode, IconCheck, IconChevronLeft, IconLightningBolt, IconXMark } from '@/lib/config/constants';
import { getItemStatusDisplayLabel } from '@/utils/statusUtils';
import { FaUpload } from 'react-icons/fa';

/**
 * A page that allows the user to scan a QR code on a box to update its
 * status and location. It also provides a "quick scan" mode for rapidly
 * loading and unloading boxes.
 * @returns {JSX.Element} The rendered ScanPage component.
 */
const BRAND_TERTIARY_COLOR = '#ff7e00';
const WHITE_COLOR = '#ffffff';
const SLATE_50_COLOR = '#f8fafc'; // For dark mode scanner line

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const DEFAULT_PREP_CONTENTS = 'Contents to be defined upon first scan.';

const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const locationHook = useLocation();
  const { getBox, updateBox, addScanEntryToBox } = useBoxes();
  const { getOwnerByUid } = useOwners();
  const { isDarkMode } = useTheme(); // Get theme status

  const isQuickScanMode = useMemo(() => locationHook.state?.isQuickScanMode === true, [locationHook.state]);

  const [scanResult, setScanResult] = useState<string | null>(null);
  const [systemError, setSystemError] = useState<string | null>(null);
  const [userFeedback, setUserFeedback] = useState<{message: string, type: 'info' | 'success' | 'error', duration?: number} | null>(null);

  const [scannedBox, setScannedBox] = useState<Box | null>(null);
  const [scannedBoxOwner, setScannedBoxOwner] = useState<Owner | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false); // Represents if scanner component thinks it can start
  const [isScannerComponentReportingCriticalError, setIsScannerComponentReportingCriticalError] = useState(false);

  const [isProcessingScan, setIsProcessingScan] = useState(false);

  const [isNewBoxDetailsModalOpen, setIsNewBoxDetailsModalOpen] = useState(false);
  const [newBoxDetailsFormData, setNewBoxDetailsFormData] = useState<Omit<Partial<NewBoxData>, 'imageUrl'>>({name: '', contents: '', initialLocation: '', destinationRoom: ''});
  const [isSubmittingNewBoxDetails, setIsSubmittingNewBoxDetails] = useState(false);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isTruckZoneModalOpen, setIsTruckZoneModalOpen] = useState(false);
  const [boxPendingLoad, setBoxPendingLoad] = useState<Box | null>(null);

  const [isQuickUnloadModalOpen, setIsQuickUnloadModalOpen] = useState(false);

  const [showImageSourceOptions, setShowImageSourceOptions] = useState(false);
  const [isCameraForPhotoActive, setIsCameraForPhotoActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const scannerFocusSide = 250;
  const scannerCornerSize = 32;
  const scannerCornerBorderWidth = 4;

  const scannerLineAndCornerColor = isQuickScanMode
    ? BRAND_TERTIARY_COLOR
    : (isDarkMode ? SLATE_50_COLOR : WHITE_COLOR);

  const styleVars = {
    '--scanner-focus-side': `${scannerFocusSide}px`,
    '--scanner-corner-size': `${scannerCornerSize}px`,
    '--scanner-corner-border-width': `${scannerCornerBorderWidth}px`,
    '--scanner-focus-offset': `calc(50% - var(--scanner-focus-side) / 2)`,
    '--scanner-blur-bg': isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)',

    '--scanner-corner-color': scannerLineAndCornerColor,
    '--scanner-line-color': scannerLineAndCornerColor,
    '--scanner-line-shadow-color': scannerLineAndCornerColor,

    '--tracer-1-bg': isQuickScanMode ? hexToRgba(BRAND_TERTIARY_COLOR, 0.6) : 'transparent',
    '--tracer-1-opacity': isQuickScanMode ? '1' : '0',
    '--tracer-1-offsetY': '-2px',

    '--tracer-2-bg': isQuickScanMode ? hexToRgba(BRAND_TERTIARY_COLOR, 0.3) : 'transparent',
    '--tracer-2-opacity': isQuickScanMode ? '1' : '0',
    '--tracer-2-offsetY': '-4px',
  } as React.CSSProperties;

  useEffect(() => {
    const timer = setTimeout(() => setIsCameraReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const scannerEnabled = isCameraReady &&
                         !systemError &&
                         !isProcessingScan &&
                         !isNewBoxDetailsModalOpen &&
                         !isTruckZoneModalOpen &&
                         !isQuickUnloadModalOpen &&
                         !isScannerComponentReportingCriticalError;


  const stopCameraStream = useCallback(() => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraForPhotoActive(false);
  }, []);

  const resetScannerStates = useCallback((keepSystemErrorFlag: boolean = false) => {
    setScanResult(null);
    setScannedBox(null);
    setScannedBoxOwner(null);
    if (!keepSystemErrorFlag) {
      setSystemError(null);
      setIsScannerComponentReportingCriticalError(false); 
    }
    setIsNewBoxDetailsModalOpen(false);
    setIsTruckZoneModalOpen(false);
    setIsQuickUnloadModalOpen(false);
    setBoxPendingLoad(null);
    setNewBoxDetailsFormData({name: '', contents: '', initialLocation: '', destinationRoom: ''});
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowImageSourceOptions(false);
    if (isCameraForPhotoActive) stopCameraStream();
    setIsProcessingScan(false); 
  }, [isCameraForPhotoActive, stopCameraStream]);


  const setFeedbackAndResetContext = useCallback((message: string, type: 'info' | 'success' | 'error', duration: number = 3000, keepSystemErrorOnError: boolean = false) => {
    setUserFeedback({ message, type, duration });
    const shouldKeepSysError = type === 'error' && keepSystemErrorOnError;
    resetScannerStates(shouldKeepSysError); 
    if (type !== 'error' || !shouldKeepSysError) {
        if (!shouldKeepSysError) {
            setSystemError(null);
            setIsScannerComponentReportingCriticalError(false);
        }
    }
  }, [resetScannerStates]);


  const handleScanSuccess = useCallback((decodedText: string) => {
    if (isProcessingScan || isNewBoxDetailsModalOpen || isTruckZoneModalOpen || isQuickUnloadModalOpen || systemError || isScannerComponentReportingCriticalError) {
        return; 
    }

    setIsProcessingScan(true); 
    setScanResult(decodedText);
    setUserFeedback({ message: `Processing scan: ${decodedText.substring(0,10)}...`, type: 'info', duration: 1500 });

    const box = getBox(decodedText);
    if (!box) {
      setFeedbackAndResetContext(`Box with QR ID "${decodedText.substring(0,10)}..." not found. Ensure labels are printed.`, 'error', 5000, true);
      return;
    }
    
    setScannedBox(box);

    const ownerDetails = box.ownerUid ? getOwnerByUid(box.ownerUid) : null;
    if (ownerDetails) {
      setScannedBoxOwner(ownerDetails);
    }

    // Don't prefill name and initial location for first scan
    setNewBoxDetailsFormData({
        name: '',
        contents: box.contents === DEFAULT_PREP_CONTENTS ? '' : (box.contents || ''),
        initialLocation: '',
        destinationRoom: box.destinationRoom || '',
    });

    if (box.imageUrl && box.imageUrl.startsWith('data:image')) {
      setImagePreviewUrl(box.imageUrl);
    } else {
      setImagePreviewUrl(null);
    }

    if (isQuickScanMode) {
      if (box.currentStatus === ItemStatus.PACKED) {
        setBoxPendingLoad(box);
        setIsTruckZoneModalOpen(true); 
      } else if (box.currentStatus === ItemStatus.LOADED) {
        setIsQuickUnloadModalOpen(true); 
      } else {
        setFeedbackAndResetContext(`Quick Scan: Box "${box.name}" is ${getItemStatusDisplayLabel(box.currentStatus)}. Not scannable for quick load/unload.`, 'info', 4000);
      }
    } else { 
      if (box.currentStatus === ItemStatus.PREPARED) {
        setIsNewBoxDetailsModalOpen(true); 
      } else {
        setUserFeedback({ message: `Box "${box.name}" found. Navigating to details...`, type: 'success', duration: 1800 });
        setTimeout(() => {
          if (!isNewBoxDetailsModalOpen) { 
             navigate(`/app/box/${box.id}?action=scanned`);
          }
        }, 1500);
      }
    }
    
    if (!isNewBoxDetailsModalOpen && !isTruckZoneModalOpen && !isQuickUnloadModalOpen && !(isQuickScanMode && (box.currentStatus === ItemStatus.PACKED || box.currentStatus === ItemStatus.LOADED)) && !(box.currentStatus === ItemStatus.PREPARED && !isQuickScanMode)) {
         if (!isQuickScanMode && box.currentStatus !== ItemStatus.PREPARED) {
         } else {
         }
    }

  }, [
    isProcessingScan, isNewBoxDetailsModalOpen, isTruckZoneModalOpen, isQuickUnloadModalOpen, systemError, isScannerComponentReportingCriticalError,
    getBox, getOwnerByUid, isQuickScanMode, navigate,
    setFeedbackAndResetContext 
  ]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(scannedBox?.imageUrl?.startsWith('data:image') ? scannedBox.imageUrl : null);
    }
    setShowImageSourceOptions(false);
  };

  const handleRemoveImage = () => {
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowImageSourceOptions(false);
    if (isCameraForPhotoActive) stopCameraStream();
  };

  const startCameraStream = async () => {
    if (isCameraForPhotoActive || !videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      videoRef.current.srcObject = stream;
      await videoRef.current.play(); // Explicitly play the video
      cameraStreamRef.current = stream;
      setIsCameraForPhotoActive(true);
      setShowImageSourceOptions(false);
    } catch (err) {
      console.error("Error accessing camera for photo:", err);
      setUserFeedback({message: "Could not access camera. Check permissions.", type: 'error'});
      setIsCameraForPhotoActive(false);
      setShowImageSourceOptions(false);
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !photoCanvasRef.current || !videoRef.current.videoWidth) {
      console.warn("Video stream not ready for capture or video dimensions are zero.");
      setUserFeedback({message: "Photo capture failed. Video stream might not be ready.", type: 'error'});
      return;
    }
    const video = videoRef.current;
    const canvas = photoCanvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setImagePreviewUrl(dataUrl);
    }
    stopCameraStream();
  };

  useEffect(() => {
    return () => {
      if (cameraStreamRef.current) {
        stopCameraStream();
      }
    };
  }, [stopCameraStream]);


  const handleScanError = useCallback((error: ScannerError) => {
    console.error("ScanPage: Critical scanner error reported by QRCodeScanner component:", error.code, error.message, error.rawError);
    
    setSystemError(`Scanner Error: ${error.message}. Please try reloading the page or check camera permissions.`);
    setIsScannerComponentReportingCriticalError(true); 
    
    setUserFeedback(null); 
    setIsCameraReady(false); 
    
    if (isProcessingScan) {
        setIsProcessingScan(false); 
    }

  }, [isProcessingScan]); 


  const handleNewBoxDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting box save process...');
    const targetBoxForDetails = scannedBox;

    if (!targetBoxForDetails) {
      const errorMsg = 'No box selected for saving';
      console.error(errorMsg);
      setUserFeedback({message: errorMsg, type: 'error'});
      return;
    }

    if (!newBoxDetailsFormData.name || !newBoxDetailsFormData.initialLocation || !newBoxDetailsFormData.destinationRoom) {
      const errorMsg = 'Box Name, Initial Packing Location, and Destination Room are required.';
      console.error(errorMsg);
      setUserFeedback({message: errorMsg, type: 'error'});
      return;
    }

    setIsSubmittingNewBoxDetails(true);
    setUserFeedback(null);

    console.log('Preparing to save box with data:', {
      boxId: targetBoxForDetails.id,
      formData: newBoxDetailsFormData,
      hasNewImage: !!imagePreviewUrl
    });

    try {
      const updatedBoxData: Partial<Omit<Box, 'id'>> = {
        name: newBoxDetailsFormData.name,
        contents: newBoxDetailsFormData.contents,
        currentLocation: newBoxDetailsFormData.initialLocation,
        destinationRoom: newBoxDetailsFormData.destinationRoom,
        ownerUid: targetBoxForDetails.ownerUid,
        currentStatus: ItemStatus.PACKED,
        // Only include imageUrl if we have a new image to set
        // This preserves the existing image if no new one is provided
        ...(imagePreviewUrl && { imageUrl: imagePreviewUrl })
      };
      
      console.log('Updating box with data:', updatedBoxData);
      
      // Update the box first
      try {
        await updateBox(targetBoxForDetails.id, updatedBoxData);
        console.log('Box update successful');
      } catch (updateError) {
        console.error('Error updating box:', updateError);
        throw new Error(`Failed to update box: ${updateError instanceof Error ? updateError.message : 'Unknown error'}`);
      }
      
      // Then add the scan entry
      const scanData = {
        location: updatedBoxData.currentLocation || "Packing Area",
        notes: `Box details confirmed and packed. Destination: ${updatedBoxData.destinationRoom}.`,
        newStatus: ItemStatus.PACKED
      };
      
      console.log('Adding scan entry:', scanData);
      
      try {
        await addScanEntryToBox(targetBoxForDetails.id, scanData);
        console.log('Scan entry added successfully');
      } catch (scanError) {
        console.error('Error adding scan entry:', scanError);
        throw new Error(`Box saved but failed to add scan entry: ${scanError instanceof Error ? scanError.message : 'Unknown error'}`);
      }

      // Get the updated box with all fields
      const packedBox = getBox(targetBoxForDetails.id);
      if (!packedBox) {
        const errorMsg = 'Failed to retrieve updated box information';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      console.log('Box saved successfully:', packedBox);

      if (isQuickScanMode) {
        const successMsg = `Box "${packedBox.name}" packed. Select truck zone.`;
        console.log(successMsg);
        setUserFeedback({message: successMsg, type: 'success', duration: 2000});
        setBoxPendingLoad(packedBox);
        setIsTruckZoneModalOpen(true); 
      } else {
        const successMsg = `Box "${packedBox.name}" packed successfully.`;
        console.log(successMsg);
        setFeedbackAndResetContext(successMsg, 'success', 3000);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save box details.";
      console.error('Error in handleNewBoxDetailsSubmit:', errorMsg, err);
      
      if (isNewBoxDetailsModalOpen) { 
        setUserFeedback({message: errorMsg, type: 'error'});
      } else { 
        setFeedbackAndResetContext(errorMsg, 'error', 4000, true);
      }
      
      // Re-throw the error to see it in the console
      if (err instanceof Error) {
        console.error('Error details:', err);
      }
    } finally {
      console.log('Finishing box save process');
      setIsSubmittingNewBoxDetails(false);
    }
  };

  const handleTruckPlacementConfirmed = async (boxId: string, zone: TruckZone, verticalPosition: VerticalPosition) => {
    const boxToLoad = getBox(boxId); 
    setIsTruckZoneModalOpen(false); 

    if (!boxToLoad) {
      setFeedbackAndResetContext("Error: Box to load not found.", 'error', 4000, true);
      setBoxPendingLoad(null);
      return;
    }

    try {
      await updateBox(boxToLoad.id, {
        currentStatus: ItemStatus.LOADED,
        currentLocation: "On Truck",
        truckZone: zone,
        truckVerticalPosition: verticalPosition,
      });
      await addScanEntryToBox(boxToLoad.id, {
        location: `On Truck - ${zone}`,
        notes: `Placed at ${verticalPosition}.`,
        newStatus: ItemStatus.LOADED
      });
      setFeedbackAndResetContext(`Box "${boxToLoad.name}" loaded into ${zone} (${verticalPosition}).`, 'success', 2500);
    } catch (err) {
      setFeedbackAndResetContext(err instanceof Error ? err.message : "Failed to finalize box loading.", 'error', 4000, true);
    } finally {
      setBoxPendingLoad(null); 
    }
  };

  const handleQuickDeliver = async (boxToDeliver: Box) => {
    setIsQuickUnloadModalOpen(false); 
    if (!boxToDeliver.destinationRoom) {
        setFeedbackAndResetContext(`Error: Box "${boxToDeliver.name}" has no destination room defined. Cannot Quick Deliver.`, 'error', 5000, true);
        return;
    }
    try {
      setIsProcessingScan(true);
      await updateBox(boxToDeliver.id, { 
        currentStatus: ItemStatus.DELIVERED, 
        currentLocation: boxToDeliver.destinationRoom 
      });
      await addScanEntryToBox(boxToDeliver.id, {
        location: boxToDeliver.destinationRoom,
        notes: "Quick Scan: Delivered to destination room.",
        newStatus: ItemStatus.DELIVERED
      });
      setScannedBox(null);
      setIsProcessingScan(false);
      setFeedbackAndResetContext(`Box "${boxToDeliver.name}" delivered to ${boxToDeliver.destinationRoom}.`, 'success', 2500);
    } catch (err) {
      setIsProcessingScan(false);
      setScannedBox(null);
      setFeedbackAndResetContext(err instanceof Error ? err.message : "Failed to deliver box.", 'error', 4000, true);
    }
  };

  const handleQuickStage = async (boxToStage: Box, stagingLocationValue: string) => {
    setIsQuickUnloadModalOpen(false); 
    try {
      setIsProcessingScan(true);
      await updateBox(boxToStage.id, { 
        currentStatus: ItemStatus.UNLOADED, 
        currentLocation: stagingLocationValue 
      });
      await addScanEntryToBox(boxToStage.id, {
        location: stagingLocationValue,
        notes: "Quick Scan: Moved to staging area.",
        newStatus: ItemStatus.UNLOADED
      });
      setScannedBox(null);
      setIsProcessingScan(false);
      setFeedbackAndResetContext(`Box "${boxToStage.name}" moved to staging: ${stagingLocationValue}.`, 'success', 2500);
    } catch (err) {
      setIsProcessingScan(false);
      setScannedBox(null);
      setFeedbackAndResetContext(err instanceof Error ? err.message : "Failed to stage box.", 'error', 4000, true);
    }
  };

  const handleQuickUnloadModalClose = useCallback(() => {
    setIsQuickUnloadModalOpen(false);
    // Reset processing state when modal is closed without taking action
    setIsProcessingScan(false);
    setScannedBox(null);
  }, []);

  const handleCancelAndRescan = useCallback(() => {
    const message = isQuickScanMode ? "Quick Scan reset. Ready for next." : "Scan reset. Ready for next.";
    setFeedbackAndResetContext(message, 'info', 2000, !!systemError || isScannerComponentReportingCriticalError);
  }, [isQuickScanMode, setFeedbackAndResetContext, systemError, isScannerComponentReportingCriticalError]);

  const newBoxDetailsModalSubmitText = isQuickScanMode ? "Save & Load to Truck" : "Save & Pack Box";

  const packBoxModalFooter = (
    <div className="flex justify-end space-x-3">
      <Button type="button" variant="secondary" onClick={() => { setIsNewBoxDetailsModalOpen(false); handleCancelAndRescan(); if (isCameraForPhotoActive) stopCameraStream(); }} disabled={isSubmittingNewBoxDetails} className="text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white">
        Cancel & Rescan
      </Button>
      <Button type="submit" variant="primary" isLoading={isSubmittingNewBoxDetails} leftIcon={<IconCheck />} form="packBoxForm">
          {isSubmittingNewBoxDetails ? 'Saving...' : newBoxDetailsModalSubmitText}
      </Button>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
            <IconCamera className="w-8 h-8 text-brand-tertiary dark:text-orange-400" />
            <h1 className="text-3xl font-bold text-brand-primary dark:text-slate-100">Scan Box Label</h1>
        </div>
        <Link
            to="/app/scan"
            state={{ isQuickScanMode: !isQuickScanMode }}
            className="text-sm text-brand-secondary dark:text-slate-400 hover:text-brand-primary dark:hover:text-slate-200 flex items-center px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label={`Switch to ${isQuickScanMode ? 'Standard' : 'Quick'} Scan Mode`}
        >
            {isQuickScanMode ? <IconChevronLeft className="w-4 h-4 mr-1"/> : <IconLightningBolt className="w-4 h-4 mr-1 text-yellow-500 dark:text-yellow-400" />}
            {isQuickScanMode ? 'Standard Scan' : 'Quick Scan'}
        </Link>
      </div>

      {isQuickScanMode && (
        <div className="mb-4 p-3 bg-brand-tertiary/10 dark:bg-orange-500/10 border border-brand-tertiary/30 dark:border-orange-500/30 rounded-lg text-center animate-pulse-bg-once" style={{ '--tw-bg-green-100': 'var(--tw-color-brand-tertiary-10)' } as React.CSSProperties}>
            <p className="font-semibold text-brand-tertiary dark:text-orange-400 flex items-center justify-center"><IconLightningBolt className="w-5 h-5 mr-1.5 text-yellow-500 dark:text-yellow-400"/> Quick Scan Mode Active</p>
        </div>
      )}
      <p className="text-brand-secondary dark:text-slate-300 mb-6">
        {isQuickScanMode
            ? "Scan a PACKED box to load it, or a LOADED box to unload."
            : "Position a box's QR label within the square. For PREP labels, you'll enter details to pack it."
        }
      </p>

      <div className="min-h-[4.5rem] mb-0">
        {systemError && <Alert type="error" message={systemError} onClose={() => {setSystemError(null); setIsScannerComponentReportingCriticalError(false); if (!isCameraReady) window.location.reload();}} className="mb-4"/>}
        {userFeedback && !systemError && <Alert type={userFeedback.type} message={userFeedback.message} onClose={() => setUserFeedback(null)} duration={userFeedback.duration} className="mb-4"/>}
      </div>

      <div
        className="my-6 w-full aspect-square max-w-md mx-auto rounded-xl overflow-hidden shadow-xl bg-slate-800 dark:bg-slate-900 relative"
        style={styleVars}
      >
        {(!isCameraReady || systemError || isScannerComponentReportingCriticalError) && !scannerEnabled && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 bg-slate-700 dark:bg-slate-800 z-20 p-4 text-center">
            {systemError || isScannerComponentReportingCriticalError ? (
                <>
                    <IconXMark className="h-10 w-10 text-red-400 mb-3" />
                    <p className="font-semibold">Scanner Unavailable</p>
                    <p className="text-xs mt-1">{systemError || "A critical scanner error occurred."}</p>
                     <Button variant="primary" onClick={() => window.location.reload()} className="mt-4"> Reload & Retry Camera </Button>
                </>
            ) : (
                 <>
                    <svg aria-hidden="true" className="animate-spin h-8 w-8 text-brand-tertiary dark:text-orange-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <title>Loading camera</title>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Preparing scanner...
                    <p className="text-xs mt-2 text-slate-400">Please grant camera permission if prompted.</p>
                 </>
            )}
          </div>
        )}

        <QRCodeScanner
            key={isQuickScanMode.toString()}
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
            fps={5}
            enabled={scannerEnabled}
            verbose={true}
        />

        {scannerEnabled && isProcessingScan && !isNewBoxDetailsModalOpen && !isTruckZoneModalOpen && !isQuickUnloadModalOpen && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 bg-slate-700/80 dark:bg-slate-800/80 z-20">
                <IconQrCode className="h-12 w-12 text-brand-tertiary dark:text-orange-400 mb-3" />
                Processing Scan...
            </div>
        )}

        {scannerEnabled && ( 
          <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
            <div className="absolute top-0 left-0 right-0 h-[var(--scanner-focus-offset)] backdrop-blur-sm" style={{backgroundColor: 'var(--scanner-blur-bg)'}}></div>
            <div className="absolute bottom-0 left-0 right-0 h-[var(--scanner-focus-offset)] backdrop-blur-sm" style={{backgroundColor: 'var(--scanner-blur-bg)'}}></div>
            <div className="absolute left-0 w-[var(--scanner-focus-offset)] backdrop-blur-sm" style={{ top: 'var(--scanner-focus-offset)', bottom: 'var(--scanner-focus-offset)', backgroundColor: 'var(--scanner-blur-bg)'}}></div>
            <div className="absolute right-0 w-[var(--scanner-focus-offset)] backdrop-blur-sm" style={{ top: 'var(--scanner-focus-offset)', bottom: 'var(--scanner-focus-offset)', backgroundColor: 'var(--scanner-blur-bg)'}}></div>

            <div
              className="absolute"
              style={{
                width: 'var(--scanner-focus-side)',
                height: 'var(--scanner-focus-side)',
                top: 'var(--scanner-focus-offset)',
                left: 'var(--scanner-focus-offset)',
              }}
            >
              <div className="absolute top-0 left-0 rounded-tl-lg" style={{width: 'var(--scanner-corner-size)', height: 'var(--scanner-corner-size)', borderTop: 'var(--scanner-corner-border-width) solid var(--scanner-corner-color)', borderLeft: 'var(--scanner-corner-border-width) solid var(--scanner-corner-color)'}}></div>
              <div className="absolute top-0 right-0 rounded-tr-lg" style={{width: 'var(--scanner-corner-size)', height: 'var(--scanner-corner-size)', borderTop: 'var(--scanner-corner-border-width) solid var(--scanner-corner-color)', borderRight: 'var(--scanner-corner-border-width) solid var(--scanner-corner-color)'}}></div>
              <div className="absolute bottom-0 left-0 rounded-bl-lg" style={{width: 'var(--scanner-corner-size)', height: 'var(--scanner-corner-size)', borderBottom: 'var(--scanner-corner-border-width) solid var(--scanner-corner-color)', borderLeft: 'var(--scanner-corner-border-width) solid var(--scanner-corner-color)'}}></div>
              <div className="absolute bottom-0 right-0 rounded-br-lg" style={{width: 'var(--scanner-corner-size)', height: 'var(--scanner-corner-size)', borderBottom: 'var(--scanner-corner-border-width) solid var(--scanner-corner-color)', borderRight: 'var(--scanner-corner-border-width) solid var(--scanner-corner-color)'}}></div>

              {scannerEnabled && !scanResult && ( 
                <div
                  className="scan-line-element absolute w-[96%] h-0.5 animate-scan-line"
                  style={{
                    marginLeft: '2%',
                    backgroundColor: 'var(--scanner-line-color)',
                    boxShadow: '0 0 8px 0px var(--scanner-line-shadow-color)',
                    filter: 'brightness(1.2)',
                  }}
                ></div>
              )}
            </div>
          </div>
        )}
      </div>

      {scanResult && !systemError && !isScannerComponentReportingCriticalError && isProcessingScan && !isNewBoxDetailsModalOpen && !isTruckZoneModalOpen && !isQuickUnloadModalOpen && !userFeedback?.message.includes("Processing") &&(
        <div className={`mt-6 p-4 rounded-lg transition-all duration-300 ease-in-out ${userFeedback?.type === 'error' ? 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-600/50' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-600/50'}`}>
          <div className="flex items-center space-x-2">
            <IconQrCode className={`w-6 h-6 ${userFeedback?.type === 'error'? 'text-red-600 dark:text-dark-red-error' : 'text-green-600 dark:text-dark-green-success'}`}/>
            <h3 className={`text-lg font-semibold ${userFeedback?.type === 'error'? 'text-red-700 dark:text-dark-red-error' : 'text-green-700 dark:text-dark-green-success'}`}>
                {userFeedback?.type === 'error' ? "Error After Scan" : "Scan Processed"}
            </h3>
          </div>
           <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            QR Value: <span className="font-mono bg-slate-200 dark:bg-slate-700 dark:text-slate-200 px-1 py-0.5 rounded">{scanResult}</span>
          </p>
          {scannedBox?.name && userFeedback?.type !== 'error' && <p className="text-sm text-slate-600 dark:text-slate-300">Box Name: <strong className="dark:text-slate-100">{scannedBox.name}</strong></p>}
          {userFeedback?.type === 'error' && <p className="text-sm text-red-600 dark:text-dark-red-error mt-1">{userFeedback.message}</p>}

          <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {userFeedback?.type === 'error' && !scannedBox && ( 
                 <Button variant="warning" className="w-full sm:w-auto" onClick={() => navigate(`/app/owners`)}> Print Labels via Owners </Button>
            )}
             <Button variant="secondary" onClick={handleCancelAndRescan} className="w-full sm:w-auto"> Scan Another </Button>
          </div>
        </div>
      )}
      {(systemError || isScannerComponentReportingCriticalError) && ( 
           <Button variant="primary" onClick={() => window.location.reload()} className="w-full mt-4"> Reload Page & Retry Camera </Button>
      )}

      <Modal
        isOpen={isNewBoxDetailsModalOpen}
        onClose={() => {
          if (!isSubmittingNewBoxDetails) {
            setIsNewBoxDetailsModalOpen(false); 
            handleCancelAndRescan();
            if (isCameraForPhotoActive) stopCameraStream();
          }
        }}
        title={`Pack Box: ${scannedBox?.id.substring(0,10) || ''}...`}
        size="lg"
        footer={packBoxModalFooter}
      >
        <form onSubmit={handleNewBoxDetailsSubmit} id="packBoxForm" className="space-y-4 mt-2">
          {userFeedback?.type === 'error' && isNewBoxDetailsModalOpen && <Alert type="error" message={userFeedback.message} onClose={() => setUserFeedback(null)} />}
          {systemError && isNewBoxDetailsModalOpen && <Alert type="error" message={systemError} onClose={() => setSystemError(null)} />}


          {scannedBoxOwner && (
            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600">
              <label htmlFor="fixedOwnerDisplay" className="block text-sm font-medium text-brand-secondary dark:text-slate-300 mb-1">Assigned Owner (Fixed):</label>
              <div id="fixedOwnerDisplay" className="flex items-center">
                <span
                  className="w-5 h-5 rounded-full inline-block mr-2 border border-slate-400 dark:border-slate-500"
                  style={{ backgroundColor: scannedBoxOwner.color }}
                  aria-label={`Color swatch for owner ${scannedBoxOwner.firstName} ${scannedBoxOwner.lastName || ''}`}
                ></span>
                <span className="text-brand-primary dark:text-slate-100 font-semibold">
                  {scannedBoxOwner.firstName} {scannedBoxOwner.lastName || ''} ({scannedBoxOwner.uid})
                </span>
              </div>
            </div>
          )}

          <Input
            label="Box Name*"
            id="newBoxName"
            value={newBoxDetailsFormData.name || ''}
            onChange={e => setNewBoxDetailsFormData({...newBoxDetailsFormData, name: e.target.value})}
            placeholder="e.g., Living Room Books, Kitchen Fragiles #1"
            required
            aria-required="true"
          />
          <Textarea
            label="Contents of Box (Optional)"
            id="newBoxContents"
            value={newBoxDetailsFormData.contents || ''}
            placeholder="List key items, e.g., All fiction books, photo albums, fragile glassware"
            onChange={e => setNewBoxDetailsFormData({...newBoxDetailsFormData, contents: e.target.value})}
          />
          <Input
            label="Initial Packing Location*"
            id="newBoxInitialLocation"
            type="text"
            value={newBoxDetailsFormData.initialLocation || ''}
            onChange={e => setNewBoxDetailsFormData({...newBoxDetailsFormData, initialLocation: e.target.value})}
            placeholder="e.g., Old House - Study Shelf, Garage Pile"
            required
            aria-required="true"
          />
          <Input
            label="Destination Room in New Home*"
            id="newBoxDestinationRoom"
            type="text"
            value={newBoxDetailsFormData.destinationRoom || ''}
            onChange={e => setNewBoxDetailsFormData({...newBoxDetailsFormData, destinationRoom: e.target.value})}
            placeholder="e.g., New House - Office, Kitchen Pantry"
            required
            aria-required="true"
          />
          <div>
            <label className="block text-sm font-medium text-brand-secondary dark:text-slate-300 mb-1">Box Image (Optional)</label>

            {!imagePreviewUrl && !isCameraForPhotoActive && !showImageSourceOptions && (
              <Button type="button" variant="secondary" onClick={() => setShowImageSourceOptions(true)} leftIcon={<IconCamera className="w-4 h-4"/>}>
                Add Image
              </Button>
            )}

            {showImageSourceOptions && (
              <div className="flex items-center space-x-2">
                <Button type="button" variant="secondary" onClick={startCameraStream} leftIcon={<IconCamera className="w-4 h-4"/>}>
                  Take Photo
                </Button>
                <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} leftIcon={<FaUpload className="w-4 h-4"/>}>
                  Choose File
                </Button>
                 <Button type="button" variant="ghost" onClick={() => setShowImageSourceOptions(false)} className="text-sm">
                  Cancel
                </Button>
              </div>
            )}

            {isCameraForPhotoActive && (
              <div className="my-2 p-2 border dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700">
                <video ref={videoRef} playsInline autoPlay className="w-full h-auto rounded shadow" style={{ maxHeight: '280px' }} />
                <canvas ref={photoCanvasRef} className="hidden" />
                <div className="mt-2 flex space-x-2">
                  <Button type="button" variant="primary" onClick={handleCapturePhoto} leftIcon={<IconCheck className="w-4 h-4" />}>Capture</Button>
                  <Button type="button" variant="secondary" onClick={stopCameraStream} leftIcon={<IconXMark className="w-4 h-4" />}>Cancel Camera</Button>
                </div>
              </div>
            )}

            {imagePreviewUrl && !isCameraForPhotoActive && (
              <div className="mt-3 relative w-32 h-32 border border-slate-200 dark:border-slate-600 p-1 rounded-md bg-slate-50 dark:bg-slate-700">
                <img src={imagePreviewUrl} alt="Box preview" className="rounded-md object-cover w-full h-full shadow-sm" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 rounded-full p-0.5 bg-red-500 hover:bg-red-700 text-white shadow-md h-6 w-6 flex items-center justify-center"
                  onClick={handleRemoveImage}
                  aria-label="Remove image"
                >
                  <IconXMark className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageFileChange} ref={fileInputRef} className="hidden" id="boxImageUpload" />
          </div>
        </form>
      </Modal>

      <TruckZoneSelectorModal
        isOpen={isTruckZoneModalOpen}
        onClose={() => {
          setIsTruckZoneModalOpen(false); 
          setBoxPendingLoad(null);
          handleCancelAndRescan();
        }}
        box={boxPendingLoad || scannedBox}
        onPositionSelected={handleTruckPlacementConfirmed}
      />

      <QuickUnloadOptionsModal
        isOpen={isQuickUnloadModalOpen}
        onClose={handleQuickUnloadModalClose}
        box={scannedBox}
        onDeliver={handleQuickDeliver}
        onStage={handleQuickStage}
      />

    </div>
  );
};

export default ScanPage;
