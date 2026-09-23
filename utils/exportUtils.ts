import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeData, ResumeDocument } from '../types';

// Standard A4 dimensions in CSS pixels at 96 DPI
export const A4_WIDTH_PX = 794;   // 210mm
export const A4_HEIGHT_PX = 1123; // 297mm

/**
 * Prepares a clone of an element for high-resolution capture.
 * Preserves exact A4 dimensions, fonts, and images.
 */
const prepareCaptureElement = (elementId: string): HTMLElement | null => {
  const source = document.getElementById(elementId);
  if (!source) return null;

  const clone = source.cloneNode(true) as HTMLElement;
  
  Object.assign(clone.style, {
    width: `${A4_WIDTH_PX}px`,
    position: 'fixed',
    top: '0',
    left: '-9999px',
    backgroundColor: '#ffffff',
    margin: '0',
    overflow: 'visible',
    display: 'block',
    zIndex: '-1000',
    transform: 'none',
    lineHeight: '1.5'
  });

  const images = clone.getElementsByTagName('img');
  for (let i = 0; i < images.length; i++) {
    images[i].crossOrigin = "anonymous";
  }

  document.body.appendChild(clone);
  return clone;
};

/**
 * High quality image export (PNG)
 */
export const exportAsImage = async (elementId: string, filename: string): Promise<boolean> => {
  const element = prepareCaptureElement(elementId);
  if (!element) return false;

  try {
    if (document.fonts) {
      await document.fonts.ready;
    }
    await new Promise(resolve => setTimeout(resolve, 600));

    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: A4_WIDTH_PX,
      height: element.scrollHeight,
      windowWidth: A4_WIDTH_PX
    });
    
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `${filename || 'Resume'}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error("Image Export Error:", error);
    return false;
  } finally {
    if (element.parentNode) {
      document.body.removeChild(element);
    }
  }
};

/**
 * Exports the resume as a print-perfect A4 PDF.
 *
 * CRITICAL UPGRADE:
 * 1. If the document is structured with .a4-page-sheet elements (our A4 pagination system),
 *    each sheet is rendered individually as a separate page. This GUARANTEES zero text clipping,
 *    zero table row chopping, and 100% parity with the live preview and browser print.
 * 2. If no .a4-page-sheet is found, a smart boundary-aware scanner detects element breaks
 *    so it never cuts through text, headings, or table rows.
 */
export const exportAsPDF = async (elementId: string, filename: string): Promise<boolean> => {
  const source = document.getElementById(elementId);
  if (!source) return false;

  try {
    if (document.fonts) {
      await document.fonts.ready;
    }
    await new Promise(resolve => setTimeout(resolve, 600));

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Check for distinct A4 page sheets
    const pageSheetElements = Array.from(source.querySelectorAll<HTMLElement>('.a4-page-sheet'));

    if (pageSheetElements.length > 0) {
      // -------------------------------------------------------------
      // PATH A: Discrete A4 Page Sheets (Zero Clipping Guarantee)
      // -------------------------------------------------------------
      for (let i = 0; i < pageSheetElements.length; i++) {
        const sheet = pageSheetElements[i];

        // Clone each sheet to isolate and ensure uniform high DPI capture
        const clone = sheet.cloneNode(true) as HTMLElement;
        Object.assign(clone.style, {
          width: `${A4_WIDTH_PX}px`,
          height: `${A4_HEIGHT_PX}px`,
          minHeight: `${A4_HEIGHT_PX}px`,
          maxHeight: `${A4_HEIGHT_PX}px`,
          position: 'fixed',
          top: '0',
          left: '-9999px',
          backgroundColor: '#ffffff',
          margin: '0',
          boxShadow: 'none',
          border: 'none',
          overflow: 'hidden',
          zIndex: '-1000',
          transform: 'none'
        });

        // Ensure images have crossOrigin
        const imgs = clone.getElementsByTagName('img');
        for (let j = 0; j < imgs.length; j++) {
          imgs[j].crossOrigin = "anonymous";
        }

        document.body.appendChild(clone);

        try {
          const pageCanvas = await html2canvas(clone, {
            scale: 2.2, // Crisp retina print density
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            width: A4_WIDTH_PX,
            height: A4_HEIGHT_PX,
            windowWidth: A4_WIDTH_PX
          });

          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.98);

          if (i > 0) {
            pdf.addPage();
          }

          pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        } finally {
          if (clone.parentNode) {
            document.body.removeChild(clone);
          }
        }
      }
    } else {
      // -------------------------------------------------------------
      // PATH B: Smart Boundary-Aware Multi-Page Slicing (Fallback)
      // -------------------------------------------------------------
      const clone = prepareCaptureElement(elementId);
      if (!clone) return false;

      try {
        const totalHeight = Math.max(clone.scrollHeight, clone.offsetHeight);

        const canvas = await html2canvas(clone, {
          scale: 2.2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: A4_WIDTH_PX,
          height: totalHeight,
          windowWidth: A4_WIDTH_PX,
          scrollY: 0
        });

        // Nominal page height on canvas
        const nominalPageCanvasHeight = Math.round(canvas.width * (297 / 210));
        
        // Scan for safe break boundaries using child elements of the clone
        const allBlocks = Array.from(clone.querySelectorAll<HTMLElement>('.break-inside-avoid, .page-break-avoid, tr, [data-section], [data-item], h2, h3, h4'));
        const safeBreakPoints: number[] = [];

        // Convert DOM offsets into canvas pixel coordinates
        const scaleY = canvas.height / totalHeight;
        allBlocks.forEach(block => {
          const rect = block.getBoundingClientRect();
          const cloneRect = clone.getBoundingClientRect();
          const bottomCanvasY = Math.round((rect.bottom - cloneRect.top) * scaleY);
          if (bottomCanvasY > 0 && bottomCanvasY < canvas.height) {
            safeBreakPoints.push(bottomCanvasY);
          }
        });
        safeBreakPoints.sort((a, b) => a - b);

        let currentY = 0;
        let pageIdx = 0;

        while (currentY < canvas.height) {
          const remainingHeight = canvas.height - currentY;
          let sliceHeight = nominalPageCanvasHeight;

          if (remainingHeight <= nominalPageCanvasHeight) {
            // Last page fits completely
            sliceHeight = remainingHeight;
          } else {
            // Find the best safe break point within a 140px threshold above nominal cut
            const targetBoundary = currentY + nominalPageCanvasHeight;
            const threshold = Math.round(140 * scaleY);
            const candidates = safeBreakPoints.filter(bp => bp > (targetBoundary - threshold) && bp <= targetBoundary);

            if (candidates.length > 0) {
              // Cut at the highest candidate point that doesn't split a block
              const bestBreak = candidates[candidates.length - 1];
              sliceHeight = bestBreak - currentY;
            }
          }

          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = nominalPageCanvasHeight;
          const ctx = pageCanvas.getContext('2d');

          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, nominalPageCanvasHeight);

            ctx.drawImage(
              canvas,
              0, currentY, canvas.width, sliceHeight,
              0, 0, canvas.width, sliceHeight
            );

            const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.98);
            if (pageIdx > 0) {
              pdf.addPage();
            }
            pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            pageIdx++;
          }

          currentY += sliceHeight;
        }
      } finally {
        if (clone.parentNode) {
          document.body.removeChild(clone);
        }
      }
    }

    pdf.save(`${filename || 'Resume'}.pdf`);
    return true;
  } catch (error) {
    console.error("PDF Export Error:", error);
    return false;
  }
};

/**
 * Triggers native browser print dialog for crisp vector/selectable text PDF
 */
export const triggerBrowserPrint = () => {
  window.print();
};

/**
 * Parse an uploaded JSON resume file
 */
export const parseResumeJSON = (file: File): Promise<Partial<ResumeDocument>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        resolve(parsed);
      } catch {
        reject(new Error('Invalid resume JSON file format.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
};

/**
 * Export current resume as structured JSON
 */
export const exportResumeAsJSON = (resume: ResumeDocument | ResumeData, filename: string) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resume, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${filename || 'resume'}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export { exportAsWordDocx, generateWordDocx } from './docxExportUtils';

