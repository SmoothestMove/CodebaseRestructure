
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme'; // Import useTheme

/**
 * @description Extends the global Window interface to include the QRious library.
 */
declare global {
  interface Window {
    QRious: any; 
  }
}

/**
 * @interface QRCodeDisplayProps
 * @description Defines the properties for the QRCodeDisplay component.
 */
interface QRCodeDisplayProps {
  /** The value to be encoded in the QR code. */
  value: string;
  /** The size of the QR code in pixels. */
  size?: number;
  /** The error correction level for the QR code. */
  level?: 'L' | 'M' | 'Q' | 'H'; 
  /** The background color of the QR code. */
  background?: string; 
  /** Optional additional CSS classes to apply to the QR code canvas. */
  className?: string;
}

/**
 * A component that displays a QR code using the QRious library.
 * The foreground color of the QR code is automatically adjusted based on the current theme.
 * @param {QRCodeDisplayProps} props - The properties for the QRCodeDisplay component.
 * @returns {JSX.Element} The rendered QRCodeDisplay component.
 */
const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 160,
  level = 'M',
  background = '#ffffff', // Explicitly white for best QR contrast
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDarkMode } = useTheme();

  const foregroundColor = isDarkMode ? '#f8fafc' : '#000000'; // Slate-50 for dark, black for light

  useEffect(() => {
    if (canvasRef.current && typeof window.QRious !== 'undefined') {
      try {
        new window.QRious({
          element: canvasRef.current,
          value: value,
          size: size,
          level: level,
          background: background, // Keep background white
          foreground: foregroundColor, // Use theme-aware foreground
        });
      } catch (error) {
        console.error("Error generating QR code with QRious:", error);
      }
    } else if (canvasRef.current && typeof window.QRious === 'undefined') {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = size;
        canvasRef.current.height = size;
        ctx.fillStyle = isDarkMode ? '#334155' : '#e2e8f0'; // Darker/lighter gray for error bg
        ctx.fillRect(0,0,size,size);
        ctx.fillStyle = foregroundColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${size/10}px sans-serif`;
        ctx.fillText('QR Lib Err', size / 2, size / 2);
      }
      console.error("QRious library not found. Make sure it's loaded via CDN.");
    }
  }, [value, size, level, background, foregroundColor, isDarkMode]); 

  return <canvas ref={canvasRef} className={`border border-gray-300 dark:border-slate-700 rounded ${className}`}></canvas>;
};

export default QRCodeDisplay;