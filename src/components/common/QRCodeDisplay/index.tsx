import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

declare global {
  interface Window {
    QRious: any;
  }
}

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  background?: string;
  className?: string;
}

const DEFAULT_BACKGROUND = '#ffffff';
const DEFAULT_FOREGROUND = '#000000';

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 160,
  level = 'M',
  background = DEFAULT_BACKGROUND,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (canvasRef.current && typeof window.QRious !== 'undefined') {
      try {
        new window.QRious({
          element: canvasRef.current,
          value,
          size,
          level,
          background,
          foreground: DEFAULT_FOREGROUND,
        });
      } catch (error) {
        console.error('Error generating QR code with QRious:', error);
      }
    } else if (canvasRef.current && typeof window.QRious === 'undefined') {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = size;
        canvasRef.current.height = size;
        ctx.fillStyle = isDarkMode ? '#334155' : '#e2e8f0';
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = DEFAULT_FOREGROUND;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${size / 10}px sans-serif`;
        ctx.fillText('QR Lib Err', size / 2, size / 2);
      }
      console.error('QRious library not found. Make sure it\'s loaded via CDN.');
    }
  }, [background, isDarkMode, level, size, value]);

  return (
    <canvas
      ref={canvasRef}
      className={`border border-gray-300 dark:border-slate-700 rounded bg-white ${className}`}
    />
  );
};

export default QRCodeDisplay;
