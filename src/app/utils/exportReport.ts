import JSPDF from "jspdf";
// @ts-expect-error no types for dom-to-image
import domtoimage from "dom-to-image";

export const exportReport = async (
  type: string,
  bgcolor: string,
  filename: string,
) => {
  const node = document.getElementById("items-container");
  if (!node) return;
  const somethingWrong = "oops, something went wrong!";

  try {
    if (type === "png") {
      const dataUrl = await domtoimage.toPng(node, {
        backgroundColor: bgcolor,
      });
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } else if (type === "svg") {
      const dataUrl = await domtoimage.toSvg(node, {
        backgroundColor: bgcolor,
      });
      const link = document.createElement("a");
      link.download = `${filename}.svg`;
      link.href = dataUrl;
      link.click();
    } else if (type === "pdf") {
      const height = node?.getBoundingClientRect().height as number;
      const width = node?.getBoundingClientRect().width as number;
      const pdf = new JSPDF({
        orientation: "portrait",
        unit: "px",
        format: [width, height],
      });

      const png = await domtoimage.toPng(node, {
        backgroundColor: bgcolor,
      });

      const imgProps = pdf.getImageProperties(png);

      const pdfWidth = pdf.internal.pageSize.width;
      const pdfHeight = pdf.internal.pageSize.height;

      const widthRatio = pdfWidth / imgProps.width;
      const heightRatio = pdfHeight / imgProps.height;
      const ratio = Math.min(widthRatio, heightRatio);

      const w = imgProps.width * ratio;
      const h = imgProps.height * ratio;

      const x = (pdf.internal.pageSize.width - w) / 2;
      pdf.addImage(png, "PNG", x, 0, w, h, "png", "SLOW");
      pdf.save(`${filename}.pdf`);
    } else {
      const dataUrl = await domtoimage.toJpeg(node, {
        backgroundColor: bgcolor,
      });
      const link = document.createElement("a");
      link.download = `${filename}.jpg`;
      link.href = dataUrl;
      link.click();
    }
  } catch (error) {
    console.error(somethingWrong, error);
  }
};
