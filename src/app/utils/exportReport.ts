import JSPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import axios from "axios";

export const exportReportFromServer = async (
  reportId: string,
  type: "png" | "svg" | "pdf",
  asset: boolean = false,
) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API}/report/${reportId}/export/${type}?asset=${asset}`,
    {
      responseType: "blob",
    },
  );

  const blob = new Blob([response.data], {
    type: String(response.headers["Content-Type"]),
  });

  const downloadUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `${asset ? "asset" : "report"}-${reportId}.${type}`;
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
};

export const exportReport = async (
  type: string,
  bgcolor: string,
  filename: string,
  onlyReturnFileData?: boolean,
) => {
  const originalNode = document.getElementById("items-container");
  if (!originalNode) return;

  const node = originalNode.cloneNode(true) as HTMLElement;

  const originalWidth = originalNode.getBoundingClientRect().width;
  const originalHeight = originalNode.getBoundingClientRect().height;

  node.style.width = `${originalWidth}px`;
  node.style.height = `${originalHeight}px`;
  node.style.position = "absolute";
  node.style.top = "0";
  node.style.left = "0";
  node.style.zIndex = "-1000";

  originalNode.parentNode?.appendChild(node);

  const containers = node.getElementsByClassName(
    "order-item-container",
  ) as HTMLCollectionOf<HTMLElement>;
  for (const c of containers) {
    c.style.borderStyle = "none";
  }

  const filter = (el: HTMLElement) => {
    return el.id !== "inline-loader" &&
      el.id !== "page-loader" &&
      el.tagName !== "BUTTON" &&
      el.tagName !== "INPUT" &&
      el.className
      ? el.className?.toString().indexOf("drag-indicator") === -1
      : true;
  };

  const options = {
    filter,
    cacheBust: true,
    backgroundColor: bgcolor,
  };

  const somethingWrong = "oops, something went wrong!";

  try {
    if (type === "png") {
      if (onlyReturnFileData) return await htmlToImage.toBlob(node, options);
      const dataUrl = await htmlToImage.toPng(node, options);
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } else if (type === "svg") {
      const dataUrl = await htmlToImage.toSvg(node, options);
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

      const png = await htmlToImage.toPng(node, options);

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
      const dataUrl = await htmlToImage.toJpeg(node, options);
      const link = document.createElement("a");
      link.download = `${filename}.jpg`;
      link.href = dataUrl;
      link.click();
    }
  } catch (error) {
    console.error(somethingWrong, error);
  } finally {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
};
