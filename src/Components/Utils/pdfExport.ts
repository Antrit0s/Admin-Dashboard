import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export async function exportToPDF(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  await document.fonts.ready;
  // render dom to img
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 1,
  });

  //create img in memory to get width and height
  const img = new Image();
  img.src = dataUrl;
  //tell browser to wait loading image so next we take its W and H
  await new Promise<void>((done) => {
    img.onload = () => done();
  });

  ///set adjusted width and height
  const width = img.width / 2;
  const height = img.height / 2;

  //adjujsting pdf orientation and size
  const pdf = new jsPDF({
    orientation: width >= height ? "landscape" : "portrait",
    unit: "px",
    format: [width, height],
  });

  //saving
  pdf.addImage(dataUrl, "png", 0, 0, width, height, undefined, "FAST");
  pdf.save(filename);
}
