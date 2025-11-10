import React, { useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ReceiptScanningService, ExtractedReceiptData } from '../services/ReceiptScanningService';

/**
 * @typedef {object} UseReceiptScannerOptions
 * @property {string} apiKey - The API key for the receipt scanning service.
 * @property {number} [confidenceThreshold] - The confidence threshold for the scanning service.
 * @property {function(ExtractedReceiptData): void} [onScanSuccess] - A callback function for when a scan is successful.
 * @property {function(Error): void} [onScanError] - A callback function for when a scan fails.
 */

/**
 * @typedef {object} ReceiptScannerState
 * @property {boolean} isScanning - Whether a scan is in progress.
 * @property {(ExtractedReceiptData | null)} extractedData - The extracted receipt data.
 * @property {(string | null)} error - An error message, if any.
 * @property {(string | null)} imagePreview - A preview of the scanned image.
 */

/**
 * A hook for scanning receipts.
 * @param {UseReceiptScannerOptions} options - The options for the hook.
 * @returns {object} The receipt scanner state and functions.
 */
export const useReceiptScanner = (options: UseReceiptScannerOptions) => {
  const [state, setState] = useState<ReceiptScannerState>({
    isScanning: false,
    extractedData: null,
    error: null,
    imagePreview: null,
  });

  const scanningServiceRef = useRef<ReceiptScanningService | null>(null);

  // Initialize scanning service
  React.useEffect(() => {
    if (options.apiKey) {
      scanningServiceRef.current = new ReceiptScanningService({
        apiKey: options.apiKey,
        confidenceThreshold: options.confidenceThreshold || 0.6,
        retryAttempts: 2,
        timeoutMs: 15000,
      });
    }
  }, [options.apiKey, options.confidenceThreshold]);

  const scanReceipt = useCallback(async (file: File): Promise<ExtractedReceiptData | null> => {
    if (!scanningServiceRef.current) {
      const error = new Error('Receipt scanning service not initialized');
      setState(prev => ({ ...prev, error: error.message }));
      options.onScanError?.(error);
      return null;
    }

    // Reset state
    setState(prev => ({
      ...prev,
      isScanning: true,
      error: null,
      extractedData: null,
    }));

    // Generate image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setState(prev => ({
        ...prev,
        imagePreview: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);

    try {
      const extractedData = await scanningServiceRef.current.scanReceipt(file);
      
      setState(prev => ({
        ...prev,
        isScanning: false,
        extractedData,
        error: null,
      }));

      // Show confidence warnings
      if (extractedData.confidence.overall < 0.8) {
        toast.warning('Some information may need verification. Please review the extracted data.');
      } else {
        toast.success('Receipt scanned successfully!');
      }

      options.onScanSuccess?.(extractedData);
      return extractedData;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to scan receipt';
      
      setState(prev => ({
        ...prev,
        isScanning: false,
        error: errorMessage,
        imagePreview: null,
      }));

      toast.error(errorMessage);
      options.onScanError?.(error as Error);
      return null;
    }
  }, [options]);

  const scanMultipleReceipts = useCallback(async (file: File): Promise<ExtractedReceiptData[]> => {
    if (!scanningServiceRef.current) {
      const error = new Error('Receipt scanning service not initialized');
      setState(prev => ({ ...prev, error: error.message }));
      options.onScanError?.(error);
      return [];
    }

    setState(prev => ({
      ...prev,
      isScanning: true,
      error: null,
    }));

    try {
      const results = await scanningServiceRef.current.scanMultipleReceipts(file);
      
      setState(prev => ({
        ...prev,
        isScanning: false,
        error: null,
      }));

      toast.success(`Scanned ${results.length} receipt(s) successfully!`);
      return results;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to scan receipts';
      
      setState(prev => ({
        ...prev,
        isScanning: false,
        error: errorMessage,
      }));

      toast.error(errorMessage);
      options.onScanError?.(error as Error);
      return [];
    }
  }, [options]);

  const reset = useCallback(() => {
    setState({
      isScanning: false,
      extractedData: null,
      error: null,
      imagePreview: null,
    });
  }, []);

  const retryLastScan = useCallback(async (file: File) => {
    if (file) {
      return await scanReceipt(file);
    }
    return null;
  }, [scanReceipt]);

  return {
    ...state,
    scanReceipt,
    scanMultipleReceipts,
    reset,
    retryLastScan,
    isReady: !!scanningServiceRef.current,
  };
};