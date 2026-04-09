import JSPDF from "jspdf";
import * as htmlToImage from "html-to-image";

export async function exportChart(
  id: string,
  type: string,
  data: {
    headers: string[];
    data: (string | number)[][];
  },
  exportName: string,
) {
  const backgroundColor = "#ffffff";
  return new Promise((resolve, reject) => {
    const node = document.getElementById(id);
    if (!node) return;
    const filter = (n: any) =>
      n.id !== "page-ornament" &&
      n.id !== "viz-floating-buttons" &&
      n.id !== "viz-sidepanel-background";
    if (type === "jpg") {
      htmlToImage
        .toJpeg(node, { filter, backgroundColor })
        .then((dataUrl: any) => {
          const link = document.createElement("a");
          link.download = `${exportName}.jpg`;
          link.href = dataUrl;
          link.click();
          resolve({});
        })
        .catch((error: any) => {
          console.error("oops, something went wrong!", error);
          reject("oops, something went wrong!");
        });
    } else if (type === "svg") {
      htmlToImage
        .toSvg(node, { backgroundColor })
        .then((dataUrl: any) => {
          const link = document.createElement("a");
          link.download = `${exportName}.svg`;
          link.href = dataUrl;
          link.click();
          resolve({});
        })
        .catch((error: any) => {
          console.error("oops, something went wrong!", error);
          reject("oops, something went wrong!");
        });
    } else if (type === "pdf") {
      htmlToImage
        .toPng(node, { filter, backgroundColor })
        .then((dataUrl: any) => {
          const pdf = new JSPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });
          const imgProps = pdf.getImageProperties(dataUrl);

          const pdfWidth = pdf.internal.pageSize.width;
          const pdfHeight = pdf.internal.pageSize.height;

          const widthRatio = pdfWidth / imgProps.width;
          const heightRatio = pdfHeight / imgProps.height;
          const ratio = Math.min(widthRatio, heightRatio);

          const w = imgProps.width * ratio;
          const h = imgProps.height * ratio;

          const x = (pdf.internal.pageSize.width - w) / 2;

          // pdf.addImage(background, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.addImage(dataUrl, "PNG", x, 0, w, h);

          pdf.save(`${exportName}.pdf`);
          resolve({});
        })
        .catch((error: any) => {
          console.error("oops, something went wrong!", error);
          reject("oops, something went wrong!");
        });
    } else if (type === "csv") {
      const csv = [];
      csv.push(data.headers.join(","));
      const rows = data.data;
      for (const value of rows) {
        csv.push(Object.values(value).join(","));
      }
      const csvString = csv.join("\n");
      const link = document.createElement("a");
      link.download = `${exportName}.csv`;
      link.href = `data:text/csv;charset=utf-8,${csvString}`;
      link.click();
      resolve({});
    } else {
      htmlToImage
        .toPng(node, { filter, backgroundColor })
        .then((dataUrl: any) => {
          const link = document.createElement("a");
          link.download = `${exportName}.png`;
          link.href = dataUrl;
          link.click();
          resolve({});
        })
        .catch((error: any) => {
          console.error("oops, something went wrong!", error);
          reject("oops, something went wrong!");
        });
    }
  });
}
