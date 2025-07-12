
import React, { useEffect, useRef, useState, useId } from 'react';
import { IconSpinner, IconWarning } from '../constants';

declare global {
  interface Window {
    Html5Qrcode: any; // Constructor for Html5Qrcode
    Html5QrcodeScannerState?: {
        NOT_STARTED?: number;
        SCANNING?: number;
        PAUSED?: number;
        STOPPED?: number;
    };
    // Define Html5QrcodeError and Html5QrcodeErrorTypes if not globally available from the library
    Html5QrcodeError: any; 
    Html5QrcodeErrorTypes: {
        IMPLEMENTATION_ERROR: 0;
        UNKNOWN_ERROR: 1;
    };
  }
}

interface QRCodeScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: any) => void;
  onScanError?: (error: ScannerError) => void;
  fps?: number;
  qrbox?: number | { width: number; height: number };
  verbose?: boolean;
  className?: string;
  enabled: boolean;
}

enum ScannerInternalState {
  IDLE = 'IDLE',
  INITIALIZING = 'INITIALIZING',
  SCANNING = 'SCANNING',
  STOPPING = 'STOPPING',
  ERROR = 'ERROR',
}

export interface ScannerError {
  code: 'NO_LIBRARY' | 'CONSTRUCTION_FAILED' | 'PERMISSION_DENIED' | 'NO_CAMERA_FOUND' | 'START_FAILED' | 'STOP_FAILED';
  message: string;
  rawError?: any;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScanSuccess,
  onScanError = (err) => console.warn("Default QR Scan Error Handler:", err.code, err.message, err.rawError),
  fps = 5,
  qrbox,
  verbose = false,
  className = "w-full h-full",
  enabled,
}) => {
  const readerElementId = `qr-reader-${useId()}`;
  const html5QrCodeRef = useRef<any>(null);
  const [scannerState, setScannerState] = useState<ScannerInternalState>(ScannerInternalState.IDLE);
  const [lastError, setLastError] = useState<ScannerError | null>(null);
  const operationLockRef = useRef<boolean>(false); 

  const reportError = (error: ScannerError) => {
    setLastError(error);
    setScannerState(ScannerInternalState.ERROR);
    if (onScanError) {
      onScanError(error);
    }
  };

  useEffect(() => {
    let didCancel = false;

    const startScanner = async () => {
      if (didCancel || operationLockRef.current) {
        if(operationLockRef.current && !didCancel) {
             console.warn("QRCodeScanner: Start requested while an operation is locked.");
        }
        return;
      }
      operationLockRef.current = true;
      setScannerState(ScannerInternalState.INITIALIZING);
      setLastError(null);

      if (typeof window.Html5Qrcode === 'undefined') {
        reportError({ code: 'NO_LIBRARY', message: "Html5Qrcode library not loaded." });
        operationLockRef.current = false;
        return;
      }

      if (!html5QrCodeRef.current) {
        try {
            html5QrCodeRef.current = new window.Html5Qrcode(readerElementId, { verbose });
        } catch (e: any) {
            reportError({ code: 'CONSTRUCTION_FAILED', message: `Failed to instantiate Html5Qrcode: ${e.message || e.toString()}`, rawError: e });
            operationLockRef.current = false;
            return;
        }
      }
      const localHtml5QrCode = html5QrCodeRef.current;

      try {
        // Check for camera permissions and existence first.
        // This can throw if no cameras or permission denied.
        const cameras = await window.Html5Qrcode.getCameras();
        if (didCancel) { operationLockRef.current = false; return; }

        if (!cameras || cameras.length === 0) {
          reportError({ code: 'NO_CAMERA_FOUND', message: "No cameras found on this device." });
          operationLockRef.current = false;
          return;
        }
        
        const rearCamera = cameras.find((device: any) => device.label.toLowerCase().includes('back'));
        const cameraId = rearCamera ? rearCamera.id : cameras[0].id;

        const config: { fps: number; qrbox?: any; aspectRatio?: number } = { fps };
        if (qrbox) config.qrbox = qrbox;
        
        if (localHtml5QrCode.getState && localHtml5QrCode.getState() === window.Html5QrcodeScannerState?.SCANNING) {
             if (verbose) console.log("QRCodeScanner: Attempted to start while already scanning. Will try to stop first.");
             try {
                await localHtml5QrCode.stop();
             } catch (stopErr: any) {
                if (verbose) console.warn("QRCodeScanner: Error stopping scanner before restart:", stopErr.message || stopErr);
             }
             if (didCancel) { operationLockRef.current = false; return; }
        }

        await localHtml5QrCode.start(
          cameraId,
          config,
          (decodedText: string, decodedResult: any) => { // Success callback (per-frame)
            if (!didCancel) onScanSuccess(decodedText, decodedResult);
          },
          (errorMessage: string, errorDetails: any) => { // Error callback (per-frame)
            if (didCancel) return;
            // This callback signifies failure to decode a QR in the current frame.
            // It is NOT a critical error for the scanner component itself.
            // Log if verbose, but do not call reportError or onScanError prop.
            if (verbose) {
              console.log(`QRCodeScanner (Verbose): Per-frame scan feedback: ${errorMessage}`, errorDetails);
            }
          }
        );
        // If .start() promise resolves, scanner has started successfully.
        if (didCancel) { 
          if (localHtml5QrCode.getState && localHtml5QrCode.getState() === window.Html5QrcodeScannerState?.SCANNING) {
            await localHtml5QrCode.stop().catch((e: any) => {if (verbose) console.error("Error stopping scanner during cancel in start:", e.message || e)});
          }
          operationLockRef.current = false;
          return;
        }
        setScannerState(ScannerInternalState.SCANNING);

      } catch (err: any) { // Catches errors from getCameras() or localHtml5QrCode.start() promise rejection
        if (didCancel) { operationLockRef.current = false; return; }
        let errorCode: ScannerError['code'] = 'START_FAILED';
        let message = `Failed to start QR scanner: ${err.message || err.toString()}`;

        if (err.name === "NotAllowedError" || err.message?.toLowerCase().includes('permission denied')) {
          errorCode = 'PERMISSION_DENIED';
          message = "Camera permission denied. Please enable camera access in your browser settings.";
        } else if (err.name === "NotFoundError" || err.message?.toLowerCase().includes('requested device not found')) {
           errorCode = 'NO_CAMERA_FOUND';
           message = "No suitable camera found or camera is already in use.";
        } else if (err.message?.toLowerCase().includes("no cameras found")) { // From getCameras() perhaps
           errorCode = 'NO_CAMERA_FOUND';
           message = "No cameras found on this device.";
        }
        reportError({ code: errorCode, message: message, rawError: err });
      } finally {
        operationLockRef.current = false;
      }
    };

    const stopScanner = async () => {
      if (didCancel || operationLockRef.current) {
         if(operationLockRef.current && !didCancel && verbose) {
            console.warn("QRCodeScanner: Stop requested while an operation is locked.");
        }
        return;
      }
      const localHtml5QrCode = html5QrCodeRef.current;
      if (!localHtml5QrCode) {
        setScannerState(ScannerInternalState.IDLE);
        return;
      }
      
      const scannerLibState = localHtml5QrCode.getState && localHtml5QrCode.getState();
      if (scannerLibState !== window.Html5QrcodeScannerState?.SCANNING &&
          scannerLibState !== window.Html5QrcodeScannerState?.PAUSED) {
        if (verbose) console.log("QRCodeScanner: Stop called but scanner not in a stoppable state (SCANNING/PAUSED). Current state:", scannerLibState);
        setScannerState(ScannerInternalState.IDLE); 
        return;
      }

      operationLockRef.current = true;
      setScannerState(ScannerInternalState.STOPPING);
      setLastError(null);

      try {
        await localHtml5QrCode.stop();
        if (didCancel) { operationLockRef.current = false; return; }
        setScannerState(ScannerInternalState.IDLE);
      } catch (err: any) {
        if (didCancel) { operationLockRef.current = false; return; }
        const errorMessage = err.message || err.toString();
        if (errorMessage.includes("Cannot transition to a new state, already under transition")) {
          if (verbose) {
            console.warn(`QRCodeScanner: Suppressed noisy stop error: ${errorMessage}`, err);
          }
          setScannerState(ScannerInternalState.IDLE);
        } else {
          reportError({ code: 'STOP_FAILED', message: `Failed to stop QR scanner: ${errorMessage}`, rawError: err });
        }
      } finally {
        operationLockRef.current = false;
      }
    };

    if (enabled) {
      if (scannerState === ScannerInternalState.IDLE || scannerState === ScannerInternalState.ERROR) {
        startScanner();
      }
    } else { 
      if (scannerState === ScannerInternalState.SCANNING || scannerState === ScannerInternalState.INITIALIZING) {
        stopScanner();
      }
    }

    return () => {
      didCancel = true;
      const currentInstance = html5QrCodeRef.current;
      if (currentInstance) {
        if (currentInstance.getState && 
            (currentInstance.getState() === window.Html5QrcodeScannerState?.SCANNING || 
             currentInstance.getState() === window.Html5QrcodeScannerState?.PAUSED)) {
            if (verbose) console.log("QRCodeScanner: Cleanup - stopping active scanner instance.");
            currentInstance.stop().catch((e: any) => {
                const stopErrorMessage = e.message || e.toString();
                if (stopErrorMessage.includes("Cannot transition to a new state, already under transition")) {
                    if(verbose) console.warn("QRCodeScanner (Cleanup): Suppressed noisy stop error:", stopErrorMessage);
                } else {
                    if (verbose) console.error("Error stopping scanner during component cleanup:", stopErrorMessage);
                }
            })
            .finally(() => {
                if(operationLockRef.current && html5QrCodeRef.current === currentInstance) { 
                    operationLockRef.current = false;
                }
            });
        } else {
             if(operationLockRef.current && html5QrCodeRef.current === currentInstance) {
                operationLockRef.current = false; 
             }
        }
      } else {
         if (operationLockRef.current && verbose) console.warn("QRCodeScanner: Cleanup found operation lock true but no instance.");
         operationLockRef.current = false; 
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, readerElementId, fps, qrbox, verbose, onScanSuccess, onScanError]); 

  const renderStatusFeedback = () => {
    let message = null;
    let IconComponent = null;
    let bgColor = 'bg-slate-700/70 dark:bg-slate-900/70';
    let textColor = 'text-white dark:text-slate-200';

    if (scannerState === ScannerInternalState.INITIALIZING) {
      message = "Initializing Camera...";
      IconComponent = <IconSpinner className="w-4 h-4 mr-2 text-sky-400" />;
      bgColor = 'bg-sky-600/80 dark:bg-sky-700/80';
    } else if (scannerState === ScannerInternalState.STOPPING) {
      message = "Stopping Camera...";
      IconComponent = <IconSpinner className="w-4 h-4 mr-2 text-slate-400" />;
    } else if (scannerState === ScannerInternalState.ERROR && lastError) {
      message = lastError.message; 
      IconComponent = <IconWarning className="w-4 h-4 mr-2 text-red-300" />;
      bgColor = 'bg-red-600/80 dark:bg-red-700/80';
      textColor = 'text-white dark:text-red-100';
    }

    if (!message) return null;

    return (
      <div 
        className={`absolute bottom-0 left-0 right-0 p-2.5 ${bgColor} ${textColor} text-xs font-medium flex items-center justify-center z-20 transition-all duration-300 ease-in-out`}
        role="status"
        aria-live="polite"
      >
        {IconComponent}
        <span>{message}</span>
      </div>
    );
  };

  return (
    <div className={`relative ${className || ''}`}>
      <div id={readerElementId} className="w-full h-full"></div>
      {renderStatusFeedback()}
    </div>
  );
};
