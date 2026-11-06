// Stands in for data-explorer.backend when the e2e tests run in CI. It
// answers the two requests the API server sends it, the same way the real
// backend does, from the dataset files in cypress/fixtures/data-backend.
//
//   node cypress/data-backend-stand-in.mjs     (PORT defaults to 5000)
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const root = new URL("./fixtures/data-backend/", import.meta.url);
const port = Number(process.env.PORT ?? 5000);

const readDataset = async (folder, id) => {
  // Dataset names never contain a path.
  if (!/^[\w-]+$/.test(id)) return null;
  try {
    return JSON.parse(await readFile(new URL(`${folder}/${id}.json`, root)));
  } catch {
    return null;
  }
};

// Mirror load_sample_data and load_parsed_data in rb_core_backend, which
// return an error message instead of data when the file can't be read.
const routes = {
  "sample-data": async (id) => {
    const data = await readDataset("sample-data-files", id);
    if (!data) {
      return "Sorry, this dataset is not available. Please contact us for more information.";
    }
    return {
      count: data.count,
      dataTypes: data.dataTypes,
      sample: data.dataset.slice(0, 10),
      filterOptionGroups: Object.keys(data.dataTypes),
      stats: data.stats,
    };
  },
  dataset: async (id, query) => {
    const data = await readDataset("parsed-data-files", id);
    if (!data) {
      return "Sorry, we were unable to retrieve the data for this dataset. Contact us for more information.";
    }
    const page = Number(query.get("page") ?? 1);
    const pageSize = Number(query.get("page_size") ?? 10);
    const start = (page - 1) * pageSize;
    return {
      count: data.count,
      data: data.dataset.slice(start, start + pageSize),
    };
  },
};

createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  const [, route, id] = url.pathname.split("/");
  let code = 404;
  let result = "Not found";
  if (route === "health-check") {
    code = 200;
    result = "OK";
  } else if (routes[route] && id) {
    result = await routes[route](id, url.searchParams);
    code = typeof result === "string" ? 500 : 200;
  }
  response.writeHead(code, { "content-type": "application/json" });
  response.end(JSON.stringify({ code, result }));
}).listen(port, () => console.log(`Data backend stand-in on port ${port}`));
