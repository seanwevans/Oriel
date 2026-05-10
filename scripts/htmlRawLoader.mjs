import { readFile } from "node:fs/promises";

const RAW_HTML_SUFFIX = ".html?raw";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith(RAW_HTML_SUFFIX)) {
    const url = new URL(specifier, context.parentURL).href;
    return { shortCircuit: true, url };
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.endsWith(RAW_HTML_SUFFIX)) {
    const fileUrl = new URL(url);
    fileUrl.search = "";
    const source = await readFile(fileUrl, "utf8");
    return {
      format: "module",
      shortCircuit: true,
      source: `export default ${JSON.stringify(source)};`
    };
  }

  return nextLoad(url, context);
}
