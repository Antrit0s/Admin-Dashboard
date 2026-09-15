import React, { useState } from "react";
import { Fab, CircularProgress, Tooltip } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { exportToPDF } from "../Utils/pdfExport.ts";

interface PagePdfExportButtonProps {
  targetRef?: React.RefObject<HTMLElement | null>;
}

export default function PagePdfExportButton({
  targetRef,
}: PagePdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const targetElement = targetRef?.current || document.querySelector("main");
    if (!targetElement) return;

    try {
      setIsExporting(true);
      const date = new Date().toISOString().slice(0, 10);
      await exportToPDF(targetElement, `dashboard-${date}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Tooltip title="Download page as PDF" placement="left">
      <Fab
        color="primary"
        data-export-ignore="true"
        onClick={handleExport}
        disabled={isExporting}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: (theme) => theme.zIndex.speedDial,
        }}
      >
        {isExporting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <PictureAsPdfIcon />
        )}
      </Fab>
    </Tooltip>
  );
}
