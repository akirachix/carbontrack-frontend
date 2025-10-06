"use client";
import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiDownload } from "react-icons/fi";

interface DownloadPDFButtonProps {
  headers: string[];
  rows: string[][];
  filename?: string;
  subtitle?: string;
}

function DownloadPDFButton({
  headers,
  rows,
  filename = "TableData",
  subtitle = "",
}: DownloadPDFButtonProps) {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(25);
    doc.setTextColor("#2A4759");
    doc.text("Report", 14, 16);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 22,
      theme: "grid",
      columnStyles: { 4: { cellWidth: 25 } },
      styles: {
        fontSize: 10,
        minCellHeight: 12,
        cellPadding: 3,
        valign: "middle",
      },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [234, 242, 248] },
      didDrawCell: (data) => {
        const { cell } = data;
        if (cell.height !== 12) {
          cell.height = 12;
        }
      },
    });

    doc.setFontSize(18);
    doc.setFontSize(12);

    if (subtitle) doc.text(subtitle, 120, 10);
    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDownloadPDF}
        disabled={rows.length === 0}
        className="2xl:p-2 xl:p-2 lg:p-1 rounded-lg bg-red-500 text-white shadow hover:bg-red-400 hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        title="Download records as PDF"
        aria-label="Download PDF"
      >
        <FiDownload size={20} className="cursor-pointer" />
      </button>
      <span
        className={`font-semibold select-none cursor-pointer ${rows.length === 0 ? "opacity-50 pointer-events-none" : ""}`}
        onClick={rows.length === 0 ? undefined : handleDownloadPDF}
        title="Download records as PDF"
        role="button"
        tabIndex={0}
        onKeyPress={e => {
          if (e.key === "Enter" && rows.length > 0) handleDownloadPDF();
        }}
        aria-disabled={rows.length === 0}
      >
        Download PDF
      </span>
    </div>
  );
}

export default DownloadPDFButton;