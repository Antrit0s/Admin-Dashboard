import { useRef, useState } from "react";
import html2canvas from "html2canvas";

export function useDownloadAsImage<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (filename: string) => {
    if (!ref.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(ref.current, {
        backgroundColor: null,
        useCORS: true,
        scale: 2,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      link.click();
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return { ref, isDownloading, handleDownload };
}
