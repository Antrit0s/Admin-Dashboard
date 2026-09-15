import { useRef, useState } from "react";
import { toPng } from "html-to-image";

export function useDownloadAsImage<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (filename: string) => {
    if (!ref.current) return;

    setIsDownloading(true);
    try {
      await document.fonts.ready;

      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

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
