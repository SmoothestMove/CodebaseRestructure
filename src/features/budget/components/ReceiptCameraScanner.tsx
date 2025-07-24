import React, { useEffect, useRef, useState, useId } from 'react';
import { FaCamera, FaTimes, FaCheck } from 'react-icons/fa';

interface ReceiptCameraScannerProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const ReceiptCameraScanner: React.FC<ReceiptCameraScannerProps> = ({
  onCapture,
  onClose,
  isOpen,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setIsInitializing(true);
    setError(null);

    try {
      // Request camera access with back camera preference
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        videoRef.current.onloadedmetadata = () => {
          setIsReady(true);
          setIsInitializing(false);
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please ensure you have granted camera permissions.');
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsReady(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !isReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to data URL (JPEG format for better file size)
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    // Stop camera and call callback
    stopCamera();
    onCapture(imageDataUrl);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full max-w-4xl mx-4 bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Scan Receipt with Camera
          </h3>
          <button
            onClick={handleClose}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Camera View */}
        <div className="relative bg-black">
          {isInitializing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Initializing camera...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center text-white p-8">
                <p className="text-lg mb-4">{error}</p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-96 object-cover"
            playsInline
            muted
            style={{ display: error ? 'none' : 'block' }}
          />

          {/* Overlay guide */}
          {isReady && !error && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Receipt frame guide */}
              <div className="absolute inset-8 border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                <div className="text-white text-center bg-black bg-opacity-50 p-4 rounded-lg">
                  <FaCamera className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Position receipt within frame</p>
                  <p className="text-xs mt-1">Ensure text is clear and readable</p>
                </div>
              </div>
            </div>
          )}

          {/* Hidden canvas for image capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={captureImage}
              disabled={!isReady || error !== null}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <FaCheck className="w-4 h-4" />
              Capture Receipt
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              • Position the receipt clearly within the frame<br />
              • Ensure good lighting and avoid shadows<br />
              • Keep the camera steady when capturing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptCameraScanner;