/**
 * PDF export styles for #invoice-paper (offscreen wrapper + html2canvas clone).
 * A4 content width at 96 DPI — must match html2canvas windowWidth.
 */
export const INVOICE_PDF_WIDTH_PX = 794;

const BADGE_FONT = "600 12px Arial, Helvetica, sans-serif";
const BADGE_PAD_X = 14;
const BADGE_PAD_Y = 6;
const BADGE_TEXT_SIZE = 12;
const BADGE_BG = "#f1f5f9";
const BADGE_FG = "#1e293b";

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/** Raster badge — html2canvas renders <img> reliably (no split bg/text). */
function createStatusBadgeImage(
  text: string,
  doc: Document,
): HTMLImageElement {
  const scale = 2;
  const measure = doc.createElement("canvas");
  const mctx = measure.getContext("2d");
  let width = 56;
  if (mctx) {
    mctx.font = BADGE_FONT;
    width = Math.ceil(mctx.measureText(text).width + BADGE_PAD_X * 2);
  }
  const height = BADGE_TEXT_SIZE + BADGE_PAD_Y * 2;
  const radius = height / 2;

  const canvas = doc.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const fallback = doc.createElement("img");
    fallback.alt = text;
    return fallback;
  }

  ctx.scale(scale, scale);
  ctx.font = BADGE_FONT;
  roundRectPath(ctx, 0, 0, width, height, radius);
  ctx.fillStyle = BADGE_BG;
  ctx.fill();
  ctx.fillStyle = BADGE_FG;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);

  const img = doc.createElement("img");
  img.src = canvas.toDataURL("image/png");
  img.alt = text;
  img.className = "snapbill-status-badge-img";
  img.width = width;
  img.height = height;
  forceStyle(img, "display", "block");
  forceStyle(img, "width", `${width}px`);
  forceStyle(img, "height", `${height}px`);
  forceStyle(img, "border", "none");
  forceStyle(img, "margin", "0");
  forceStyle(img, "padding", "0");

  return img;
}

function fixStatusMetaLayout(dd: HTMLElement): void {
  const dt = dd.previousElementSibling;
  const cell = dd.closest(".snapbill-meta-status-cell");

  if (cell instanceof HTMLElement) {
    forceStyle(cell, "display", "block");
  }

  if (dt instanceof HTMLElement) {
    forceStyle(dt, "display", "block");
    forceStyle(dt, "margin", "0");
    forceStyle(dt, "padding", "0");
    forceStyle(dt, "margin-bottom", "8px");
  }

  forceStyle(dd, "display", "block");
  forceStyle(dd, "margin", "0");
  forceStyle(dd, "padding", "0");
  forceStyle(dd, "margin-top", "0");
  forceStyle(dd, "min-height", "24px");
  forceStyle(dd, "line-height", "1");

  const img = dd.querySelector<HTMLElement>(".snapbill-status-badge-img");
  if (img) {
    forceStyle(img, "display", "block");
    forceStyle(img, "margin", "0");
    forceStyle(img, "position", "static");
  }
}

const PDF_PAPER_CLASS_STRIP = [
  "max-w-[595px]",
  "w-full",
  "shrink-0",
  "p-10",
  "shadow-[0_1px_3px_rgba(15,23,42,0.12)]",
  "ring-1",
  "ring-black/5",
] as const;

function forceStyle(el: HTMLElement, property: string, value: string): void {
  el.style.setProperty(property, value, "important");
}

function stripPdfLayoutClasses(paper: HTMLElement): void {
  for (const cls of PDF_PAPER_CLASS_STRIP) {
    paper.classList.remove(cls);
  }
}

function applyPaperDimensions(paper: HTMLElement): void {
  stripPdfLayoutClasses(paper);

  forceStyle(paper, "width", `${INVOICE_PDF_WIDTH_PX}px`);
  forceStyle(paper, "max-width", `${INVOICE_PDF_WIDTH_PX}px`);
  forceStyle(paper, "min-width", `${INVOICE_PDF_WIDTH_PX}px`);
  forceStyle(paper, "margin", "0");
  forceStyle(paper, "padding", "10mm 12mm");
  forceStyle(paper, "position", "relative");
  forceStyle(paper, "left", "0");
  forceStyle(paper, "top", "0");
  forceStyle(paper, "float", "none");
}

function fixStatusBadge(paper: HTMLElement, doc: Document): void {
  paper
    .querySelectorAll<HTMLElement>(
      ".snapbill-status-badge-img, .snapbill-status-badge, .snapbill-status-badge-table",
    )
    .forEach((node) => {
      const parentDd = node.closest("dd");
      if (!(parentDd instanceof HTMLElement)) {
        return;
      }

      if (node.classList.contains("snapbill-status-badge-img")) {
        fixStatusMetaLayout(parentDd);
        return;
      }

      const text =
        node.querySelector(".snapbill-status-badge-td")?.textContent?.trim() ||
        node.textContent?.trim() ||
        "";

      if (!text || !node.parentElement) {
        return;
      }

      const img = createStatusBadgeImage(text, doc);
      node.parentElement.replaceChild(img, node);
      fixStatusMetaLayout(parentDd);
    });
}

/** Replace flex totals rows with a real <table> — reliable in html2canvas. */
function convertTotalsToTable(totals: HTMLElement, doc: Document): void {
  if (totals.dataset.snapbillPdfTotalsTable === "true") {
    return;
  }

  const rows = totals.querySelectorAll<HTMLElement>(".snapbill-totals-row");
  if (rows.length === 0) {
    return;
  }

  const table = doc.createElement("table");
  table.className = "snapbill-totals-table";
  table.setAttribute("cellspacing", "0");
  table.setAttribute("cellpadding", "0");

  forceStyle(table, "width", "100%");
  forceStyle(table, "border-collapse", "collapse");
  forceStyle(table, "table-layout", "fixed");

  const rowList = Array.from(rows);

  rowList.forEach((row, index) => {
    const labelText =
      row.querySelector(".snapbill-totals-label")?.textContent?.trim() ?? "";
    const valueText =
      row.querySelector(".snapbill-totals-value")?.textContent?.trim() ?? "";
    const isTotal = row.classList.contains("snapbill-totals-row--total");
    const isRowBeforeTotal = index === rowList.length - 2;

    const tr = doc.createElement("tr");
    const tdLabel = doc.createElement("td");
    const tdValue = doc.createElement("td");

    tdLabel.textContent = labelText;
    tdValue.textContent = valueText;

    forceStyle(tdLabel, "width", "58%");
    forceStyle(tdLabel, "text-align", "left");
    forceStyle(tdLabel, "vertical-align", "middle");
    forceStyle(tdLabel, "padding", "6px 16px 8px 0");
    forceStyle(tdLabel, "color", "#475569");
    forceStyle(tdLabel, "font-size", "14px");
    forceStyle(tdLabel, "line-height", "1.4");
    forceStyle(tdLabel, "white-space", "nowrap");

    forceStyle(tdValue, "width", "42%");
    forceStyle(tdValue, "text-align", "right");
    forceStyle(tdValue, "vertical-align", "middle");
    forceStyle(tdValue, "padding", "6px 0 8px 0");
    forceStyle(tdValue, "color", "#0f172a");
    forceStyle(tdValue, "font-size", "14px");
    forceStyle(tdValue, "font-weight", "600");
    forceStyle(tdValue, "line-height", "1.4");
    forceStyle(tdValue, "white-space", "nowrap");

    if (isRowBeforeTotal) {
      forceStyle(tdLabel, "padding-bottom", "14px");
      forceStyle(tdValue, "padding-bottom", "14px");
    }

    if (isTotal) {
      forceStyle(tdLabel, "border-top", "1px solid #f1f5f9");
      forceStyle(tdValue, "border-top", "1px solid #f1f5f9");
      forceStyle(tdLabel, "font-weight", "800");
      forceStyle(tdLabel, "color", "#0f172a");
      forceStyle(tdLabel, "padding-top", "12px");
      forceStyle(tdValue, "font-weight", "800");
      forceStyle(tdValue, "color", "#4f46e5");
      forceStyle(tdValue, "font-size", "16px");
      forceStyle(tdValue, "padding-top", "12px");
    }

    tr.appendChild(tdLabel);
    tr.appendChild(tdValue);
    table.appendChild(tr);
  });

  totals.innerHTML = "";
  totals.appendChild(table);
  totals.dataset.snapbillPdfTotalsTable = "true";

  forceStyle(totals, "display", "block");
  forceStyle(totals, "width", "100%");
  forceStyle(totals, "max-width", "280px");
  forceStyle(totals, "margin-left", "auto");
  forceStyle(totals, "margin-right", "0");
}

function fixTotalsBlock(paper: HTMLElement, doc: Document): void {
  const totals = paper.querySelector(".snapbill-invoice-totals");
  if (!(totals instanceof HTMLElement)) {
    return;
  }

  convertTotalsToTable(totals, doc);
}

function fixLineItemsTable(paper: HTMLElement): void {
  const mobileList = paper.querySelector(".snapbill-line-items-mobile");
  const desktopTable = paper.querySelector(".snapbill-line-items-desktop");
  if (mobileList instanceof HTMLElement) {
    mobileList.style.display = "none";
  }
  if (desktopTable instanceof HTMLElement) {
    desktopTable.style.display = "block";
    desktopTable.style.overflow = "visible";
  }
}

/** Scoped CSS — only applies under PDF export root, not live UI. */
function injectScopedPdfExportStyles(doc: Document, rootSelector: string): void {
  const styleId = "snapbill-pdf-export-styles";
  const existing = doc.getElementById(styleId);
  if (existing) {
    existing.remove();
  }

  const style = doc.createElement("style");
  style.id = styleId;
  style.textContent = `
    ${rootSelector} {
      width: ${INVOICE_PDF_WIDTH_PX}px !important;
      max-width: ${INVOICE_PDF_WIDTH_PX}px !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
      overflow: visible !important;
    }
    ${rootSelector} #invoice-paper {
      width: ${INVOICE_PDF_WIDTH_PX}px !important;
      max-width: ${INVOICE_PDF_WIDTH_PX}px !important;
      min-width: ${INVOICE_PDF_WIDTH_PX}px !important;
      margin: 0 !important;
      padding: 10mm 12mm !important;
      box-sizing: border-box !important;
      box-shadow: none !important;
      border: none !important;
    }
    ${rootSelector} .snapbill-line-items-mobile { display: none !important; }
    ${rootSelector} .snapbill-line-items-desktop { display: block !important; }
    ${rootSelector} .snapbill-meta-status-cell {
      display: block !important;
    }
    ${rootSelector} .snapbill-meta-status-cell dt {
      display: block !important;
      margin: 0 0 8px 0 !important;
      padding: 0 !important;
    }
    ${rootSelector} .snapbill-meta-status-dd {
      display: block !important;
      margin: 0 !important;
      padding: 0 !important;
      min-height: 24px !important;
    }
    ${rootSelector} .snapbill-status-badge-img {
      display: block !important;
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
      position: static !important;
    }
    ${rootSelector} .snapbill-invoice-totals {
      display: block !important;
      width: 100% !important;
      max-width: 280px !important;
      margin-left: auto !important;
    }
    ${rootSelector} .snapbill-totals-table {
      width: 100% !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
    }
    ${rootSelector} .snapbill-totals-table td:first-child {
      width: 58% !important;
      text-align: left !important;
      padding: 6px 16px 8px 0 !important;
      line-height: 1.4 !important;
      color: #475569 !important;
    }
    ${rootSelector} .snapbill-totals-table td:last-child {
      width: 42% !important;
      text-align: right !important;
      padding: 6px 0 8px 0 !important;
      line-height: 1.4 !important;
      font-weight: 600 !important;
      color: #0f172a !important;
    }
    ${rootSelector} .snapbill-totals-table tr:nth-last-child(2) td {
      padding-bottom: 14px !important;
    }
    ${rootSelector} .snapbill-totals-table tr:last-child td {
      border-top: 1px solid #f1f5f9 !important;
      padding-top: 12px !important;
      font-weight: 800 !important;
    }
    ${rootSelector} .snapbill-totals-table tr:last-child td:last-child {
      color: #4f46e5 !important;
      font-size: 16px !important;
    }
  `;
  doc.head.appendChild(style);
}

function applyPaperExportStyles(paper: HTMLElement, doc: Document): void {
  forceStyle(paper, "box-shadow", "none");
  forceStyle(paper, "border-radius", "0");
  forceStyle(paper, "outline", "none");
  forceStyle(paper, "border", "none");
  forceStyle(paper, "min-height", "0");
  forceStyle(paper, "height", "auto");
  forceStyle(paper, "max-height", "none");
  forceStyle(paper, "background", "#ffffff");
  forceStyle(paper, "color", "#0f172a");
  forceStyle(paper, "box-sizing", "border-box");

  paper.querySelectorAll<HTMLElement>(".snapbill-print-avoid-break").forEach(
    (el) => {
      el.style.breakInside = "avoid";
      el.style.pageBreakInside = "avoid";
    },
  );

  paper.querySelectorAll<HTMLElement>("[data-snapbill-print-hide]").forEach(
    (el) => {
      el.style.display = "none";
    },
  );

  fixLineItemsTable(paper);
  fixTotalsBlock(paper, doc);
  fixStatusBadge(paper, doc);
}

/**
 * Style offscreen wrapper + clone only. Does NOT mutate live page html/body.
 */
export function prepareOffscreenPdfExport(
  wrapper: HTMLElement,
  paper: HTMLElement,
  doc: Document = document,
): void {
  const rootSelector = '[data-snapbill-pdf-root="true"]';
  injectScopedPdfExportStyles(doc, rootSelector);

  forceStyle(wrapper, "width", `${INVOICE_PDF_WIDTH_PX}px`);
  forceStyle(wrapper, "max-width", `${INVOICE_PDF_WIDTH_PX}px`);
  forceStyle(wrapper, "margin", "0");
  forceStyle(wrapper, "padding", "0");
  forceStyle(wrapper, "background", "#ffffff");
  forceStyle(wrapper, "overflow", "visible");
  forceStyle(wrapper, "pointer-events", "none");
  forceStyle(wrapper, "position", "fixed");
  forceStyle(wrapper, "left", "-10000px");
  forceStyle(wrapper, "top", "0");
  forceStyle(wrapper, "visibility", "visible");
  forceStyle(wrapper, "opacity", "1");
  forceStyle(wrapper, "z-index", "-1");

  applyPaperExportStyles(paper, doc);
  applyPaperDimensions(paper);
}

/** html2canvas iframe clone — deep CSS fixes before capture. */
export function preparePdfCloneDocument(
  clonedDoc: Document,
  root: HTMLElement,
): void {
  if (!root.hasAttribute("data-snapbill-pdf-root")) {
    root.setAttribute("data-snapbill-pdf-root", "true");
  }

  const rootSelector = '[data-snapbill-pdf-root="true"]';
  injectScopedPdfExportStyles(clonedDoc, rootSelector);

  clonedDoc.querySelectorAll<HTMLElement>(".snapbill-no-print").forEach((el) => {
    el.style.display = "none";
  });

  const paper =
    root.querySelector("#invoice-paper") ?? root.querySelector("section");
  if (!(paper instanceof HTMLElement)) {
    return;
  }

  forceStyle(root, "width", `${INVOICE_PDF_WIDTH_PX}px`);
  forceStyle(root, "max-width", `${INVOICE_PDF_WIDTH_PX}px`);
  forceStyle(root, "margin", "0");
  forceStyle(root, "padding", "0");
  forceStyle(root, "background", "#ffffff");
  forceStyle(root, "visibility", "visible");
  forceStyle(root, "opacity", "1");

  if (clonedDoc.body) {
    forceStyle(clonedDoc.body, "width", `${INVOICE_PDF_WIDTH_PX}px`);
    forceStyle(clonedDoc.body, "margin", "0");
    forceStyle(clonedDoc.body, "padding", "0");
    forceStyle(clonedDoc.body, "background", "#ffffff");
  }

  applyPaperExportStyles(paper, clonedDoc);
  applyPaperDimensions(paper);
}
