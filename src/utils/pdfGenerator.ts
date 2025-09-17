// utils/pdfGenerator.ts

import { jsPDF } from 'jspdf';
import type { Owner } from '@/types';
import type { OwnerOrSpace } from '@/types';
import { 
  getDisplayName,
  isLegacyOwner,
  legacyOwnerToModern
} from '@/types';

// Declare QRious globally as it's loaded via CDN in index.html
declare global {
  interface Window {
    QRious: any;
  }
}

interface LabelDataForPdf {
  boxId: string; // Human-readable ID for the text on label
  qrCodeValue: string; // Value to be encoded in QR (usually same as boxId)
  ownerColor: string;
}

const normalizeEntity = (entity: Owner | OwnerOrSpace): OwnerOrSpace => {
  if (isLegacyOwner(entity)) {
    return legacyOwnerToModern(entity);
  }
  return entity as OwnerOrSpace;
};

const buildFilenameSlug = (displayName: string): string => {
  if (!displayName) {
    return 'labels';
  }

  return displayName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\-\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const generateLabelPdf = async (labelsData: LabelDataForPdf[], entity: Owner | OwnerOrSpace) => {
  const modernEntity = normalizeEntity(entity);
  const displayName = getDisplayName(modernEntity) || modernEntity.uid;
  const filenameSlug = buildFilenameSlug(displayName);

  const doc = new jsPDF({
    unit: 'in', 
    format: 'letter' // 8.5 x 11 inches
  });

  // --- Page Dimensions ---
  // const pageWidth = 8.5; // inches - available from doc.internal.pageSize.getWidth()
  // const pageHeight = 11.0; // inches - available from doc.internal.pageSize.getHeight()

  // --- Individual Label Dimensions (as per prompt) ---
  const labelWidth = 2.50; // inches
  const labelHeight = 3.00; // inches

  // --- Margins from Page Edge (as per prompt) ---
  const topMargin = 0.46;    // inches
  const leftMargin = 0.50;   // inches
  // const rightMargin = 0.50;  // inches (pageWidth - leftMargin - 3 * labelWidth)
  // const bottomMargin = 1.00; // inches (pageHeight - topMargin - 3 * labelHeight - 2 * verticalGutter)


  // --- Spacing Between Labels (as per prompt) ---
  const horizontalGutter = 0; // inches (No horizontal gap)
  const verticalGutter = 0.35; // inches (Vertical gap between rows)

  // --- QR Code Placement and Size within Each Label (as per prompt) ---
  const qrCodeRenderSize = 2.10; // inches (actual QR code size on label)
  const qrCodePaddingLeft = 0.20; // inches (from left edge of label to QR code)
  const qrCodePaddingTop = 0.40;  // inches (from top edge of label to QR code)

  // --- Text (Box ID) Placement and Size within Each Label (as per prompt) ---
  // const textWidth = 2.10; // inches (width of the Box ID text block) - Used for alignment
  // const textHeight = 0.29; // inches (height of the Box ID text lettering) - Font size handles this
  const textMarginTopFromQR = 0.20; // inches (space between bottom of QR code and top of text)
  // const textPaddingBottom = 0.05; // inches (from bottom of text block to bottom of label) - Font size and centering handle this within remaining space


  let labelsRenderedOnPage = 0;
  const labelsPerPage = 9; // 3x3 grid

  for (let i = 0; i < labelsData.length; i++) {
    const label = labelsData[i];

    if (i > 0 && i % labelsPerPage === 0) {
      doc.addPage();
      labelsRenderedOnPage = 0;
    }

    const col = labelsRenderedOnPage % 3; // 0, 1, 2
    const row = Math.floor(labelsRenderedOnPage / 3); // 0, 1, 2

    const labelX = leftMargin + (col * (labelWidth + horizontalGutter));
    const labelY = topMargin + (row * (labelHeight + verticalGutter));

    // --- Generate QR Code (using QRious from window.QRious) ---
    const qrCodeCanvas = document.createElement('canvas');
    const qrCodeCanvasPixelSize = qrCodeRenderSize * 300; // Aim for 300 DPI for print

    await new Promise<void>((resolve, reject) => {
      if (typeof window.QRious === 'undefined') {
        console.error("QRious library not found. Make sure it's loaded via CDN.");
        return reject(new Error("QRious not loaded"));
      }
      try {
        new window.QRious({
          element: qrCodeCanvas,
          value: label.qrCodeValue,
          size: qrCodeCanvasPixelSize, 
          level: 'H', 
          background: '#FFFFFF', 
          foreground: label.ownerColor, 
        });
        resolve();
      } catch (error) {
        console.error("Error generating QR code with QRious:", error);
        reject(error);
      }
    });

    const qrCodeDataUrl = qrCodeCanvas.toDataURL('image/png');

    // --- Add QR Code Image to PDF ---
    doc.addImage(
      qrCodeDataUrl,
      'PNG',
      labelX + qrCodePaddingLeft, 
      labelY + qrCodePaddingTop,  
      qrCodeRenderSize,            
      qrCodeRenderSize             
    );

    // --- Add Box ID Text to PDF ---
    doc.setFont('helvetica', 'bold'); 
    // Estimate font size to fit within approx 0.29in height. This is trial and error.
    // Increased font size for better visibility.
    const fontSizePt = 22; // Increased from 16
    doc.setFontSize(fontSizePt); 
    doc.setTextColor('#000000'); 

    const textYPosition = labelY + qrCodePaddingTop + qrCodeRenderSize + textMarginTopFromQR;
    
    // For centering text, jsPDF's text function with align: 'center' uses the x-coordinate as the center point.
    doc.text(
      label.boxId, 
      labelX + labelWidth / 2, // Center of the full label width
      textYPosition, 
      { align: 'center', baseline: 'top' } // Align text center, baseline top for textMarginTopFromQR
    );

    labelsRenderedOnPage++;
  }

  doc.save(`${filenameSlug || modernEntity.uid}-labels.pdf`);
};
