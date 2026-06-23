// @ts-nocheck
import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { FaCamera, FaUpload, FaSpinner, FaTimes, FaCheck, FaExclamationTriangle, FaEdit } from 'react-icons/fa';
import { Expense, Category } from '../types/types';
import { ReceiptScanningService, ExtractedReceiptData } from '../services/ReceiptScanningService';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import ReceiptCameraScanner from './ReceiptCameraScanner';

interface ReceiptScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (expense: Omit<Expense, 'id'>) => void;
  categories: Category[];
  apiKey: string;
}

interface ScanState {
  isScanning: boolean;
  extractedData: ExtractedReceiptData | null;
  imagePreview: string | null;
  step: 'upload' | 'scanning' | 'review';
}

const ReceiptScanModal: React.FC<ReceiptScanModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  categories,
  apiKey,
}) => {
  const [scanState, setScanState] = useState<ScanState>({
    isScanning: false,
    extractedData: null,
    imagePreview: null,
    step: 'upload',
  });

  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);

  const [editedData, setEditedData] = useState({
    merchantName: '',
    amount: 0,
    date: '',
    description: '',
    categoryId: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scanningService = useRef<ReceiptScanningService | null>(null);

  // Initialize scanning service
  React.useEffect(() => {
    if (apiKey) {
      scanningService.current = new ReceiptScanningService({
        apiKey,
        confidenceThreshold: 0.6, // Lower threshold for better UX
        retryAttempts: 2,
        timeoutMs: 15000,
      });
    }
  }, [apiKey]);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setScanState({
        isScanning: false,
        extractedData: null,
        imagePreview: null,
        step: 'upload',
      });
      setEditedData({
        merchantName: '',
        amount: 0,
        date: '',
        description: '',
        categoryId: '',
      });
    }
  }, [isOpen]);

  const handleFileSelect = async (file: File) => {
    if (!scanningService.current) {
      toast.error('Receipt scanning is not properly configured');
      return;
    }

    // Show image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setScanState(prev => ({
        ...prev,
        imagePreview: e.target?.result as string,
        step: 'scanning',
        isScanning: true,
      }));
    };
    reader.readAsDataURL(file);

    try {
      // Start scanning
      const extractedData = await scanningService.current.scanReceipt(file);
      
      // Find best matching category
      const suggestedCategory = findBestMatchingCategory(extractedData.categoryHint);
      
      // Format description with line items if available
      let formattedDescription = extractedData.description;
      if (extractedData.lineItems && extractedData.lineItems.length > 0) {
        const itemsList = extractedData.lineItems.map(item => {
          let itemStr = `• ${item.description}`;
          if (item.quantity && item.quantity > 1) {
            itemStr += ` (×${item.quantity})`;
          }
          if (item.totalAmount) {
            itemStr += ` - $${item.totalAmount.toFixed(2)}`;
          }
          return itemStr;
        }).join('\n');
        
        formattedDescription = `${extractedData.description}\n\nItems:\n${itemsList}`;
      }

      // Update edited data with extracted information
      setEditedData({
        merchantName: extractedData.merchantName,
        amount: extractedData.amount,
        date: extractedData.date,
        description: formattedDescription,
        categoryId: suggestedCategory?.id || (categories.length > 0 ? categories[0].id : ''),
      });

      setScanState(prev => ({
        ...prev,
        extractedData,
        isScanning: false,
        step: 'review',
      }));

      // Show confidence warning if needed
      if (extractedData.confidence.overall < 0.8) {
        toast.warning('Some information may need verification. Please review the extracted data.');
      } else {
        toast.success('Receipt scanned successfully!');
      }

    } catch (error) {
      console.error('Receipt scanning error:', error);
      setScanState(prev => ({
        ...prev,
        isScanning: false,
        step: 'upload',
        imagePreview: null,
      }));
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to scan receipt';
      toast.error(errorMessage);
    }
  };

  const findBestMatchingCategory = (categoryHint?: string): Category | null => {
    if (!categoryHint) return null;
    
    // Exact name match first
    let match = categories.find(cat => 
      cat.name.toLowerCase() === categoryHint.toLowerCase()
    );
    
    if (match) return match;
    
    // Partial match
    match = categories.find(cat => 
      cat.name.toLowerCase().includes(categoryHint.toLowerCase()) ||
      categoryHint.toLowerCase().includes(cat.name.toLowerCase())
    );
    
    return match;
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleCameraCapture = (imageDataUrl: string) => {
    setIsCameraScannerOpen(false);
    
    // Convert data URL to File object for processing
    const byteString = atob(imageDataUrl.split(',')[1]);
    const mimeString = imageDataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const file = new File([ab], 'camera-receipt.jpg', { type: mimeString });
    
    // Process the captured image
    handleFileSelect(file);
  };

  const handleConfirm = () => {
    if (!editedData.merchantName.trim()) {
      toast.error('Merchant name is required');
      return;
    }

    if (editedData.amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    const expense: Omit<Expense, 'id'> = {
      categoryId: editedData.categoryId,
      amount: editedData.amount,
      date: editedData.date,
      merchantName: editedData.merchantName,
      description: editedData.description,
      receiptImageBase64: scanState.imagePreview ? 
        scanState.imagePreview.split(',')[1] : undefined,
    };

    onConfirm(expense);
    onClose();
  };

  const handleStartOver = () => {
    setScanState({
      isScanning: false,
      extractedData: null,
      imagePreview: null,
      step: 'upload',
    });
    setEditedData({
      merchantName: '',
      amount: 0,
      date: '',
      description: '',
      categoryId: '',
    });
  };

  const renderConfidenceIndicator = (confidence: number, label: string) => {
    const getConfidenceColor = (conf: number) => {
      if (conf >= 0.8) return 'text-green-500';
      if (conf >= 0.6) return 'text-yellow-500';
      return 'text-red-500';
    };

    const getConfidenceIcon = (conf: number) => {
      if (conf >= 0.8) return <FaCheck className="w-3 h-3" />;
      if (conf >= 0.6) return <FaExclamationTriangle className="w-3 h-3" />;
      return <FaTimes className="w-3 h-3" />;
    };

    return (
      <div className={`flex items-center gap-1 text-xs ${getConfidenceColor(confidence)}`}>
        {getConfidenceIcon(confidence)}
        <span>{label}: {Math.round(confidence * 100)}%</span>
      </div>
    );
  };

  const renderUploadStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCamera className="w-8 h-8 text-brand-primary" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
          Scan Your Receipt
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Choose how you'd like to add your receipt
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {/* Camera Scan Button */}
        <button
          onClick={() => setIsCameraScannerOpen(true)}
          className="w-full p-6 border-2 border-slate-300 dark:border-slate-600 rounded-lg hover:border-brand-primary dark:hover:border-brand-primary transition-colors group"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-brand-primary/10 group-hover:bg-brand-primary/20 rounded-full flex items-center justify-center transition-colors">
              <FaCamera className="w-6 h-6 text-brand-primary" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-slate-900 dark:text-white">Scan with Camera</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Take a live photo with your device camera</p>
            </div>
          </div>
        </button>

        {/* File Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-6 border-2 border-slate-300 dark:border-slate-600 rounded-lg hover:border-brand-primary dark:hover:border-brand-primary transition-colors group"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 dark:bg-green-900/30 dark:group-hover:bg-green-900/50 rounded-full flex items-center justify-center transition-colors">
              <FaUpload className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-slate-900 dark:text-white">Upload Receipt</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Choose an existing image or PDF file</p>
            </div>
          </div>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FaCamera className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
              For best results:
            </h4>
            <ul className="text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Ensure the receipt is well-lit and clearly visible</li>
              <li>• Keep the camera steady and avoid shadows</li>
              <li>• Include the entire receipt in the frame</li>
              <li>• Make sure text is readable and not blurry</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScanningStep = () => (
    <div className="text-center py-8">
      <div className="mb-6">
        {scanState.imagePreview && (
          <img
            src={scanState.imagePreview}
            alt="Receipt preview"
            className="max-h-48 mx-auto rounded-lg shadow-md"
          />
        )}
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <FaSpinner className="absolute inset-0 m-auto w-6 h-6 text-brand-primary animate-pulse" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            Scanning Receipt...
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            AI is extracting information from your receipt
          </p>
        </div>
        
        <div className="w-full max-w-xs bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div className="bg-brand-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => {
    if (!scanState.extractedData) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Review Extracted Data
          </h3>
          <div className="flex gap-2">
            {renderConfidenceIndicator(scanState.extractedData.confidence.overall, 'Overall')}
          </div>
        </div>

        {scanState.imagePreview && (
          <div className="text-center">
            <img
              src={scanState.imagePreview}
              alt="Receipt"
              className="max-h-32 mx-auto rounded-lg shadow-md"
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Merchant Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={editedData.merchantName}
                onChange={(e) => setEditedData(prev => ({ ...prev, merchantName: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <div className="absolute right-2 top-2">
                {renderConfidenceIndicator(scanState.extractedData.confidence.merchantName, '')}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Amount ($)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={editedData.amount}
                onChange={(e) => setEditedData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <div className="absolute right-2 top-2">
                {renderConfidenceIndicator(scanState.extractedData.confidence.amount, '')}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={editedData.date}
                onChange={(e) => setEditedData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <div className="absolute right-2 top-2">
                {renderConfidenceIndicator(scanState.extractedData.confidence.date, '')}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={editedData.categoryId}
              onChange={(e) => setEditedData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {scanState.extractedData.categoryHint && (
              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                AI suggested: {scanState.extractedData.categoryHint}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            value={editedData.description}
            onChange={(e) => setEditedData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="Add any additional details..."
          />
        </div>

        {scanState.extractedData.confidence.overall < 0.7 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Low Confidence Detection
                </h4>
                <p className="text-yellow-700 dark:text-yellow-300">
                  The AI had difficulty reading some parts of this receipt. Please verify all information is correct.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getStepContent = () => {
    switch (scanState.step) {
      case 'upload':
        return renderUploadStep();
      case 'scanning':
        return renderScanningStep();
      case 'review':
        return renderReviewStep();
      default:
        return renderUploadStep();
    }
  };

  const getModalTitle = () => {
    switch (scanState.step) {
      case 'upload':
        return 'Scan Receipt';
      case 'scanning':
        return 'Processing Receipt';
      case 'review':
        return 'Review & Add Expense';
      default:
        return 'Scan Receipt';
    }
  };

  return (
    <>
      <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      size="md"
    >
      <div className="space-y-4">
        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            ['upload', 'scanning', 'review'].includes(scanState.step) 
              ? 'bg-brand-primary text-white' 
              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
          }`}>
            1
          </div>
          <div className={`h-1 w-16 ${
            ['scanning', 'review'].includes(scanState.step) 
              ? 'bg-brand-primary' 
              : 'bg-slate-200 dark:bg-slate-700'
          }`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            ['scanning', 'review'].includes(scanState.step) 
              ? 'bg-brand-primary text-white' 
              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
          }`}>
            {scanState.isScanning ? <FaSpinner className="animate-spin" /> : '2'}
          </div>
          <div className={`h-1 w-16 ${
            scanState.step === 'review' 
              ? 'bg-brand-primary' 
              : 'bg-slate-200 dark:bg-slate-700'
          }`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            scanState.step === 'review' 
              ? 'bg-brand-primary text-white' 
              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
          }`}>
            3
          </div>
        </div>

        {/* Step content */}
        {getStepContent()}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          {scanState.step === 'review' && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleStartOver}
              leftIcon={<FaEdit />}
            >
              Scan Different Receipt
            </Button>
          )}
          
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={scanState.isScanning}
          >
            Cancel
          </Button>
          
          {scanState.step === 'review' && (
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirm}
              leftIcon={<FaCheck />}
            >
              Add Expense
            </Button>
          )}
        </div>
      </div>
    </Modal>

    {/* Camera Scanner Modal */}
    <ReceiptCameraScanner
      isOpen={isCameraScannerOpen}
      onCapture={handleCameraCapture}
      onClose={() => setIsCameraScannerOpen(false)}
    />
  </>
  );
};

export default ReceiptScanModal;
