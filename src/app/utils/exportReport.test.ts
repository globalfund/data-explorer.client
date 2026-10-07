import axios from "axios";
import * as htmlToImage from "html-to-image";
import JSPDF from "jspdf";
import { exportReport, exportReportFromServer } from "./exportReport";
jest.mock("axios");
jest.mock("html-to-image", () => ({
  toBlob: jest.fn(),
  toPng: jest.fn(),
  toSvg: jest.fn(),
  toJpeg: jest.fn(),
}));
jest.mock("jspdf", () => jest.fn());

beforeEach(() => {
  document.body.innerHTML =
    '<main><div id="items-container"><div class="order-item-container">Report</div></div></main>';
  jest
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockReturnValue({ width: 800, height: 600 } as DOMRect);
  jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: jest.fn(() => "blob:test"),
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: jest.fn(),
  });
});
afterEach(() => {
  document.body.innerHTML = "";
});
test.each([
  ["png", "toPng", "png"],
  ["svg", "toSvg", "svg"],
  ["jpeg", "toJpeg", "jpg"],
] as const)(
  "exports %s with dimensions and removes the temporary clone",
  async (type, method, extension) => {
    jest.mocked(htmlToImage[method]).mockResolvedValue("data:image/test");
    await exportReport(type, "white", "Annual report");
    const [node, options] = jest.mocked(htmlToImage[method]).mock.calls[0];
    expect(node).not.toBe(document.getElementById("items-container"));
    expect((node as HTMLElement).style).toMatchObject({
      width: "800px",
      height: "600px",
    });
    expect(
      (node as HTMLElement).querySelector<HTMLElement>(".order-item-container")
        ?.style.borderStyle,
    ).toBe("none");
    expect(options).toMatchObject({
      backgroundColor: "white",
      cacheBust: true,
    });
    const anchor = jest.mocked(HTMLAnchorElement.prototype.click).mock
      .instances[0] as unknown as HTMLAnchorElement;
    expect(anchor.download).toBe(`Annual report.${extension}`);
    expect(document.querySelectorAll("#items-container")).toHaveLength(1);
  },
);
test("returns PNG blob data without downloading and still cleans up", async () => {
  const blob = new Blob(["image"]);
  jest.mocked(htmlToImage.toBlob).mockResolvedValue(blob);
  expect(await exportReport("png", "white", "Report", true)).toBe(blob);
  expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled();
  expect(document.querySelectorAll("#items-container")).toHaveLength(1);
});
test("missing export container is a safe no-op", async () => {
  document.body.innerHTML = "";
  await exportReport("png", "white", "Report");
  expect(htmlToImage.toPng).not.toHaveBeenCalled();
});
test("rendering errors clean up the cloned report and keep the original", async () => {
  const error = new Error("render failed");
  jest.mocked(htmlToImage.toPng).mockRejectedValueOnce(error);
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  await exportReport("png", "white", "Report");
  expect(log).toHaveBeenCalledWith("oops, something went wrong!", error);
  expect(document.querySelectorAll("#items-container")).toHaveLength(1);
});
test("PDF export fits and centers the image on the report page", async () => {
  const pdf = {
    internal: { pageSize: { width: 800, height: 600 } },
    getImageProperties: jest.fn(() => ({ width: 400, height: 600 })),
    addImage: jest.fn(),
    save: jest.fn(),
  };
  jest.mocked(JSPDF).mockImplementation(() => pdf as unknown as JSPDF);
  jest.mocked(htmlToImage.toPng).mockResolvedValue("data:png");
  await exportReport("pdf", "white", "Report");
  expect(JSPDF).toHaveBeenCalledWith({
    orientation: "portrait",
    unit: "px",
    format: [800, 600],
  });
  expect(pdf.addImage).toHaveBeenCalledWith(
    "data:png",
    "PNG",
    200,
    0,
    400,
    600,
    "png",
    "SLOW",
  );
  expect(pdf.save).toHaveBeenCalledWith("Report.pdf");
  expect(document.querySelectorAll("#items-container")).toHaveLength(1);
});
test("export filter omits loaders, controls and drag handles while retaining report content", async () => {
  jest.mocked(htmlToImage.toPng).mockResolvedValue("data:png");
  await exportReport("png", "white", "Report");
  const filter = jest.mocked(htmlToImage.toPng).mock.calls[0][1]!.filter!;
  for (const id of ["inline-loader", "page-loader"]) {
    const node = document.createElement("div");
    node.id = id;
    expect(filter(node)).toBe(false);
  }
  for (const tag of ["button", "input"])
    expect(filter(document.createElement(tag))).toBe(false);
  const handle = document.createElement("span");
  handle.className = "drag-indicator active";
  expect(filter(handle)).toBe(false);
  expect(filter(document.createElement("div"))).toBe(true);
});
test.each(["png", "svg", "pdf"] as const)(
  "downloads server report %s and revokes its object URL",
  async (type) => {
    jest.mocked(axios.get).mockResolvedValue({
      data: "file",
      headers: { "Content-Type": "image/test" },
    });
    await exportReportFromServer("report-1", type);
    expect(axios.get).toHaveBeenCalledWith(
      `https://api.example.test/report/report-1/export/${type}?asset=false`,
      { responseType: "blob" },
    );
    const anchor = jest.mocked(HTMLAnchorElement.prototype.click).mock
      .instances[0] as unknown as HTMLAnchorElement;
    expect(anchor.download).toBe(`report-report-1.${type}`);
    expect(anchor.isConnected).toBe(false);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test");
  },
);
test("server asset export uses asset route flag and filename", async () => {
  jest.mocked(axios.get).mockResolvedValue({
    data: "file",
    headers: { "Content-Type": "image/png" },
  });
  await exportReportFromServer("asset-1", "png", true);
  expect(axios.get).toHaveBeenCalledWith(
    expect.stringContaining("?asset=true"),
    expect.any(Object),
  );
  const anchor = jest.mocked(HTMLAnchorElement.prototype.click).mock
    .instances[0] as unknown as HTMLAnchorElement;
  expect(anchor.download).toBe("asset-asset-1.png");
});
test("server errors propagate without creating a download", async () => {
  jest.mocked(axios.get).mockRejectedValueOnce(new Error("Export failed"));
  await expect(exportReportFromServer("report-1", "pdf")).rejects.toThrow(
    "Export failed",
  );
  expect(URL.createObjectURL).not.toHaveBeenCalled();
});
