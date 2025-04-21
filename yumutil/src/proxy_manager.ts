import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";
import dayjs from "dayjs";
// Load proxy configuration from environment variables
const webshareProxiesJson = process.env.WEBSHARE_IO_PROXIES;
if (!webshareProxiesJson) {
  throw new Error("WEBSHARE_IO_PROXIES is not set");
}

const initialProxyList = JSON.parse(webshareProxiesJson);
// Maintain a working proxy list at runtime
let workingProxyList = [...initialProxyList];

/**
 * Tests and filters the proxy list to only keep working proxies
 * @param testUrl - URL to test proxies against
 * @param timeoutMs - Timeout in milliseconds for each proxy test (defaults to 5000ms)
 * @returns Array of working proxy strings
 */
export async function rinseProxyList(
  timeoutMs: number = 5000
): Promise<string[]> {
  const testUrl: string = `https://api.resy.com/4/find?lat=0&long=0&day=${dayjs()
    .add(7, "days")
    .format("YYYY-MM-DD")}&party_size=2&venue_id=7074`;

  console.log(`Testing ${initialProxyList.length} proxies for reliability...`);

  // Reset to initial list before testing
  const proxyListToTest = [...initialProxyList];
  const workingProxies: string[] = [];

  // Test each proxy in parallel with a concurrency limit
  const concurrencyLimit = 5;
  const chunks = [];

  // Split into chunks for concurrent processing
  for (let i = 0; i < proxyListToTest.length; i += concurrencyLimit) {
    chunks.push(proxyListToTest.slice(i, i + concurrencyLimit));
  }

  for (const chunk of chunks) {
    const proxyTests = chunk.map(async (proxyString) => {
      const [host, port, username, password] = proxyString.split(":");
      const proxyUrl = `http://${username}:${password}@${host}:${port}`;
      const agent = new HttpsProxyAgent(proxyUrl);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(testUrl, {
          headers: {
            accept: "application/json, text/plain, */*",
            authorization: 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          },
          method: "GET",
          agent: agent,
        });

        clearTimeout(timeoutId);

        if (response.status === 200 || response.status === 400) {
          // 400 is okay as it might mean missing params but proxy worked
          console.log(`Proxy working: ${proxyString}`);
          return proxyString;
        } else {
          console.log(
            `Proxy failed with status ${response.status}: ${proxyString}, proxy: ${proxyUrl}`
          );
          return null;
        }
      } catch (error) {
        console.log(`Proxy failed with error: ${proxyString} - ${error}`);
        return null;
      }
    });

    const results = await Promise.all(proxyTests);
    workingProxies.push(...results.filter(Boolean));
  }

  console.log(
    `Found ${workingProxies.length} working proxies out of ${initialProxyList.length}`
  );

  // Update the working proxy list
  workingProxyList = [...workingProxies];

  return workingProxies;
}

/**
 * Rinses the proxy list and sets the working proxy list to only include reliable proxies
 * @param forceRefresh - Whether to force a refresh even if working proxies exist
 * @returns The number of working proxies
 */
export async function ensureReliableProxies(
  forceRefresh: boolean = false
): Promise<number> {
  if (forceRefresh || workingProxyList.length === 0) {
    console.log("Refreshing proxy list...");
    const rinseResult = await rinseProxyList();
    if (rinseResult.length > 0) {
      workingProxyList = rinseResult;
      return workingProxyList.length;
    } else {
      console.log("No working proxies found, using initial list");
      workingProxyList = [...initialProxyList];
      return workingProxyList.length;
    }
  }
  return workingProxyList.length;
}

/**
 * Gets a random working proxy
 * @returns A proxy string in host:port:username:password format
 */
export function getRandomProxy(): string {
  if (workingProxyList.length === 0) {
    // If no working proxies, reset to initial list
    workingProxyList = [...initialProxyList];
  }

  const randomIndex = Math.floor(Math.random() * workingProxyList.length);
  return workingProxyList[randomIndex];
}

/**
 * Removes a proxy from the working list
 * @param proxyString - The proxy string to remove
 */
export function removeFailedProxy(proxyString: string): void {
  const index = workingProxyList.indexOf(proxyString);
  if (index !== -1) {
    workingProxyList.splice(index, 1);
    console.log(
      `Removed failed proxy: ${proxyString} (${workingProxyList.length} proxies left)`
    );
  }
}

/**
 * Creates an HttpsProxyAgent for a proxy
 * @param proxyString - The proxy string in host:port:username:password format
 * @returns An HttpsProxyAgent object
 */
export function createProxyAgent(proxyString: string): HttpsProxyAgent<string> {
  const [host, port, username, password] = proxyString.split(":");
  const proxyUrl = `http://${username}:${password}@${host}:${port}`;
  return new HttpsProxyAgent(proxyUrl);
}

/**
 * Fetches data from a URL using a proxy
 * @param url - The URL to fetch
 * @param options - Additional fetch options
 * @returns The response data
 */
export async function proxyFetch(
  url: string,
  options: { headers?: any; timeout?: number } = {}
): Promise<any> {
  const randomProxy = getRandomProxy();
  const agent = createProxyAgent(randomProxy);

  const timeout = options.timeout || 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json, text/plain, */*",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        ...options.headers,
      },
      method: "GET",
      agent: agent,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status !== 200) {
      console.log(
        "proxyFetch error",
        url,
        response.status,
        "removing proxy",
        randomProxy
      );
      // Remove failed proxy from the working list
      removeFailedProxy(randomProxy);
      return null;
    }

    try {
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(
        "proxyFetch JSON parse error",
        url,
        "removing proxy",
        randomProxy
      );
      // Remove failed proxy from the working list
      removeFailedProxy(randomProxy);
      return null;
    }
  } catch (error) {
    console.log("proxyFetch fetch error", error, "removing proxy", randomProxy);
    // Remove failed proxy from the working list
    removeFailedProxy(randomProxy);

    // If all proxies are exhausted, try to rinse and find working ones
    if (workingProxyList.length === 0) {
      console.log(
        "All proxies failed, rinsing proxy list to find working ones"
      );
      const rinseResult = await rinseProxyList();

      // If rinsing didn't find any working proxies, fall back to initial list
      if (rinseResult.length === 0) {
        console.log(
          "No working proxies found after rinsing, resetting to initial list"
        );
        workingProxyList = [...initialProxyList];
      }
    }

    return null;
  }
}
