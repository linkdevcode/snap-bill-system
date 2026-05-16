import { jsPDF } from "jspdf";

import {
  INVOICE_PDF_WIDTH_PX,
  prepareOffscreenPdfExport,
  preparePdfCloneDocument,
} from "@/lib/invoice-print-styles";

/**
 * Export #invoice-paper to PDF via hidden offscreen clone + html2canvas + jsPDF.
 */
export async function exportInvoiceElementToPdf(
  source: HTMLElement,
  filename: string,
): Promise<void> {
  const html2canvas = (await import("html2canvas")).default;

  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-snapbill-pdf-root", "true");

  const clone = source.cloneNode(true);
  if (!(clone instanceof HTMLElement)) {
    throw new Error("Failed to clone invoice element.");
  }

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    prepareOffscreenPdfExport(wrapper, clone);

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    const captureWidth = wrapper.scrollWidth || INVOICE_PDF_WIDTH_PX;
    const captureHeight = wrapper.scrollHeight;

    if (captureHeight < 1) {
      throw new Error("Invoice capture failed: empty layout.");
    }

    const canvas = await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
      windowWidth: INVOICE_PDF_WIDTH_PX,
      width: captureWidth,
      height: captureHeight,
      onclone: (clonedDoc, clonedRoot) => {
        if (clonedRoot instanceof HTMLElement) {
          preparePdfCloneDocument(clonedDoc, clonedRoot);
        }
      },
    });

    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    if (canvas.width < 1 || canvas.height < 1) {
      throw new Error("Invoice capture failed: blank canvas.");
    }

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    let renderWidth = pageWidth;
    let renderHeight = (canvas.height * renderWidth) / canvas.width;

    if (renderHeight > pageHeight) {
      renderHeight = pageHeight;
      renderWidth = (canvas.width * renderHeight) / canvas.height;
    }

    const offsetX = (pageWidth - renderWidth) / 2;
    const offsetY = 0;

    pdf.addImage(imgData, "JPEG", offsetX, offsetY, renderWidth, renderHeight);
    pdf.save(filename);
  } finally {
    wrapper.remove();
  }
}
