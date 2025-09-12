import { proxyFetch, proxyFetchPost } from "./proxy_manager";
import { puppeteerFetchJson } from "./puppeteerFetch";

export async function fetchWithFetchJson(url: string): Promise<object | null> {
  const response = await fetch(url);
  if (!response) {
    return null;
  }
  try {
    const json = await response.json();
    return json;
  } catch (error) {
    return null;
  }
}

export async function fetchHardJson(url: string) {
  const fetchTools = [
    { tool: proxyFetch, numRetries: 5 },
    { tool: fetchWithFetchJson, numRetries: 1 },
    { tool: puppeteerFetchJson, numRetries: 1 },
  ];

  for (const fetchTool of fetchTools) {
    for (let i = 0; i < fetchTool.numRetries; i++) {
      const jsonObject = await fetchTool.tool(url);
      if (!jsonObject) {
        console.log(`${fetchTool.tool.name} failed, continue`);
        continue;
      }
      return jsonObject;
    }
  }
  return null;
}

export async function fetchHardJsonPost(
  url: string,
  body: any,
  options: { headers?: any; timeout?: number; rawBody?: boolean } = {}
) {
  const fetchTools = [{ tool: proxyFetchPost, numRetries: 5 }];
  for (const fetchTool of fetchTools) {
    for (let i = 0; i < fetchTool.numRetries; i++) {
      const jsonObject = await fetchTool.tool(url, body, options);
      if (!jsonObject) {
        console.log(`${fetchTool.tool.name} failed, continue`);
        continue;
      }
      return jsonObject;
    }
  }
  return null;
}
